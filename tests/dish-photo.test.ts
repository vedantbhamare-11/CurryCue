import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasRealPhoto, significantWords, buildPhotoQuery, pickPhoto } from '@/lib/dish-photo';

const photo = (alt: unknown, large = 'https://images.pexels.com/photos/1/a.jpeg') =>
  ({ alt, photographer: 'Asha', photographer_url: 'https://www.pexels.com/@asha', src: { large } });

test('hasRealPhoto treats empty and legacy Unsplash stock photos as no photo', () => {
  assert.equal(hasRealPhoto(''), false);
  assert.equal(hasRealPhoto(undefined), false);
  assert.equal(hasRealPhoto('https://images.unsplash.com/photo-1'), false);
  assert.equal(hasRealPhoto('https://images.pexels.com/photos/1/a.jpeg'), true);
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

test('pickPhoto returns the first photo whose description names the dish', () => {
  const result = pickPhoto({ photos: [photo('A bowl of pasta on a table'), photo('Palak paneer in a bowl')] }, 'Palak Paneer');
  assert.deepEqual(result, { url: 'https://images.pexels.com/photos/1/a.jpeg', credit: { name: 'Asha', url: 'https://www.pexels.com/@asha' } });
});

test('pickPhoto prefers no photo over a weak match', () => {
  assert.ok(pickPhoto({ photos: [photo('Chicken tikka masala with naan')] }, 'Chicken Tikka Masala Curry'));
  assert.equal(pickPhoto({ photos: [photo('A bowl of curry'), photo('Paneer cubes')] }, 'Palak Paneer'), null);
});

test('pickPhoto refuses photos from other hosts, missing descriptions and a title with no distinctive word', () => {
  assert.equal(pickPhoto({ photos: [photo('Palak paneer', 'https://evil.example/a.jpg')] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ photos: [photo('Palak paneer', 'http://images.pexels.com/a.jpg')] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ photos: [photo(undefined)] }, 'Palak Paneer'), null);
  assert.equal(pickPhoto({ photos: [photo('Indian curry')] }, 'Indian Curry'), null);
  for (const bad of [null, undefined, {}, { photos: 'x' }, []]) assert.equal(pickPhoto(bad, 'Palak Paneer'), null);
});

test('pickPhoto falls back to safe credit values when the photographer details are odd', () => {
  const odd = { alt: 'Palak paneer', photographer: '', photographer_url: 'javascript:alert(1)', src: { large: 'https://images.pexels.com/photos/2/b.jpeg' } };
  assert.deepEqual(pickPhoto({ photos: [odd] }, 'Palak Paneer')?.credit, { name: 'Pexels', url: 'https://www.pexels.com' });
});
