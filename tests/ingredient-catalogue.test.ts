import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchCatalogue, catalogueNames } from '@/lib/ingredient-catalogue';

const names = (query: string) => [...new Set(searchCatalogue(query).map((s) => s.name))];

test('the catalogue has no duplicate names, brands or bracketed notes', () => {
  const all = catalogueNames();
  assert.equal(new Set(all.map((name) => name.toLowerCase())).size, all.length);
  for (const name of all) assert.doesNotMatch(name, /[()/]/, name);
});

test('every suggestion has a quantity, a unit and matching display text', () => {
  for (const name of catalogueNames()) {
    for (const suggestion of searchCatalogue(name, 100).filter((s) => s.name === name)) {
      assert.ok(suggestion.quantity && suggestion.unit, suggestion.displayText);
      assert.equal(suggestion.displayText, `${name} (${suggestion.quantity} ${suggestion.unit})`);
    }
  }
});

test('everyday ingredients can be found (onion was once missing)', () => {
  for (const word of ['onion', 'potato', 'garlic', 'egg', 'chicken', 'curd', 'turmeric', 'cumin', 'lemon', 'carrot', 'spinach', 'oil', 'atta', 'salt', 'sugar', 'ghee', 'milk', 'tea']) {
    assert.ok(searchCatalogue(word).length > 0, word);
  }
});

test('other names find the ingredient, and it is suggested under its own name', () => {
  assert.equal(names('pyaz')[0], 'Onion');
  assert.equal(names('palak')[0], 'Spinach');
  assert.equal(names('jeera')[0], 'Cumin Seeds');
  assert.equal(names('baingan')[0], 'Brinjal');
  assert.equal(names('curd').includes('Curd'), true);
  assert.equal(names('yogurt')[0], 'Curd');
});

test('better matches come first', () => {
  assert.equal(names('tom')[0], 'Tomato');
  assert.ok(names('tom').indexOf('Tomato') < names('tom').indexOf('Sun-dried Tomatoes'));
  assert.equal(names('ginger')[0], 'Ginger');
  assert.ok(names('ginger').indexOf('Ginger') < names('ginger').indexOf('Pickled Ginger'));
  assert.equal(names('rice')[0], 'Rice');
});

test('search ignores case and spaces around the query, and gives nothing for nonsense or nothing', () => {
  assert.deepEqual(searchCatalogue('  ONION '), searchCatalogue('onion'));
  assert.deepEqual(searchCatalogue('zzzzqq'), []);
  assert.deepEqual(searchCatalogue('   '), []);
});

test('search respects the limit', () => {
  assert.equal(searchCatalogue('a').length, 8);
  assert.equal(searchCatalogue('a', 3).length, 3);
});
