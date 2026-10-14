import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyIngredients } from '@/lib/services/recipe-generation';

const pantry = [
  { id: 'p1', name: 'Rice' }, { id: 'p2', name: 'Onion' }, { id: 'p3', name: 'Tomatoes' }, { id: 'p4', name: 'Bell pepper' }, { id: 'p5', name: 'Milk' },
];
const names = (items: { name: string }[]) => items.map((i) => i.name);

test('what the pantry has counts as used, with the pantry item\'s id and name', () => {
  const { used } = classifyIngredients([{ name: 'tomato', quantity: '2' }, { name: 'Green bell pepper' }], pantry);
  assert.deepEqual(names(used), ['Tomatoes', 'Bell pepper']);
  assert.deepEqual(used.map((i) => i.id), ['p3', 'p4']);
  assert.equal(used[0].quantity, '2', 'the recipe\'s quantity is kept');
});

test('staples are assumed, not missing', () => {
  const { assumed, missing } = classifyIngredients([{ name: 'Salt' }, { name: 'Oil' }, { name: 'Olive Oil' }, { name: 'Cumin seeds' }, { name: 'Turmeric' }, { name: 'Water' }], pantry);
  assert.deepEqual(names(assumed), ['Salt', 'Oil', 'Olive Oil', 'Cumin seeds', 'Turmeric', 'Water']);
  assert.deepEqual(missing, []);
});

test('anything else is missing', () => {
  const { missing } = classifyIngredients([{ name: 'Paneer', quantity: '200', unit: 'g' }, { name: 'Spinach' }], pantry);
  assert.deepEqual(names(missing), ['Paneer', 'Spinach']);
});

test('REGRESSION: derived products are not the plain ingredient in the pantry', () => {
  const { used, missing } = classifyIngredients([{ name: 'Rice flour' }, { name: 'Tomato puree' }, { name: 'Coconut milk' }, { name: 'Ginger garlic paste' }], pantry);
  assert.deepEqual(used, []);
  assert.deepEqual(names(missing), ['Rice flour', 'Tomato puree', 'Coconut milk', 'Ginger garlic paste']);
});

test('black pepper is a staple, a bell pepper is not', () => {
  const { assumed, used } = classifyIngredients([{ name: 'Black Pepper' }, { name: 'Bell pepper' }], pantry);
  assert.deepEqual(names(assumed), ['Black Pepper']);
  assert.deepEqual(names(used), ['Bell pepper']);
});

test('duplicates collapse, and junk entries are skipped', () => {
  const { used } = classifyIngredients([{ name: 'Onion' }, { name: 'onions' }, null, { name: 42 }, {}], pantry);
  assert.deepEqual(names(used), ['Onion']);
});

test('classifyIngredients cleans notes out of names and units', () => {
  const { missing } = classifyIngredients([{ name: 'Cream (optional)', quantity: '2', unit: 'tbsp' }, { name: 'Ginger', quantity: '1', unit: 'tsp grated' }, { name: 'Lemon', quantity: '1', unit: 'optional' }], []);
  assert.deepEqual(missing.map((i) => [i.name, i.quantity, i.unit]), [['Cream', '2', 'tbsp'], ['Ginger', '1', 'tsp'], ['Lemon', '1', undefined]]);
  assert.equal('unit' in missing[2], false);
});
