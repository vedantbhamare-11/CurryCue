import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addToPantry, addManyToPantry } from '@/lib/pantry';
import type { Ingredient } from '@/types';

const I = (id: string, name: string, extra: Partial<Ingredient> = {}): Ingredient => ({ id, name, ...extra });

test('a new ingredient is appended', () => {
  const result = addToPantry([I('1', 'Rice')], I('2', 'Onion'));
  assert.equal(result.merged, false);
  assert.deepEqual(result.items.map((i) => i.name), ['Rice', 'Onion']);
});

test('the same ingredient merges and the amounts add up', () => {
  const result = addToPantry([I('1', 'Tomato', { quantity: '250', unit: 'gm' })], I('2', 'Tomatoes', { quantity: '500', unit: 'g' }));
  assert.equal(result.merged, true);
  assert.equal(result.mergedInto, 'Tomato');
  assert.equal(result.items.length, 1);
  assert.deepEqual([result.items[0].quantity, result.items[0].unit], ['750', 'gm']);
  assert.equal(result.items[0].id, '1', 'the existing item keeps its id');
});

test('units convert: 500 gm + 1 kg = 1.5 kg', () => {
  const result = addToPantry([I('1', 'Rice', { quantity: '500', unit: 'gm' })], I('2', 'Rice', { quantity: '1', unit: 'kg' }));
  assert.deepEqual([result.items[0].quantity, result.items[0].unit], ['1.5', 'kg']);
});

test('amounts that cannot be added keep the existing one', () => {
  const result = addToPantry([I('1', 'Rice', { quantity: '1', unit: 'cup' })], I('2', 'Rice', { quantity: '200', unit: 'gm' }));
  assert.equal(result.merged, true);
  assert.deepEqual([result.items[0].quantity, result.items[0].unit], ['1', 'cup']);
});

test('the same ingredient twice with no amount is just de-duplicated', () => {
  const result = addToPantry([I('1', 'Salt')], I('2', 'Salt'));
  assert.equal(result.items.length, 1);
  assert.equal(result.merged, true);
});

test('a derived product is NOT merged into the plain ingredient', () => {
  const result = addToPantry([I('1', 'Rice', { quantity: '1', unit: 'kg' })], I('2', 'Rice flour', { quantity: '500', unit: 'gm' }));
  assert.equal(result.merged, false);
  assert.equal(result.items.length, 2);
});

test('the earlier expiry date wins when merging two batches', () => {
  const earlier = addToPantry([I('1', 'Milk', { expiresOn: '2026-10-20' })], I('2', 'Milk', { expiresOn: '2026-10-18' }));
  assert.equal(earlier.items[0].expiresOn, '2026-10-18');
  const keeps = addToPantry([I('1', 'Milk', { expiresOn: '2026-10-18' })], I('2', 'Milk', { expiresOn: '2026-10-25' }));
  assert.equal(keeps.items[0].expiresOn, '2026-10-18');
});

test('an expiry date from either side survives; an invalid one is ignored', () => {
  assert.equal(addToPantry([I('1', 'Milk')], I('2', 'Milk', { expiresOn: '2026-10-18' })).items[0].expiresOn, '2026-10-18');
  assert.equal(addToPantry([I('1', 'Milk', { expiresOn: '2026-10-18' })], I('2', 'Milk')).items[0].expiresOn, '2026-10-18');
  assert.equal(addToPantry([I('1', 'Milk', { expiresOn: 'garbage' })], I('2', 'Milk', { expiresOn: '2026-10-18' })).items[0].expiresOn, '2026-10-18');
  assert.equal('expiresOn' in addToPantry([I('1', 'Milk')], I('2', 'Milk')).items[0], false);
});

test('does not mutate its input', () => {
  const pantry = [I('1', 'Tomato', { quantity: '1', unit: 'kg' })];
  const snapshot = JSON.stringify(pantry);
  addToPantry(pantry, I('2', 'Tomato', { quantity: '1', unit: 'kg' }));
  assert.equal(JSON.stringify(pantry), snapshot);
});

test('addManyToPantry merges within the batch too, and counts merges', () => {
  const result = addManyToPantry([I('1', 'Rice')], [I('2', 'Onion', { quantity: '2', unit: 'nos' }), I('3', 'Onions', { quantity: '3', unit: 'nos' }), I('4', 'Rice')]);
  assert.deepEqual(result.items.map((i) => i.name), ['Rice', 'Onion']);
  assert.equal(result.items[1].quantity, '5');
  assert.equal(result.mergedCount, 2);
});

test('another name for what you already have merges into it: Pyaz adds to Onion', () => {
  const result = addToPantry([I('1', 'Onion', { quantity: '2', unit: 'nos' })], I('2', 'Pyaz', { quantity: '3', unit: 'nos' }));
  assert.equal(result.merged, true);
  assert.deepEqual(result.items.map((i) => [i.name, i.quantity]), [['Onion', '5']]);
});
