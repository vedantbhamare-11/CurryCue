import { test } from 'node:test';
import assert from 'node:assert/strict';
import { namesMatch, staplesMatch, nameWords, cleanIngredientName, cleanUnit } from '@/lib/ingredient-names';

// [a, b, same ingredient?]. The "false" rows are the ones the first, too-generous matcher got wrong:
// a derived product (flour, puree, milk, paste...) is not the plain ingredient.
const pairs: [string, string, boolean][] = [
  ['Rice', 'Rice flour', false], ['Tomato', 'Tomato puree', false], ['Coconut', 'Coconut milk', false], ['Milk', 'Coconut milk', false],
  ['Butter', 'Peanut butter', false], ['Chilli', 'Chilli powder', false], ['Coriander', 'Coriander powder', false], ['Cumin', 'Cumin powder', false],
  ['Ginger', 'Ginger garlic paste', false], ['Garlic', 'Garlic powder', false], ['Oil', 'Mustard oil', false], ['Cream', 'Ice cream', false],
  ['Tomato', 'Tomatoes', true], ['Bell pepper', 'Green bell pepper', true], ['Milk', 'Toned milk', true], ['Chicken', 'Chicken breast', true],
  ['Curry leaf', 'Curry leaves', true], ['Cumin', 'Cumin seeds', true], ['Butter', 'Unsalted butter', true], ['Red chilli powder', 'Chilli powder', true],
  ['Rice', 'Basmati rice', true], ['Onion', 'onions', true], ['Potato', 'Potatoes', true], ['Bell pepper', 'Black pepper', false],
];

for (const [a, b, expected] of pairs) {
  test(`namesMatch("${a}", "${b}") is ${expected}`, () => {
    assert.equal(namesMatch(a, b), expected);
    assert.equal(namesMatch(b, a), expected, 'must be symmetric');
  });
}

test('empty names never match', () => {
  assert.equal(namesMatch('', 'Rice'), false);
  assert.equal(namesMatch('Rice', ''), false);
  assert.equal(namesMatch('', ''), false);
});

test('staplesMatch is lenient on purpose: oil covers mustard oil, cumin covers cumin powder', () => {
  assert.equal(staplesMatch('Oil', 'Mustard oil'), true);
  assert.equal(staplesMatch('Cumin', 'Cumin powder'), true);
  assert.equal(staplesMatch('Black Pepper', 'Bell Pepper'), false);
  assert.equal(staplesMatch('Salt', ''), false);
});

test('"leaves" singularises to "leaf"', () => {
  assert.deepEqual(nameWords('Curry leaves'), ['curry', 'leaf']);
  assert.deepEqual(nameWords('Tomatoes (ripe)'), ['tomato']);
});

test('cleanIngredientName drops notes a model wrote into the name', () => {
  assert.equal(cleanIngredientName('Cream (optional)'), 'Cream');
  assert.equal(cleanIngredientName('Onion, finely chopped'), 'Onion');
  assert.equal(cleanIngredientName('Oil (vegetable/sunflower/ghee)'), 'Oil');
  assert.equal(cleanIngredientName('  Green   chilli  '), 'Green chilli');
  assert.equal(cleanIngredientName('(optional)'), '(optional)'); // never end up with an empty name
});

test('cleanUnit drops preparation words but keeps real units', () => {
  assert.equal(cleanUnit('tsp grated'), 'tsp');
  assert.equal(cleanUnit('cup finely chopped'), 'cup');
  assert.equal(cleanUnit('tbsp (optional)'), 'tbsp');
  assert.equal(cleanUnit('fl oz'), 'fl oz');
  assert.equal(cleanUnit('gm'), 'gm');
  assert.equal(cleanUnit('grated'), undefined);
  assert.equal(cleanUnit(''), undefined);
  assert.equal(cleanUnit(undefined), undefined);
});
