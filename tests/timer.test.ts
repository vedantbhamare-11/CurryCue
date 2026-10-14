import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remainingSeconds } from '@/lib/timer';

test('remainingSeconds counts down from the real clock, rounding up', () => {
  const end = 1_000_000 + 60_000;
  assert.equal(remainingSeconds(end, 1_000_000), 60);
  assert.equal(remainingSeconds(end, 1_000_000 + 1), 60);
  assert.equal(remainingSeconds(end, 1_000_000 + 59_000), 1);
  assert.equal(remainingSeconds(end, 1_000_000 + 59_001), 1, '0:01 shows until the very end');
  assert.equal(remainingSeconds(end, end), 0);
});

test('a suspended page catches up in one step: the clock moved on, so the answer does too', () => {
  const end = 5_000 + 5 * 60_000;
  // Phone locked for 4m10s, no ticks at all in between
  assert.equal(remainingSeconds(end, 5_000 + 250_000), 50);
  // Locked for longer than the timer: finished, and never negative
  assert.equal(remainingSeconds(end, 5_000 + 20 * 60_000), 0);
});

test('remainingSeconds is safe on odd input', () => {
  assert.equal(remainingSeconds(NaN, 1), 0);
  assert.equal(remainingSeconds(Infinity, 1), 0, 'a non-finite end time never produces a runaway timer');
  assert.equal(remainingSeconds(1, Infinity), 0);
});
