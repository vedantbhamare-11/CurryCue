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

const PANTRY = [
  { id: 'p1', name: 'tomato', quantity: '2', unit: 'pcs' },
  { id: 'p2', name: 'onion', quantity: '1', unit: 'pcs' },
];

// Everything external is faked: the AI answers with a fixed recipe and there are never any dish photos
test.beforeEach(async ({ page }) => {
  await page.route('**/api/ai/**', (route) =>
    route.fulfill({ json: { text: JSON.stringify(RECIPE_FROM_AI), usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, finishReason: 'stop' } })
  );
  await page.route('**/api/dish-photo**', (route) => route.fulfill({ json: { photo: null } }));
});

// Fills the pantry before the app loads, but only once, so reloads keep whatever the test did since
async function seedPantry(page: Page) {
  await page.addInitScript((pantry) => {
    if (!localStorage.getItem('ingredient-storage')) {
      localStorage.setItem('ingredient-storage', JSON.stringify({ state: { ingredients: pantry }, version: 0 }));
    }
  }, PANTRY);
}

async function generateAndOpenRecipe(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Generate Recipes' }).click();
  await expect(page.getByRole('heading', { name: 'Tomato Onion Curry' })).toBeVisible();
  await page.getByRole('button', { name: /View Recipe/ }).click();
  await expect(page.getByRole('dialog', { name: 'Tomato Onion Curry' })).toBeVisible();
}

test('pantry: add an ingredient from the suggestions and keep it after a reload', async ({ page }) => {
  await page.goto('/ingredients');
  await page.getByRole('combobox').fill('tomat');
  await page.getByRole('option').first().click();
  await expect(page.getByText('Tomato', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText('Tomato', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Remove Tomato' }).click();
  await expect(page.getByText('Tomato', { exact: true })).toBeHidden();
});

test('pantry: typing something not in the list adds it as typed', async ({ page }) => {
  await page.goto('/ingredients');
  await page.getByRole('combobox').fill('dragon fruit');
  await page.getByRole('combobox').press('Enter');
  await expect(page.getByText('dragon fruit', { exact: true })).toBeVisible();
});

test('recipes: generate, open the dialog, and close it with Escape', async ({ page }) => {
  await seedPantry(page);
  await generateAndOpenRecipe(page);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('recipes: a favourited recipe shows up on the Recipes page', async ({ page }) => {
  await seedPantry(page);
  await generateAndOpenRecipe(page);
  await page.getByRole('button', { name: 'Add to favorites' }).click();
  await page.getByRole('button', { name: 'Close recipe' }).click();

  await page.goto('/recipes');
  await expect(page.getByRole('heading', { name: 'Tomato Onion Curry' })).toBeVisible();
});

test('cooking mode: step through the recipe, set a timer, finish', async ({ page }) => {
  await seedPantry(page);
  await generateAndOpenRecipe(page);
  await page.getByRole('button', { name: 'Start Cooking Mode' }).click();

  // The step is also repeated in the assistant chat, so match the step card's own text
  await expect(page.getByText('Chop the onion and tomato.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous step' })).toBeDisabled();

  await page.getByRole('button', { name: '1 min' }).click();
  await expect(page.getByLabel('Timer countdown')).toBeVisible();

  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByText('Fry the onion until golden.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next step' }).click();
  await page.getByRole('button', { name: 'Finish recipe' }).click();

  await expect(page.getByText(/Congratulations/)).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByText(/Congratulations/)).toBeHidden();
});

test('shopping list: add what a recipe is missing, buy it, move it to the pantry', async ({ page }) => {
  await seedPantry(page);
  await generateAndOpenRecipe(page);
  await page.getByRole('button', { name: 'Add to shopping list' }).click();
  await expect(page.getByText(/Added 1 item to your shopping list/)).toBeVisible();

  await page.goto('/shopping-list');
  await expect(page.getByText('Cream')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Mark Cream as bought' }).click();
  await page.getByRole('button', { name: /Move 1 to pantry/ }).click();

  await page.goto('/ingredients');
  await expect(page.getByText(/^cream$/i)).toBeVisible();
});

test('shopping list: a saved list with missing fields repairs itself instead of crashing', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('shopping-list-storage', JSON.stringify({ state: { items: [{ id: 's1', name: 'Milk' }, null, { name: '  ' }] }, version: 0 }));
  });
  await page.goto('/shopping-list');
  await expect(page.getByText('Milk')).toBeVisible();
  await expect(page.getByText("This page couldn't load")).toBeHidden();
});

test('dark mode: the toggle switches the theme and remembers it', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(html).not.toHaveClass(/dark/);
});
