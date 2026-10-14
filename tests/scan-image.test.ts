import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateScanImage, sanitizeScanResults } from '@/lib/scan-image';

const b64 = (n: number) => 'A'.repeat(n);

test('validateScanImage accepts real image data URLs and bare base64 (as JPEG)', () => {
  const png = validateScanImage(`data:image/png;base64,${b64(200)}`);
  assert.deepEqual(png, { ok: true, dataUrl: `data:image/png;base64,${b64(200)}` });
  const bare = validateScanImage(b64(200));
  assert.deepEqual(bare, { ok: true, dataUrl: `data:image/jpeg;base64,${b64(200)}` });
  assert.equal(validateScanImage(`data:image/webp;base64,${b64(120)}==`).ok, true);
});

test('validateScanImage rejects everything that is not a base64 image', () => {
  const bad: unknown[] = [
    undefined, null, '', 42, {}, [], 'hello',
    'http://169.254.169.254/latest/meta-data', 'https://example.com/a.jpg', 'file:///etc/passwd',
    'data:text/html;base64,PGh0bWw+', `data:text/html;base64,${b64(200)}`,
    `data:image/svg+xml;base64,${b64(200)}`, `data:application/pdf;base64,${b64(200)}`,
    `data:image/png;base64,${b64(20)}`,                // too small to be a photo
    `data:image/png;base64,${b64(200)}!!<script>`,     // not base64
    `data:image/png,${b64(200)}`,                      // not base64-encoded
    `${b64(200)}\n`,
  ];
  for (const value of bad) {
    const result = validateScanImage(value);
    assert.equal(result.ok, false, `should reject ${JSON.stringify(value)?.slice(0, 50)}`);
  }
});

test('validateScanImage handles a multi-megabyte string quickly (no regex blow-up)', () => {
  const started = Date.now();
  const result = validateScanImage(`data:image/jpeg;base64,${b64(4_000_000)}`);
  assert.equal(result.ok, true);
  assert.ok(Date.now() - started < 500, 'validation should be linear time');
});

test('sanitizeScanResults keeps only well-formed entries, most confident first', () => {
  const results = sanitizeScanResults([
    { name: 'tomato', quantity: 2, unit: 'medium', confidence: 91 },
    { name: ' Onion ', confidence: 140 },
    { name: 'onion', confidence: 50 },          // duplicate
    { name: '', confidence: 99 },
    { name: 42 },
    null, 'garlic', [],
    { name: 'ginger', confidence: 'high' },
    { name: 'x'.repeat(500), confidence: 70 },
  ]);
  assert.deepEqual(results.map((r) => r.name), ['Onion', 'tomato', 'x'.repeat(80), 'ginger']);
  assert.deepEqual(results[1], { name: 'tomato', quantity: '2', unit: 'medium', confidence: 91 });
  assert.equal(results[0].confidence, 100, 'confidence is clamped');
  assert.equal('confidence' in results[3], false, 'a non-numeric confidence is dropped, not kept');
});

test('sanitizeScanResults returns [] for non-arrays', () => {
  for (const value of [null, undefined, {}, 'a', 5, { name: 'tomato' }]) assert.deepEqual(sanitizeScanResults(value), []);
});
