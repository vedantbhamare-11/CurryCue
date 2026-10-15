import { test, expect, type Page } from '@playwright/test';

// A phone-sized screen. The layout rules for phones (header order, bottom sheet, sizes) only apply here.
test.use({ viewport: { width: 390, height: 700 } });

const RECIPE_FROM_AI = [
  {
    id: '1',
    title: 'Tomato Onion Curry',
    description: 'A simple, comforting curry.',
    matchPercentage: 90,
    cookTime: 25,
    difficulty: 'easy',
    usedIngredients: [
      { name: 'Tomato', quantity: '2', unit: 'pcs' },
      { name: 'Onion', quantity: '1', unit: 'pcs' },
    ],
    assumedIngredients: [{ name: 'Salt', quantity: 'to taste' }],
    missingIngredients: [{ name: 'Cream', quantity: '100', unit: 'ml' }],
    steps: ['Chop the onion and tomato.', 'Fry the onion until golden.', 'Add the tomato and simmer.'],
    cuisine: 'Indian',
    tags: ['quick', 'vegetarian'],
  },
];

const pantryOf = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: `p${index}`, name: index === 0 ? 'tomato' : index === 1 ? 'onion' : `item ${index}`, quantity: '1', unit: 'pcs' }));

test.beforeEach(async ({ page }) => {
  await page.route('**/api/ai/**', (route) =>
    route.fulfill({ json: { text: JSON.stringify(RECIPE_FROM_AI), usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, finishReason: 'stop' } })
  );
  await page.route('**/api/dish-photo**', (route) => route.fulfill({ json: { photo: null } }));
});

async function seedPantry(page: Page, count = 2) {
  await page.addInitScript((pantry) => {
    if (!localStorage.getItem('ingredient-storage')) {
      localStorage.setItem('ingredient-storage', JSON.stringify({ state: { ingredients: pantry }, version: 0 }));
    }
  }, pantryOf(count));
}

async function openRecipeByTappingTheCard(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Generate Recipes' }).click();
  // Tap the title, not the "View Recipe" button: the whole card should open it
  await page.getByRole('heading', { name: 'Tomato Onion Curry' }).click();
  await expect(page.getByRole('dialog', { name: 'Tomato Onion Curry' })).toBeVisible();
}

test('header: dark mode, shopping bag, then the menu button on the far right', async ({ page }) => {
  await page.goto('/');
  const x = async (name: string | RegExp) => (await page.getByRole(name instanceof RegExp ? 'link' : 'button', { name }).first().boundingBox())!.x;
  const dark = await x('Switch to dark mode');
  const bag = (await page.getByRole('link', { name: /Shopping list/ }).boundingBox())!.x;
  const menu = await x('Open menu');
  expect(dark).toBeLessThan(bag);
  expect(bag).toBeLessThan(menu);
});

test('menu: Home, My Ingredients, Recipes and Shopping List each have an icon', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  for (const name of ['Home', 'My Ingredients', 'Recipes', 'Shopping List']) {
    await expect(page.getByRole('link', { name, exact: true }).locator('svg')).toBeVisible();
  }
});

test('Get Started sits close above Your Ingredients, and scrolls straight to it', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Get Started' });
  const heading = page.getByRole('heading', { name: 'Your Ingredients' });

  // No screen-high empty space between the button and the next section
  const gap = (await heading.boundingBox())!.y - (await button.boundingBox())!.y;
  expect(gap).toBeLessThan(250);

  await button.click();
  await expect(async () => {
    const top = (await heading.boundingBox())!.y;
    expect(top).toBeGreaterThan(60); // not hidden behind the header
    expect(top).toBeLessThan(160); // right under it
  }).toPass();
  await expect(page.getByRole('heading', { name: /Know What to Cook/ })).not.toBeInViewport();
});

test('a long pantry scrolls inside its own box instead of stretching the page', async ({ page }) => {
  await seedPantry(page, 40);
  await page.goto('/ingredients');
  const list = page.locator('div.overflow-y-auto', { has: page.getByRole('button', { name: 'Remove Item 2' }) }).first();
  const { scrollHeight, clientHeight } = await list.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }));
  expect(scrollHeight).toBeGreaterThan(clientHeight);
  expect(clientHeight).toBeLessThan(400);
});

test('tapping anywhere on a recipe card opens it, and the whole dialog fits the screen', async ({ page }) => {
  await seedPantry(page);
  await openRecipeByTappingTheCard(page);
  const box = (await page.getByRole('dialog', { name: 'Tomato Onion Curry' }).boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(700);
});

test('cooking mode: ingredients open as a bottom sheet on a phone', async ({ page }) => {
  await seedPantry(page);
  await openRecipeByTappingTheCard(page);
  await page.getByRole('button', { name: 'Start Cooking Mode' }).click();
  await page.getByRole('button', { name: 'Show ingredients' }).click();

  const sheet = page.getByRole('dialog', { name: 'Ingredients' });
  await expect(sheet).toBeVisible();
  const box = (await sheet.locator('div.rounded-t-2xl').boundingBox())!;
  expect(box.y + box.height).toBeCloseTo(700, 0); // sits on the bottom edge
  expect(box.height).toBeLessThanOrEqual(700 * 0.7 + 1);

  await sheet.getByRole('button', { name: 'Close ingredients' }).click();
  await expect(sheet).toBeHidden();
});

test('finishing a recipe shows the congratulations card on screen, even when scrolled down', async ({ page }) => {
  await seedPantry(page);
  await openRecipeByTappingTheCard(page);
  await page.getByRole('button', { name: 'Start Cooking Mode' }).click();
  await page.getByRole('button', { name: 'Next step' }).click();
  await page.getByRole('button', { name: 'Next step' }).click();
  // Like a real phone: the cooking screen has been scrolled down by the time Finish is tapped
  await page.evaluate(() => document.querySelectorAll('*').forEach((el) => { if (el.scrollHeight > el.clientHeight + 20) el.scrollTop = el.scrollHeight; }));
  await page.getByRole('button', { name: 'Finish recipe' }).click();

  await expect(page.getByText(/Congratulations/)).toBeInViewport();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByText(/Congratulations/)).toBeHidden();
});

// Nothing may be drawn over the card: in the app's fullscreen mode the cooking screen used to sit on top of it
test('finishing in fullscreen: the congratulations card is on top of the cooking screen', async ({ page }) => {
  await seedPantry(page);
  await openRecipeByTappingTheCard(page);
  await page.getByRole('button', { name: 'Start Cooking Mode' }).click();
  await page.getByRole('button', { name: 'Enter fullscreen' }).click();
  await expect(page.getByRole('button', { name: 'Exit fullscreen' })).toBeVisible();
  await page.getByRole('button', { name: 'Next step' }).click();
  await page.getByRole('button', { name: 'Next step' }).click();
  await page.getByRole('button', { name: 'Finish recipe' }).click();

  const heading = page.getByRole('heading', { name: /Congratulations/ });
  await expect(heading).toBeVisible();
  const onTop = await heading.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    return hit === el || el.contains(hit);
  });
  expect(onTop).toBe(true);
});
