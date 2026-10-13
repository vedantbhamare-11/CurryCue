import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  toDateKey, parseDateKey, addDaysKey, daysUntil, getExpiryStatus, describeExpiry, describeExpiryShort, getUseSoon, suggestShelfLifeDays,
} from '@/lib/expiry';

// Dates are local calendar days, so run the same checks in several time zones, including ones with a daylight-saving
// change inside the range. (Setting process.env.TZ at runtime is picked up by Node's Date.)
const ZONES = ['Asia/Kolkata', 'America/New_York', 'Pacific/Auckland', 'UTC'];

for (const zone of ZONES) {
  test(`whole-day maths is right at every time of day in ${zone}`, () => {
    process.env.TZ = zone;
    const day = (h: number, m = 0) => new Date(2026, 9, 18, h, m, 0);
    for (const now of [day(0, 0), day(0, 1), day(12), day(23, 59)]) {
      assert.equal(daysUntil('2026-10-18', now), 0);
      assert.equal(daysUntil('2026-10-19', now), 1);
      assert.equal(daysUntil('2026-10-17', now), -1);
      assert.equal(daysUntil('2026-10-21', now), 3);
      assert.equal(daysUntil('2026-11-18', now), 31);
      assert.equal(daysUntil('2027-01-01', now), 75);
    }
    // clocks change on these days (a 25-hour and a 23-hour day in New York); the answer must still be whole days
    assert.equal(daysUntil('2026-11-09', new Date(2026, 10, 7, 12)), 2);
    assert.equal(daysUntil('2026-03-10', new Date(2026, 2, 7, 12)), 3);
    assert.equal(daysUntil('2026-11-01', new Date(2026, 10, 1, 1, 30)), 0);
  });
}

test('date keys: formatting, rolling over months/years, and rejecting impossible dates', () => {
  process.env.TZ = 'Asia/Kolkata';
  assert.equal(toDateKey(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(addDaysKey(1, new Date(2026, 9, 18, 23, 59)), '2026-10-19');
  assert.equal(addDaysKey(7, new Date(2026, 9, 28, 10)), '2026-11-04');
  assert.equal(addDaysKey(3, new Date(2026, 11, 30, 10)), '2027-01-02');
  assert.equal(addDaysKey(0, new Date(2026, 9, 18, 15)), '2026-10-18');
  assert.equal(toDateKey(parseDateKey('2026-02-28')!), '2026-02-28');
  assert.notEqual(parseDateKey('2028-02-29'), null, 'leap day');
  for (const bad of ['2026-02-29', '2026-02-31', '2026-13-45', 'tomorrow', '', '2026-1-5', undefined, null]) assert.equal(parseDateKey(bad as string), null, String(bad));
  assert.equal(daysUntil('nope', new Date(2026, 9, 18)), null);
  assert.equal(daysUntil(undefined, new Date(2026, 9, 18)), null);
});

test('status and wording', () => {
  const statuses: [number, string][] = [[-3, 'expired'], [-1, 'expired'], [0, 'today'], [1, 'urgent'], [2, 'urgent'], [3, 'soon'], [5, 'soon'], [6, 'ok'], [30, 'ok']];
  for (const [days, status] of statuses) assert.equal(getExpiryStatus(days), status, String(days));
  assert.equal(describeExpiry(-3), 'Expired 3 days ago');
  assert.equal(describeExpiry(-1), 'Expired yesterday');
  assert.equal(describeExpiry(0), 'Expires today');
  assert.equal(describeExpiry(1), 'Expires tomorrow');
  assert.equal(describeExpiry(4), 'Expires in 4 days');
  assert.equal(describeExpiryShort(-2), 'Expired');
  assert.equal(describeExpiryShort(0), 'Today');
  assert.equal(describeExpiryShort(1), 'Tomorrow');
  assert.equal(describeExpiryShort(9), '9 days');
});

test('getUseSoon: expired and soon items, most urgent first, ignoring bad dates', () => {
  process.env.TZ = 'Asia/Kolkata';
  const now = new Date(2026, 9, 18, 9);
  const pantry = [
    { id: 'a', name: 'Rice' },
    { id: 'b', name: 'Spinach', expiresOn: '2026-10-18' },
    { id: 'c', name: 'Milk', expiresOn: '2026-10-16' },
    { id: 'd', name: 'Tomato', expiresOn: '2026-10-20' },
    { id: 'e', name: 'Onion', expiresOn: '2026-11-10' },
    { id: 'f', name: 'Paneer', expiresOn: '2026-10-21' },
    { id: 'g', name: 'Bad', expiresOn: 'garbage' },
  ];
  assert.deepEqual(getUseSoon(pantry, now).map((x) => `${x.ingredient.name}:${x.days}`), ['Milk:-2', 'Spinach:0', 'Tomato:2', 'Paneer:3']);
  assert.deepEqual(getUseSoon(pantry, now, 0).map((x) => x.ingredient.name), ['Milk', 'Spinach']);
  const noExpiryDates: { id: string; name: string; expiresOn?: string }[] = [{ id: 'x', name: 'Rice' }];
  assert.deepEqual(getUseSoon(noExpiryDates, now), []);
  assert.deepEqual(getUseSoon([], now), []);
});

test('typical shelf life', () => {
  const cases: [string, number | null][] = [['Spinach', 3], ['Palak', 3], ['Coriander leaves', 3], ['Curry leaves', 3], ['Chicken breast', 2], ['Milk', 3], ['Tomato', 5], ['Tomatoes', 5], ['Paneer', 5], ['Curd', 7], ['Eggs', 21], ['Onion', 21], ['Potato', 21], ['Ghee', 30], ['Bell pepper', 5], ['Rice', null], ['Cumin seeds', null], ['Salt', null], ['', null]];
  for (const [name, days] of cases) assert.equal(suggestShelfLifeDays(name), days, name);
});
