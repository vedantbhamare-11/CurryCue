import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasRealPhoto, significantWords, buildPhotoQuery, pickPhoto } from '@/lib/dish-photo';

const IMG = 'https://images.unsplash.com/photo-999?w=1080';
const DL = 'https://api.unsplash.com/photos/abc/download';
const photo = (over: Record<string, unknown> = {}) => ({
  alt_description: null, description: null, tags: [], urls: { regular: IMG }, links: { download_location: DL },
  user: { name: 'Asha', links: { html: 'https://unsplash.com/@asha' } }, ...over,
});

test('hasRealPhoto rejects only empty values and the six old fake stock photos', () => {
  assert.equal(hasRealPhoto(''), false);
  assert.equal(hasRealPhoto(undefined), false);
  assert.equal(hasRealPhoto('https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1080'), false);
  assert.equal(hasRealPhoto('https://images.unsplash.com/photo-1546069901-ba9599a7e63c'), false);
  assert.equal(hasRealPhoto(IMG), true); // a photo found by search is also on Unsplash
});

test('significantWords keeps what names the dish and drops generic words', () => {
  assert.deepEqual(significantWords('Spicy Palak Paneer Masala'), ['palak', 'paneer']);
  assert.deepEqual(significantWords('Crème Brûlée'), ['creme', 'brulee']);
  assert.deepEqual(significantWords('Indian Curry'), []);
});

test('buildPhotoQuery adds the cuisine but not the "General" placeholder', () => {
  assert.equal(buildPhotoQuery('Palak Paneer', 'Indian'), 'Palak Paneer Indian food');
  assert.equal(buildPhotoQuery('Palak Paneer', 'General'), 'Palak Paneer food');
  assert.equal(buildPhotoQuery('Palak Paneer'), 'Palak Paneer food');
});

test('pickPhoto returns the first photo described as the dish, with a credit and the download link', () => {
  const result = pickPhoto({ results: [photo({ alt_description: 'a bowl of pasta' }), photo({ alt_description: 'palak paneer in a bowl' })] }, 'Palak Paneer');
  assert.deepEqual(result, { url: IMG, downloadLocation: DL, credit: { name: 'Asha', url: 'https://unsplash.com/@asha?utm_source=currycue&utm_medium=referral' } });
});

test('pickPhoto also reads the description and tags', () => {
  assert.ok(pickPhoto({ results: [photo({ description: 'Homemade palak paneer' })] }, 'Palak Paneer'));
  assert.ok(pickPhoto({ results: [photo({ tags: [{ title: 'palak' }, { title: 'paneer' }] })] }, 'Palak Paneer'));
});

test('pickPhoto prefers no photo over a weak match', () => {
  assert.equal(pickPhoto({ results: [photo({ alt_description: 'a bowl of curry' }), photo({ alt_description: 'paneer cubes' })] }, 'Palak Paneer'), null);
  assert.ok(pickPhoto({ results: [photo({ alt_description: 'chicken tikka masala with naan' })] }, 'Chicken Tikka Masala Curry'));
});

test('pickPhoto refuses other hosts, missing descriptions and a title with no distinctive word', () => {
  const match = { alt_description: 'palak paneer' };
  assert.equal(pickPhoto({ results: [photo({ ...match, urls: { regular: 'https://evil.example/a.jpg' } })] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ results: [photo({ ...match, urls: { regular: 'http://images.unsplash.com/a.jpg' } })] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ results: [photo({ ...match, links: { download_location: 'https://evil.example/d' } })] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ results: [photo()] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ results: [photo({ alt_description: 'indian curry' })] }, 'Indian Curry'), null);
  for (const bad of [null, undefined, {}, { results: 'x' }, []]) assert.equal(pickPhoto(bad, 'Palak Paneer'), null);
});

test('pickPhoto falls back to safe credit values when the photographer details are odd', () => {
  const odd = photo({ alt_description: 'palak paneer', user: { name: '', links: { html: 'javascript:alert(1)' } } });
  assert.deepEqual(pickPhoto({ results: [odd] }, 'Palak Paneer')?.credit, { name: 'Unsplash', url: 'https://unsplash.com?utm_source=currycue&utm_medium=referral' });
});
