import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildShareUrl, decodeRecipe, encodeRecipe, recipeShareText, recipeSlug, toSharedPayload } from '@/lib/share-recipe';
import type { Recipe } from '@/types';

const recipe: Recipe = {
  id: 'recipe-123',
  title: 'Tomato Onion Curry',
  description: 'A simple, comforting curry.',
  matchPercentage: 90,
  cookTime: 25,
  difficulty: 'easy',
  image: 'https://images.unsplash.com/photo-1?w=800',
  imageCredit: { name: 'Jane Doe', url: 'https://unsplash.com/@jane?utm_source=currycue' },
  ingredients: [
    { id: 'a', name: 'Tomato', quantity: '2', unit: 'pcs' },
    { id: 'b', name: 'Onion', quantity: '1', unit: 'pcs' },
    { id: 'c', name: 'Salt' },
  ],
  steps: ['Chop the onion and tomato.', 'Fry the onion.', 'Add the tomato and simmer.'],
  cuisine: 'Indian',
  tags: ['quick', 'vegetarian'],
  usedIngredients: [{ id: 'a', name: 'Tomato' }],
  missingIngredients: [{ id: 'm', name: 'Cream' }],
  usesExpiring: ['Tomato'],
};

// Builds a link payload by hand, the way someone writing a malicious link would
async function handMade(payload: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const compressed = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
  return Buffer.from(compressed).toString('base64url');
}

test('a recipe survives the trip through a link', async () => {
  const decoded = await decodeRecipe(await encodeRecipe(recipe));
  assert.ok(decoded);
  assert.equal(decoded.title, 'Tomato Onion Curry');
  assert.equal(decoded.cookTime, 25);
  assert.equal(decoded.difficulty, 'easy');
  assert.equal(decoded.cuisine, 'Indian');
  assert.deepEqual(decoded.steps, recipe.steps);
  assert.deepEqual(decoded.tags, ['quick', 'vegetarian']);
  assert.deepEqual(decoded.ingredients.map((item) => [item.name, item.quantity, item.unit]), [['Tomato', '2', 'pcs'], ['Onion', '1', 'pcs'], ['Salt', undefined, undefined]]);
  assert.equal(decoded.image, 'https://images.unsplash.com/photo-1?w=800');
  assert.deepEqual(decoded.imageCredit, { name: 'Jane Doe', url: 'https://unsplash.com/@jane?utm_source=currycue' });
});

test('what depends on the sender\'s pantry is not shared', async () => {
  const payload = JSON.stringify(toSharedPayload(recipe));
  assert.ok(!/Cream|usedIngredients|missing|matchPercentage|expiring/i.test(payload));
  const decoded = await decodeRecipe(await encodeRecipe(recipe));
  assert.equal(decoded?.matchPercentage, 0);
  assert.deepEqual(decoded?.usedIngredients, []);
  assert.deepEqual(decoded?.missingIngredients, []);
});

test('the same recipe always gets the same id, a different one does not', async () => {
  const first = await decodeRecipe(await encodeRecipe(recipe));
  const again = await decodeRecipe(await encodeRecipe(recipe));
  const other = await decodeRecipe(await encodeRecipe({ ...recipe, title: 'Other Curry' }));
  assert.equal(first?.id, again?.id);
  assert.notEqual(first?.id, other?.id);
  assert.match(first!.id, /^shared-/);
});

test('garbage, tampered and empty links are refused', async () => {
  for (const bad of [undefined, '', 'not a payload!', 'AAAA', '////', 'a'.repeat(20000)]) assert.equal(await decodeRecipe(bad), null, String(bad).slice(0, 20));
  const good = await encodeRecipe(recipe);
  assert.equal(await decodeRecipe(good.slice(0, -10)), null);
});

test('a hand-made link must still be a real recipe', async () => {
  assert.equal(await decodeRecipe(await handMade({ v: 1, t: 'No steps', i: [], s: [] })), null);
  assert.equal(await decodeRecipe(await handMade({ v: 1, i: [], s: ['x'] })), null);
  assert.equal(await decodeRecipe(await handMade({ v: 99, t: 'Wrong version', i: [], s: ['x'] })), null);
  assert.equal(await decodeRecipe(await handMade(['array'])), null);
  const ok = await decodeRecipe(await handMade({ v: 1, t: 'Fine', i: [['Rice']], s: ['Cook it'] }));
  assert.equal(ok?.title, 'Fine');
});

test('a link cannot point the page at an image on another server', async () => {
  const evil = await handMade({ v: 1, t: 'Tracker', i: [['Rice']], s: ['Cook'], p: 'https://evil.example/pixel.png', a: ['Mallory', 'https://evil.example'] });
  const decoded = await decodeRecipe(evil);
  assert.equal(decoded?.image, '');
  assert.equal(decoded?.imageCredit, undefined);

  const fakeCredit = await handMade({ v: 1, t: 'T', i: [['Rice']], s: ['Cook'], p: 'https://images.unsplash.com/x', a: ['Mallory', 'https://evil.example/unsplash.com'] });
  assert.equal((await decodeRecipe(fakeCredit))?.imageCredit, undefined);
  const lookalike = await handMade({ v: 1, t: 'T', i: [['Rice']], s: ['Cook'], p: 'https://images.unsplash.com.evil.example/x' });
  assert.equal((await decodeRecipe(lookalike))?.image, '');
  const insecure = await handMade({ v: 1, t: 'T', i: [['Rice']], s: ['Cook'], p: 'http://images.unsplash.com/x' });
  assert.equal((await decodeRecipe(insecure))?.image, '');
});

test('data that inflates enormously when unpacked is refused', async () => {
  const bomb = await handMade({ v: 1, t: 'Bomb', i: [['Rice']], s: ['x'.repeat(2_000_000)] });
  assert.ok(bomb.length < 6000, 'it is small on the wire');
  assert.equal(await decodeRecipe(bomb), null);
});

test('overlong text and long lists are cut down by the usual cleaning', async () => {
  const decoded = await decodeRecipe(await handMade({ v: 1, t: 'T'.repeat(1000), i: Array.from({ length: 300 }, (_, i) => [`Item ${i}`]), s: Array.from({ length: 200 }, () => 'Stir') }));
  assert.ok(decoded);
  assert.equal(decoded.title.length, 200);
  assert.ok(decoded.ingredients.length <= 100);
  assert.ok(decoded.steps.length <= 60);
});

test('slugs read like the recipe name', () => {
  assert.equal(recipeSlug('Tomato Onion Curry'), 'tomato-onion-curry');
  assert.equal(recipeSlug('  Paneer — Butter Masala!! '), 'paneer-butter-masala');
  assert.equal(recipeSlug('Crème brûlée'), 'creme-brulee');
  assert.equal(recipeSlug('खिचड़ी'), 'recipe');
  assert.ok(recipeSlug('a '.repeat(100)).length <= 60);
});

test('the share link puts the readable name in the path and the recipe after it', async () => {
  const url = await buildShareUrl('https://curry-cue.vercel.app', recipe);
  assert.ok(url);
  assert.match(url, /^https:\/\/curry-cue\.vercel\.app\/recipe\/tomato-onion-curry\/\?d=[A-Za-z0-9_-]+$/);
  const encoded = new URL(url).searchParams.get('d')!;
  assert.equal((await decodeRecipe(encoded))?.title, 'Tomato Onion Curry');
});

test('a recipe that is too big for a link gives no link', async () => {
  // Random text does not compress, so this is as big as a recipe can get on the wire
  const noise = () => Buffer.from(Array.from({ length: 700 }, () => Math.floor(Math.random() * 256))).toString('base64');
  const huge = { ...recipe, steps: Array.from({ length: 12 }, noise) };
  assert.equal(await buildShareUrl('https://curry-cue.vercel.app', huge), null);
});

test('the share text is readable on its own', () => {
  const text = recipeShareText(recipe, 'https://curry-cue.vercel.app/recipe/x/?d=abc');
  assert.match(text, /^🍛 Tomato Onion Curry\nIndian · 25 min · easy\n\nIngredients:\n• 2 pcs Tomato\n• 1 pcs Onion\n• Salt\n\nSteps:\n1\. Chop the onion and tomato\.\n2\. Fry the onion\.\n3\. Add the tomato and simmer\.\n\nOpen it in CurryCue: https:\/\/curry-cue\.vercel\.app\/recipe\/x\/\?d=abc$/);
  assert.ok(!recipeShareText(recipe, null).includes('Open it in CurryCue'));
});
