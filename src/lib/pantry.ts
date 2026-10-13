// Adding to the pantry without creating duplicates. Pure functions (no React, no storage), tested in Node.
import { namesMatch } from '@/lib/ingredient-names';
import { mergeAmounts } from '@/lib/shopping-list';
import { parseDateKey } from '@/lib/expiry';
import type { Ingredient } from '@/types';

export type PantryAddResult = {
  items: Ingredient[];
  merged: boolean;
  // Name of the existing pantry item that absorbed the new one
  mergedInto?: string;
};

// Of two expiry dates keep the earlier valid one: when you hold two batches, the older one decides when
// you must use it up
function earlierExpiry(a?: string, b?: string): string | undefined {
  const dateA = parseDateKey(a);
  const dateB = parseDateKey(b);
  if (dateA && dateB) return dateA <= dateB ? a : b;
  return dateA ? a : dateB ? b : undefined;
}

export function addToPantry(pantry: Ingredient[], incoming: Ingredient): PantryAddResult {
  const existing = pantry.find((item) => namesMatch(item.name, incoming.name));
  if (!existing) return { items: [...pantry, incoming], merged: false };

  const amount = mergeAmounts(existing, incoming);
  const expiresOn = earlierExpiry(existing.expiresOn, incoming.expiresOn);
  const items = pantry.map((item) =>
    item.id === existing.id ? { ...item, quantity: amount.quantity, unit: amount.unit, ...(expiresOn ? { expiresOn } : {}) } : item
  );
  return { items, merged: true, mergedInto: existing.name };
}

// Several at once (a scan result): later items merge into earlier ones too
export function addManyToPantry(pantry: Ingredient[], incoming: Ingredient[]): { items: Ingredient[]; mergedCount: number } {
  let items = pantry;
  let mergedCount = 0;
  for (const ingredient of incoming) {
    const result = addToPantry(items, ingredient);
    items = result.items;
    if (result.merged) mergedCount++;
  }
  return { items, mergedCount };
}
