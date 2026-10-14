import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDifficulty, normalizeCookTime, normalizeTags, asText, asList } from '@/lib/recipe-fields';

test('normalizeDifficulty maps the words models use onto easy | medium | hard', () => {
  assert.equal(normalizeDifficulty('intermediate'), 'medium');
  assert.equal(normalizeDifficulty(' Beginner '), 'easy');
  assert.equal(normalizeDifficulty('ADVANCED'), 'hard');
  assert.equal(normalizeDifficulty('easy'), 'easy');
  for (const value of ['', 'spicy', 5, null, undefined, {}]) assert.equal(normalizeDifficulty(value), undefined);
});

test('normalizeCookTime reads numbers and "45 minutes", and falls back on nonsense', () => {
  assert.equal(normalizeCookTime(45), 45);
  assert.equal(normalizeCookTime('45'), 45);
  assert.equal(normalizeCookTime('45 minutes'), 45);
  assert.equal(normalizeCookTime(12.6), 13);
  for (const value of [0, -5, 99999, 'quick', null, undefined, NaN, {}]) assert.equal(normalizeCookTime(value), 30);
  assert.equal(normalizeCookTime(undefined, 20), 20);
});

test('normalizeTags only returns clean string arrays', () => {
  assert.deepEqual(normalizeTags(['quick', ' veg ', 'quick', '', 5, null]), ['quick', 'veg']);
  assert.deepEqual(normalizeTags('quick, veg', ['authentic']), ['authentic']);
  assert.deepEqual(normalizeTags([], ['authentic']), ['authentic']);
  assert.equal(normalizeTags(Array.from({ length: 20 }, (_, i) => `t${i}`)).length, 6);
});

test('asText and asList never throw on odd input', () => {
  assert.equal(asText('  hi '), 'hi');
  assert.equal(asText(5, 'x'), 'x');
  assert.equal(asText('   ', 'x'), 'x');
  assert.deepEqual(asList('abc'), []);
  assert.deepEqual(asList([1]), [1]);
});
