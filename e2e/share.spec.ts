import { test, expect, type Page } from '@playwright/test';

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

test.beforeEach(async ({ page }) => {
  await page.route('**/api/ai/**', (route) =>
    route.fulfill({ json: { text: JSON.stringify(RECIPE_FROM_AI), usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, finishReason: 'stop' } })
  );
  await page.route('**/api/dish-photo**', (route) => route.fulfill({ json: { photo: null } }));
});

async function seedPantry(page: Page, names: string[]) {
  await page.addInitScript((pantry) => {
    if (!localStorage.getItem('ingredient-storage')) {
      localStorage.setItem('ingredient-storage', JSON.stringify({ state: { ingredients: pantry }, version: 0 }));
    }
  }, names.map((name, index) => ({ id: `p${index}`, name, quantity: '1', unit: 'pcs' })));
}

// Sender: generates the recipe and taps Share. Returns what was handed to the phone's share sheet.
async function shareFromSender(page: Page): Promise<{ title: string; text: string }> {
  await page.addInitScript(() => {
    (navigator as unknown as { share: (data: unknown) => Promise<void> }).share = async (data) => {
      (window as unknown as { __shared: unknown }).__shared = data;
    };
  });
  await seedPantry(page, ['tomato', 'onion']);
  await page.goto('/');
  await page.getByRole('button', { name: 'Generate Recipes' }).click();
  await page.getByRole('button', { name: /View Recipe/ }).click();
  await page.getByRole('button', { name: 'Share recipe' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __shared?: unknown }).__shared)).toBeTruthy();
  return page.evaluate(() => (window as unknown as { __shared: { title: string; text: string } }).__shared);
}

const linkIn = (text: string) => text.match(/https?:\/\/\S+/)![0];

test('sharing sends readable text and a link that opens the same recipe for someone else', async ({ page, browser }) => {
  const shared = await shareFromSender(page);
  expect(shared.title).toBe('Tomato Onion Curry');
  expect(shared.text).toContain('Ingredients:');
  expect(shared.text).toContain('1. Chop the onion and tomato.');
  const link = linkIn(shared.text);
  expect(link).toMatch(/\/recipe\/tomato-onion-curry\/\?d=/);

  // Someone else: a fresh browser with their own, different pantry
  const friend = await browser.newContext();
  const friendPage = await friend.newPage();
  await seedPantry(friendPage, ['onion']);
  await friendPage.goto(link);

  const dialog = friendPage.getByRole('dialog', { name: 'Tomato Onion Curry' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Instructions' }).click();
  // The step shows in the full list and in the step overview, so just the first match
  await expect(dialog.getByText('Chop the onion and tomato.').first()).toBeVisible();
  await dialog.getByRole('button', { name: 'Ingredients', exact: true }).click();

  // What they have and what they lack is worked out from THEIR pantry, not the sender's
  const have = dialog.locator('div', { hasText: /^From Your Kitchen:/ }).first();
  await expect(have).toContainText(/onion/i);
  await expect(have).not.toContainText(/tomato/i);
  await expect(dialog.getByText("You'll Also Need:")).toBeVisible();

  // They can keep it, and it shows up in their recipes
  await dialog.getByRole('button', { name: 'Add to favorites' }).click();
  await friendPage.goto('/recipes');
  await expect(friendPage.getByRole('heading', { name: 'Tomato Onion Curry' })).toBeVisible();
  await friend.close();
});

test('the page behind the link carries the recipe in its preview tags', async ({ page, request }) => {
  const link = linkIn((await shareFromSender(page)).text);
  const html = await (await request.get(link)).text();
  expect(html).toMatch(/<meta property="og:title" content="Tomato Onion Curry"/);
  expect(html).toMatch(/<meta property="og:description" content="[^"]*curry[^"]*"/i);
  expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/);
});

test('a broken or cut-off link says so instead of crashing', async ({ page }) => {
  const link = linkIn((await shareFromSender(page)).text);
  for (const bad of [link.slice(0, -25), link.replace(/\?d=.*/, '?d=nonsense'), link.replace(/\?d=.*/, '')]) {
    await page.goto(bad);
    await expect(page.getByRole('heading', { name: "This recipe link doesn't work" })).toBeVisible();
  }
  await page.getByRole('link', { name: 'Go to CurryCue' }).click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
});

test('without a share sheet (desktop), the recipe and link are copied to the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined }));
  await seedPantry(page, ['tomato', 'onion']);
  await page.goto('/');
  await page.getByRole('button', { name: 'Generate Recipes' }).click();
  await page.getByRole('button', { name: /View Recipe/ }).click();
  await page.getByRole('button', { name: 'Share recipe' }).click();

  await expect(page.getByText('Recipe and link copied to the clipboard!')).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('🍛 Tomato Onion Curry');
  expect(copied).toMatch(/Open it in CurryCue: http\S+\/recipe\/tomato-onion-curry\/\?d=/);
});
