// Expiry-date logic for the pantry ("use it up"). Pure functions (no React, no storage) so they are
// tested in Node. Dates are plain local calendar dates stored as "YYYY-MM-DD": no time zone, no clock
// time, so "expires today" means the user's today and never shifts a day across time zones.
import { nameWords } from '@/lib/ingredient-names';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// "2026-10-18" -> local midnight of that day; null if it is not a real calendar date ("2026-02-31")
export function parseDateKey(key: string | undefined | null): Date | null {
  const match = typeof key === 'string' ? key.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function addDaysKey(days: number, now: Date = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return toDateKey(date);
}

// Whole calendar days from today until the date: 0 = today, 1 = tomorrow, -1 = yesterday.
// Both sides are local midnights, rounded, so daylight-saving changes cannot make it 23h/25h off by one.
export function daysUntil(expiresOn: string | undefined | null, now: Date = new Date()): number | null {
  const expiry = parseDateKey(expiresOn);
  if (!expiry) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((expiry.getTime() - today.getTime()) / MS_PER_DAY);
}

export type ExpiryStatus = 'expired' | 'today' | 'urgent' | 'soon' | 'ok';

// urgent: 1-2 days left (red), soon: 3-5 days (amber), ok: later
export function getExpiryStatus(days: number): ExpiryStatus {
  if (days < 0) return 'expired';
  if (days === 0) return 'today';
  if (days <= 2) return 'urgent';
  if (days <= 5) return 'soon';
  return 'ok';
}

export function describeExpiry(days: number): string {
  if (days < -1) return `Expired ${-days} days ago`;
  if (days === -1) return 'Expired yesterday';
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  return `Expires in ${days} days`;
}

// A short label for a small badge on a pantry chip
export function describeExpiryShort(days: number): string {
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

// ---------- what to use up ----------

export type ExpiringItem<T> = { ingredient: T; days: number };

// Items that are expired or expire within `withinDays` days, most urgent first
export function getUseSoon<T extends { expiresOn?: string }>(ingredients: T[], now: Date = new Date(), withinDays = 3): ExpiringItem<T>[] {
  return ingredients
    .map((ingredient) => ({ ingredient, days: daysUntil(ingredient.expiresOn, now) }))
    .filter((entry): entry is ExpiringItem<T> => entry.days !== null && entry.days <= withinDays)
    .sort((a, b) => a.days - b.days);
}

// ---------- typical shelf life ----------

// Rough fridge/counter life in days for common foods. A guide for a quick preset, not food-safety advice:
// the UI labels it "typical" and the user can always pick their own date.
const SHELF_LIFE_DAYS: [string[], number][] = [
  [['spinach', 'palak', 'coriander', 'cilantro', 'mint', 'lettuce', 'methi', 'fenugreek', 'curry leaf', 'basil', 'parsley', 'dill', 'spring onion', 'microgreen'], 3],
  [['chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'prawn', 'shrimp', 'keema', 'salmon', 'turkey', 'crab'], 2],
  [['milk', 'cream', 'buttermilk', 'lassi'], 3],
  [['bread', 'banana', 'berry', 'strawberry', 'mushroom', 'cauliflower', 'broccoli', 'cabbage'], 4],
  [['tomato', 'paneer', 'cucumber', 'capsicum', 'bell pepper', 'brinjal', 'eggplant', 'okra', 'bhindi', 'zucchini', 'peas', 'beans', 'grape', 'mango', 'papaya'], 5],
  [['curd', 'yogurt', 'yoghurt', 'carrot', 'beetroot', 'radish', 'lemon', 'lime', 'chilli', 'chili', 'ginger', 'apple', 'orange', 'pomegranate'], 7],
  [['cheese'], 14],
  [['egg'], 21],
  [['potato', 'onion', 'pumpkin', 'garlic'], 21],
  [['butter', 'ghee'], 30],
];

export function suggestShelfLifeDays(name: string): number | null {
  const words = nameWords(name);
  const text = words.join(' ');
  for (const [keywords, days] of SHELF_LIFE_DAYS) {
    if (keywords.some((keyword) => (keyword.includes(' ') ? text.includes(keyword) : words.includes(keyword)))) return days;
  }
  return null;
}
