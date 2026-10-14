import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseAmount, parseQuantityText, mergeAmounts, categorize, groupByCategory, addItems, formatForSharing, planPantryMove,
  type ShoppingItem,
} from '@/lib/shopping-list';

test('parseAmount reads numbers, decimals and fractions, and refuses prose', () => {
  const cases: [string, number | null][] = [['250', 250], ['1.5', 1.5], ['1/2', 0.5], ['1 1/2', 1.5], ['½', 0.5], ['1½', 1.5], ['3/4', 0.75], ['', null], ['to taste', null], ['a pinch', null], ['1/0', null], [' 2 ', 2]];
  for (const [input, expected] of cases) assert.equal(parseAmount(input), expected, input);
});

test('parseQuantityText splits a typed amount into quantity and unit', () => {
  assert.deepEqual(parseQuantityText('250 gm'), { quantity: '250', unit: 'gm' });
  assert.deepEqual(parseQuantityText('2kg'), { quantity: '2', unit: 'kg' });
  assert.deepEqual(parseQuantityText('1/2 cup'), { quantity: '1/2', unit: 'cup' });
  assert.deepEqual(parseQuantityText('1 1/2 tsp'), { quantity: '1 1/2', unit: 'tsp' });
  assert.deepEqual(parseQuantityText('2 tbsp.'), { quantity: '2', unit: 'tbsp' });
  assert.deepEqual(parseQuantityText('3'), { quantity: '3' });
  assert.deepEqual(parseQuantityText('to taste'), { quantity: 'to taste' });
  assert.deepEqual(parseQuantityText('  '), {});
});

test('mergeAmounts adds across units, pieces and fractions', () => {
  assert.deepEqual(mergeAmounts({ quantity: '250', unit: 'gm' }, { quantity: '100', unit: 'g' }), { quantity: '350', unit: 'gm' });
  assert.deepEqual(mergeAmounts({ quantity: '500', unit: 'gm' }, { quantity: '1', unit: 'kg' }), { quantity: '1.5', unit: 'kg' });
  assert.deepEqual(mergeAmounts({ quantity: '600', unit: 'g' }, { quantity: '600', unit: 'g' }), { quantity: '1.2', unit: 'kg' });
  assert.deepEqual(mergeAmounts({ quantity: '1', unit: 'l' }, { quantity: '500', unit: 'ml' }), { quantity: '1.5', unit: 'l' });
  assert.deepEqual(mergeAmounts({ quantity: '2', unit: 'nos' }, { quantity: '3', unit: 'pcs' }), { quantity: '5', unit: 'nos' });
  assert.deepEqual(mergeAmounts({ quantity: '1/2', unit: 'cup' }, { quantity: '1/2', unit: 'cup' }), { quantity: '1', unit: 'cup' });
  assert.deepEqual(mergeAmounts({ quantity: '0.1', unit: 'kg' }, { quantity: '0.2', unit: 'kg' }), { quantity: '300', unit: 'gm' });
});

test('mergeAmounts keeps the existing amount when the units cannot be added', () => {
  assert.deepEqual(mergeAmounts({ quantity: '1', unit: 'cup' }, { quantity: '200', unit: 'g' }), { quantity: '1', unit: 'cup' });
  assert.deepEqual(mergeAmounts({ quantity: '250', unit: 'gm' }, {}), { quantity: '250', unit: 'gm' });
  assert.deepEqual(mergeAmounts({}, { quantity: '1', unit: 'tsp' }), { quantity: '1', unit: 'tsp' });
  assert.deepEqual(mergeAmounts({ quantity: 'to taste' }, { quantity: '1', unit: 'tsp' }), { quantity: 'to taste', unit: undefined });
});

test('categorize puts common (Indian) ingredients in the right aisle', () => {
  const cases: [string, string][] = [
    ['Tomato', 'Fruits & vegetables'], ['Green chilli', 'Fruits & vegetables'], ['Curry leaves', 'Fruits & vegetables'], ['Coriander', 'Fruits & vegetables'], ['Bell pepper', 'Fruits & vegetables'],
    ['Coriander powder', 'Spices & masalas'], ['Cumin seeds', 'Spices & masalas'], ['Garam masala', 'Spices & masalas'], ['Salt', 'Spices & masalas'], ['Black pepper', 'Spices & masalas'],
    ['Milk', 'Dairy & eggs'], ['Paneer', 'Dairy & eggs'], ['Ghee', 'Dairy & eggs'], ['Eggs', 'Dairy & eggs'], ['Butter', 'Dairy & eggs'],
    ['Chicken breast', 'Meat & fish'], ['Prawns', 'Meat & fish'], ['Mutton keema', 'Meat & fish'],
    ['Basmati rice', 'Grains, pulses & flour'], ['Moong dal', 'Grains, pulses & flour'], ['Whole wheat atta', 'Grains, pulses & flour'], ['Poha', 'Grains, pulses & flour'],
    ['Vegetable oil', 'Oils, sauces & pantry'], ['Soy sauce', 'Oils, sauces & pantry'], ['Peanut butter', 'Oils, sauces & pantry'], ['Coconut milk', 'Oils, sauces & pantry'],
    ['Dish soap', 'Other'], ['', 'Other'],
  ];
  for (const [name, expected] of cases) assert.equal(categorize(name), expected, name);
});

test('groupByCategory keeps a fixed aisle order', () => {
  const groups = groupByCategory([{ name: 'Rice' }, { name: 'Milk' }, { name: 'Tomato' }, { name: 'Dish soap' }, { name: 'Chicken' }]);
  assert.deepEqual(groups.map((g) => g.category), ['Fruits & vegetables', 'Dairy & eggs', 'Meat & fish', 'Grains, pulses & flour', 'Other']);
});

test('addItems: add, merge duplicates and amounts, record recipes', () => {
  let n = 0;
  const makeId = () => `id${n++}`;
  let result = addItems([], [{ name: 'tomato', quantity: '250', unit: 'gm' }, { name: 'Onion', quantity: '2', unit: 'nos' }, { name: '  ' }, { name: 'Salt' }], { recipeTitle: 'Tomato Rice', now: 1, makeId });
  assert.deepEqual(result.items.map((i) => i.name), ['Tomato', 'Onion', 'Salt']);
  assert.deepEqual(result.items[0].recipes, ['Tomato Rice']);

  result = addItems(result.items, [{ name: 'Tomatoes', quantity: '100', unit: 'g' }], { recipeTitle: 'Chutney', now: 2, makeId });
  assert.equal(result.items.filter((i) => /tomato/i.test(i.name)).length, 1);
  assert.deepEqual([result.items[0].quantity, result.items[0].unit], ['350', 'gm']);
  assert.deepEqual(result.items[0].recipes, ['Tomato Rice', 'Chutney']);
  assert.deepEqual(result.merged, ['Tomato']);

  // A different recipe still adds its amount (and converts units)
  result = addItems(result.items, [{ name: 'Tomato', quantity: '1', unit: 'kg' }], { recipeTitle: 'Salad', now: 3, makeId });
  assert.deepEqual(result.items[0].recipes, ['Tomato Rice', 'Chutney', 'Salad']);
  assert.deepEqual([result.items[0].quantity, result.items[0].unit], ['1.35', 'kg']);
});

test('addItems: adding the same recipe twice (a double tap) does not double the amounts', () => {
  const first = addItems([], [{ name: 'Garlic', quantity: '2' }, { name: 'Cream', quantity: '2', unit: 'tbsp' }], { recipeTitle: 'Palak Paneer', now: 1 });
  assert.equal(first.alreadyListed.length, 0);

  const second = addItems(first.items, [{ name: 'Garlic', quantity: '2' }, { name: 'Cream', quantity: '2', unit: 'tbsp' }], { recipeTitle: 'Palak Paneer', now: 2 });
  assert.deepEqual(second.items.map((i) => [i.name, i.quantity, i.unit]), [['Garlic', '2', undefined], ['Cream', '2', 'tbsp']]);
  assert.deepEqual(second.alreadyListed, ['Garlic', 'Cream']);
  assert.deepEqual(second.merged, []);
  assert.deepEqual(second.added, []);
});

test('addItems: a bought item is a past purchase, so buying it again adds a fresh entry', () => {
  const bought: ShoppingItem[] = [{ id: 'a', name: 'Onion', checked: true, addedAt: 0, recipes: [] }];
  const result = addItems(bought, [{ name: 'Onion', quantity: '1', unit: 'nos' }]);
  assert.equal(result.items.filter((i) => /onion/i.test(i.name)).length, 2);
});

test('addItems: items already in the pantry are skipped, but rice flour is not "rice"', () => {
  const result = addItems([], [{ name: 'Tomato' }, { name: 'Paneer' }, { name: 'Ghee' }, { name: 'Rice flour' }], { pantry: [{ name: 'tomatoes' }, { name: 'Ghee' }, { name: 'Rice' }] });
  assert.deepEqual(result.added, ['Paneer', 'Rice flour']);
  assert.deepEqual(result.skippedInPantry, ['Tomato', 'Ghee']);
});

test('addItems does not mutate its input (items live in a store)', () => {
  const current: ShoppingItem[] = [{ id: 'a', name: 'Tomato', quantity: '1', unit: 'kg', checked: false, addedAt: 0, recipes: [] }];
  addItems(current, [{ name: 'Tomato', quantity: '1', unit: 'kg' }], { recipeTitle: 'X' });
  assert.equal(current[0].quantity, '1');
  assert.equal(current[0].recipes.length, 0);
});

test('formatForSharing groups by aisle and leaves out what is already bought', () => {
  const list: ShoppingItem[] = [
    { id: '1', name: 'Tomato', quantity: '350', unit: 'gm', checked: false, addedAt: 0, recipes: [] },
    { id: '2', name: 'Milk', quantity: '1', unit: 'l', checked: false, addedAt: 0, recipes: [] },
    { id: '3', name: 'Salt', checked: false, addedAt: 0, recipes: [] },
    { id: '4', name: 'Rice', quantity: '1', unit: 'kg', checked: true, addedAt: 0, recipes: [] },
  ];
  assert.equal(formatForSharing(list), '🛒 *Shopping list*\n\n*Fruits & vegetables*\n• Tomato — 350 gm\n\n*Dairy & eggs*\n• Milk — 1 l\n\n*Spices & masalas*\n• Salt');
  assert.equal(formatForSharing(list.map((i) => ({ ...i, checked: true }))), '');
});

test('planPantryMove tops up an existing pantry item and adds new ones', () => {
  const plan = planPantryMove(
    [{ id: 's1', name: 'Tomato', quantity: '500', unit: 'gm', checked: true, addedAt: 0, recipes: [] }, { id: 's2', name: 'Spinach', quantity: '1', unit: 'bunch', checked: true, addedAt: 0, recipes: [] }],
    [{ id: 'p1', name: 'Tomatoes', quantity: '250', unit: 'gm' }]
  );
  assert.deepEqual(plan.toUpdate, [{ id: 'p1', name: 'Tomatoes', quantity: '750', unit: 'gm' }]);
  assert.deepEqual(plan.toAdd, [{ name: 'Spinach', quantity: '1', unit: 'bunch' }]);
});
