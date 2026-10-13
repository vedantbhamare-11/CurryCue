import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBackup, backupFileName, parseBackup, mergeBackup, BACKUP_VERSION, MAX_BACKUP_BYTES, type BackupData } from '@/lib/backup';
import type { Ingredient, Recipe } from '@/types';

const recipe = (id: string, extra: Partial<Recipe> = {}): Recipe => ({
  id, title: `Recipe ${id}`, description: 'd', matchPercentage: 80, cookTime: 30, difficulty: 'easy', image: 'https://images.example.com/a.jpg',
  ingredients: [{ id: 'i1', name: 'Rice' }], steps: ['Cook.'], cuisine: 'Indian', tags: ['quick'], ...extra,
});
const sample = (): BackupData => ({
  ingredients: [{ id: 'a', name: 'Tomato', quantity: '250', unit: 'gm', expiresOn: '2026-10-20' }, { id: 'b', name: 'Rice' }],
  shoppingList: [{ id: 's1', name: 'Paneer', quantity: '200', unit: 'gm', checked: false, addedAt: 1, recipes: ['Palak Paneer'] }, { id: 's2', name: 'Milk', checked: true, addedAt: 2, recipes: [] }],
  favoriteRecipes: [recipe('r1'), recipe('r2')],
  recentRecipes: [recipe('r3')],
  preferences: { dietaryRestrictions: ['vegetarian'], allergies: [], cuisinePreferences: ['Indian'], skillLevel: 'beginner', mealTypes: ['dinner'], cookingTime: { min: 0, max: 45 } },
});
const parse = (value: unknown) => parseBackup(typeof value === 'string' ? value : JSON.stringify(value));
const wrap = (data: unknown, extra: object = {}) => ({ app: 'curry-cue', version: 1, exportedAt: '2026-10-14T10:00:00.000Z', data, ...extra });

test('a backup round-trips exactly', () => {
  const data = sample();
  const result = parseBackup(JSON.stringify(createBackup(data, new Date(2026, 9, 14, 10))));
  assert.ok(result.ok);
  assert.deepEqual(result.data.ingredients, data.ingredients);
  assert.deepEqual(result.data.shoppingList, data.shoppingList);
  assert.deepEqual(result.data.preferences, data.preferences);
  assert.equal(result.data.favoriteRecipes.length, 2);
  assert.equal(result.data.favoriteRecipes[0].title, 'Recipe r1');
  assert.deepEqual(result.summary, { ingredients: 2, shoppingItems: 2, favoriteRecipes: 2, recentRecipes: 1, exportedAt: createBackup(data, new Date(2026, 9, 14, 10)).exportedAt });
});

test('file name uses the local date', () => assert.equal(backupFileName(new Date(2026, 9, 5, 23, 59)), 'currycue-backup-2026-10-05.json'));

test('files that are not backups are rejected with a clear message', () => {
  for (const [label, input] of Object.entries({ 'not JSON': '{oops', 'empty': '', 'a number': '42', 'an array': '[]', 'null': 'null', 'a string': '"hi"', 'wrong app': wrap({}, { app: 'something-else' }), 'no data': { app: 'curry-cue', version: 1 }, 'data is a string': wrap('x'), 'data is an array': wrap([]) })) {
    const result = parse(input);
    assert.equal(result.ok, false, label);
    if (!result.ok) assert.ok(result.error.length > 10, label);
  }
});

test('version handling', () => {
  assert.equal(parse(wrap({}, { version: BACKUP_VERSION + 1 })).ok, false, 'newer version');
  assert.match((parse(wrap({}, { version: 99 })) as { error: string }).error, /newer version/);
  for (const bad of [0, -1, 1.5, '1', null, undefined]) assert.equal(parse(wrap({}, { version: bad })).ok, false, String(bad));
  assert.equal(parse(wrap({})).ok, true);
});

test('an oversized file is refused before parsing', () => {
  const result = parseBackup(' '.repeat(MAX_BACKUP_BYTES + 1));
  assert.equal(result.ok, false);
});

test('missing lists become empty lists, never undefined', () => {
  const result = parse(wrap({}));
  assert.ok(result.ok);
  assert.deepEqual([result.data.ingredients, result.data.shoppingList, result.data.favoriteRecipes, result.data.recentRecipes], [[], [], [], []]);
  assert.equal(result.data.preferences, undefined);
});

test('type confusion is survived: wrong types are dropped or coerced, never crash', () => {
  const result = parse(wrap({
    ingredients: [null, 5, 'x', [], { name: 123 }, { name: '   ' }, { name: 'Good', quantity: 250, unit: ['kg'], id: 7 }, { id: 'k', name: 'Kept', expiresOn: 20261020 }],
    shoppingList: 'nope', favoriteRecipes: { not: 'a list' }, recentRecipes: 7, preferences: 'str',
  }));
  assert.ok(result.ok);
  assert.deepEqual(result.data.ingredients.map((i) => i.name), ['Good', 'Kept']);
  assert.equal(result.data.ingredients[0].quantity, undefined, 'a number is not a quantity string');
  assert.equal(result.data.ingredients[0].unit, undefined);
  assert.equal(typeof result.data.ingredients[0].id, 'string', 'a missing/invalid id is regenerated');
  assert.equal(result.data.ingredients[1].expiresOn, undefined);
  assert.deepEqual([result.data.shoppingList, result.data.favoriteRecipes, result.data.recentRecipes], [[], [], []]);
  assert.equal(result.data.preferences, undefined);
});

test('dates: only real calendar dates survive', () => {
  const result = parse(wrap({ ingredients: ['2026-10-20', '2026-02-31', '2026-13-01', 'tomorrow', '', '2026-1-5'].map((d, i) => ({ id: `i${i}`, name: `Item${i}`, expiresOn: d })) }));
  assert.ok(result.ok);
  assert.deepEqual(result.data.ingredients.map((i) => i.expiresOn), ['2026-10-20', undefined, undefined, undefined, undefined, undefined]);
});

test('prototype pollution attempts are inert', () => {
  const evil = '{"app":"curry-cue","version":1,"data":{"__proto__":{"polluted":true},"ingredients":[{"name":"X","id":"1","__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}]},"__proto__":{"polluted":true}}';
  const result = parseBackup(evil);
  assert.ok(result.ok);
  assert.equal(({} as Record<string, unknown>).polluted, undefined, 'Object.prototype must not be polluted');
  assert.equal(Object.prototype.hasOwnProperty.call(result.data.ingredients[0], '__proto__'), false);
  assert.deepEqual(Object.keys(result.data.ingredients[0]).sort(), ['id', 'name']);
});

test('unknown fields are dropped (whitelist, not spread)', () => {
  const result = parse(wrap({ ingredients: [{ id: 'a', name: 'Rice', password: 'hunter2', __internal: { x: 1 }, onclick: 'alert(1)' }], extraTopLevel: [1, 2, 3] }));
  assert.ok(result.ok);
  assert.deepEqual(Object.keys(result.data.ingredients[0]).sort(), ['id', 'name']);
  assert.equal('extraTopLevel' in result.data, false);
});

test('images: only https URLs are kept', () => {
  const result = parse(wrap({
    ingredients: [{ id: 'a', name: 'A', image: 'javascript:alert(1)' }, { id: 'b', name: 'B', image: 'data:text/html,<script>' }, { id: 'c', name: 'C', image: 'http://insecure.example/x.png' }, { id: 'd', name: 'D', image: 'https://ok.example/x.png' }],
    favoriteRecipes: [{ ...recipe('r1'), image: 'javascript:alert(1)' }, recipe('r2')],
  }));
  assert.ok(result.ok);
  assert.deepEqual(result.data.ingredients.map((i) => i.image), [undefined, undefined, undefined, 'https://ok.example/x.png']);
  assert.equal(result.data.favoriteRecipes[0].image, '', 'a bad recipe image becomes empty, not an error');
  assert.equal(result.data.favoriteRecipes[1].image, 'https://images.example.com/a.jpg');
});

test('long strings and huge lists are truncated to sane limits', () => {
  const result = parse(wrap({
    ingredients: Array.from({ length: 800 }, (_, i) => ({ id: `i${i}`, name: 'x'.repeat(500) })),
    favoriteRecipes: [{ ...recipe('r1'), title: 'T'.repeat(5000), steps: Array.from({ length: 300 }, () => 'S'.repeat(5000)), tags: Array.from({ length: 50 }, (_, i) => `tag${i}`) }],
    recentRecipes: Array.from({ length: 40 }, (_, i) => recipe(`recent${i}`)),
  }));
  assert.ok(result.ok);
  assert.equal(result.data.ingredients.length, 500);
  assert.equal(result.data.ingredients[0].name.length, 100);
  assert.equal(result.data.favoriteRecipes[0].title.length, 200);
  assert.equal(result.data.favoriteRecipes[0].steps.length, 60);
  assert.equal(result.data.favoriteRecipes[0].steps[0].length, 1000);
  assert.equal(result.data.favoriteRecipes[0].tags.length, 12);
  assert.equal(result.data.recentRecipes.length, 10);
});

test('recipes that cannot be cooked are dropped; numbers are clamped; defaults are filled', () => {
  const result = parse(wrap({
    favoriteRecipes: [
      { id: 'no-title', steps: ['x'] }, { id: 'no-steps', title: 'T' }, { id: 'empty-steps', title: 'T', steps: ['', '  ', 7] },
      { id: 'ok', title: 'Minimal', steps: ['Do it'], matchPercentage: 5000, cookTime: -20, difficulty: 'impossible', ingredients: 'wrong' },
    ],
  }));
  assert.ok(result.ok);
  assert.deepEqual(result.data.favoriteRecipes.map((r) => r.id), ['ok']);
  const kept = result.data.favoriteRecipes[0];
  assert.equal(kept.matchPercentage, 100);
  assert.equal(kept.cookTime, 0);
  assert.equal(kept.difficulty, 'medium');
  assert.equal(kept.cuisine, 'General');
  assert.deepEqual(kept.ingredients, []);
});

test('duplicate ids collapse to the first', () => {
  const result = parse(wrap({ ingredients: [{ id: 'same', name: 'First' }, { id: 'same', name: 'Second' }], favoriteRecipes: [recipe('r1'), { ...recipe('r1'), title: 'Dup' }] }));
  assert.ok(result.ok);
  assert.deepEqual(result.data.ingredients.map((i) => i.name), ['First']);
  assert.deepEqual(result.data.favoriteRecipes.map((r) => r.title), ['Recipe r1']);
});

test('a recipe\'s ingredient lists are sanitised too', () => {
  const result = parse(wrap({ favoriteRecipes: [{ ...recipe('r1'), usedIngredients: [{ name: 'Rice', expiresOn: 'bad' }, null], missingIngredients: [{ name: 'Paneer', quantity: '200', unit: 'g' }, { name: '' }], usesExpiring: ['Rice', 5] }] }));
  assert.ok(result.ok);
  const r = result.data.favoriteRecipes[0];
  assert.deepEqual(r.usedIngredients?.map((i) => i.name), ['Rice']);
  assert.deepEqual(r.missingIngredients?.map((i) => i.name), ['Paneer']);
  assert.deepEqual(r.usesExpiring, ['Rice']);
});

test('preferences are rebuilt with safe defaults', () => {
  const result = parse(wrap({ preferences: { skillLevel: 'wizard', dietaryRestrictions: ['vegan', 7, null], cookingTime: { min: -5, max: 'x' }, evil: 1 } }));
  assert.ok(result.ok);
  assert.equal(result.data.preferences?.skillLevel, 'intermediate');
  assert.deepEqual(result.data.preferences?.dietaryRestrictions, ['vegan']);
  assert.deepEqual(result.data.preferences?.cookingTime, { min: 0, max: 60 });
  assert.equal('evil' in (result.data.preferences ?? {}), false);
});

// ---------- merge ----------

test('merge: nothing the user already has is lost', () => {
  const current: BackupData = {
    ingredients: [{ id: 'c1', name: 'Tomato', quantity: '250', unit: 'gm', expiresOn: '2026-10-25' }, { id: 'c2', name: 'Onion' }],
    shoppingList: [{ id: 'cs1', name: 'Paneer', quantity: '100', unit: 'gm', checked: false, addedAt: 1, recipes: [] }],
    favoriteRecipes: [recipe('r1', { title: 'Mine' })], recentRecipes: [recipe('r9')],
    preferences: { dietaryRestrictions: [], allergies: ['nuts'], cuisinePreferences: [], skillLevel: 'advanced' },
  };
  const incoming = sample();
  const merged = mergeBackup(current, incoming);

  const tomato = merged.ingredients.find((i) => /tomato/i.test(i.name))!;
  assert.deepEqual([tomato.quantity, tomato.unit], ['500', 'gm'], 'amounts add up');
  assert.equal(tomato.expiresOn, '2026-10-20', 'the earlier expiry date wins');
  assert.deepEqual(merged.ingredients.map((i) => i.name).sort(), ['Onion', 'Rice', 'Tomato']);
  assert.equal(merged.ingredients.length, 3, 'no duplicate chips');

  assert.deepEqual(merged.shoppingList.map((i) => `${i.name} ${i.quantity}${i.unit}`), ['Paneer 300gm'], 'to-buy items combine; bought history is not imported');
  assert.deepEqual(merged.favoriteRecipes.map((r) => r.title), ['Mine', 'Recipe r2'], 'the current copy wins on the same id');
  assert.deepEqual(merged.recentRecipes.map((r) => r.id), ['r9', 'r3']);
  assert.equal(merged.preferences?.skillLevel, 'advanced', 'current preferences are kept');
});

test('merge into an empty app is the same as importing', () => {
  const empty: BackupData = { ingredients: [], shoppingList: [], favoriteRecipes: [], recentRecipes: [] };
  const merged = mergeBackup(empty, sample());
  assert.equal(merged.ingredients.length, 2);
  assert.equal(merged.favoriteRecipes.length, 2);
  assert.equal(merged.preferences?.skillLevel, 'beginner');
  assert.equal(merged.shoppingList.length, 1);
});

test('merge does not mutate either side', () => {
  const current: BackupData = { ingredients: [{ id: 'c1', name: 'Tomato', quantity: '1', unit: 'kg' } as Ingredient], shoppingList: [], favoriteRecipes: [recipe('r1')], recentRecipes: [] };
  const incoming = sample();
  const before = JSON.stringify([current, incoming]);
  mergeBackup(current, incoming);
  assert.equal(JSON.stringify([current, incoming]), before);
});

test('merge: a fresh app (default preferences) adopts the backup\'s preferences', () => {
  const fresh: BackupData = { ingredients: [], shoppingList: [], favoriteRecipes: [], recentRecipes: [], preferences: { dietaryRestrictions: [], allergies: [], cuisinePreferences: [], skillLevel: 'intermediate' } };
  const incoming = sample();
  assert.equal(mergeBackup(fresh, incoming, { keepCurrentPreferences: false }).preferences?.skillLevel, 'beginner');
  assert.equal(mergeBackup(fresh, incoming).preferences?.skillLevel, 'intermediate', 'default is to keep the current ones');
  const noPrefsInBackup = { ...incoming, preferences: undefined };
  assert.equal(mergeBackup(fresh, noPrefsInBackup, { keepCurrentPreferences: false }).preferences?.skillLevel, 'intermediate', 'nothing to adopt, so keep current');
});
