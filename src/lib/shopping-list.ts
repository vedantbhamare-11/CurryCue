// Shopping list logic: merging duplicates and quantities, grouping by aisle, sharing text, and moving
// bought items to the pantry. Pure functions (no React, no storage) so they are tested in Node.
import { namesMatch, nameWords } from '@/lib/ingredient-names';

export type ShoppingItem = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  checked: boolean;
  addedAt: number;
  // Titles of the recipes this item was added for ("for Tomato Rice")
  recipes: string[];
};

export type IncomingItem = { name: string; quantity?: string; unit?: string };
export type PantryItemLike = { id?: string; name: string; quantity?: string; unit?: string };

// ---------- quantities ----------

const UNICODE_FRACTIONS: Record<string, number> = { '½': 0.5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 0.25, '¾': 0.75, '⅛': 0.125 };

// "250" -> 250, "1.5" -> 1.5, "1/2" -> 0.5, "1 1/2" -> 1.5, "½" -> 0.5; anything else ("to taste") -> null
export function parseAmount(quantity?: string): number | null {
  if (!quantity) return null;
  let text = quantity.trim();
  if (!text) return null;

  let fromUnicode = 0;
  for (const [char, value] of Object.entries(UNICODE_FRACTIONS)) {
    if (text.includes(char)) {
      fromUnicode += value;
      text = text.split(char).join('').trim();
    }
  }
  if (fromUnicode > 0) {
    if (text === '') return fromUnicode;
    return /^\d+$/.test(text) ? Number(text) + fromUnicode : null;
  }

  const mixed = text.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const fraction = text.match(/^(\d+)\/(\d+)$/);
  if (fraction) return Number(fraction[2]) === 0 ? null : Number(fraction[1]) / Number(fraction[2]);
  return /^\d+(\.\d+)?$/.test(text) ? Number(text) : null;
}

export function formatAmount(value: number): string {
  return String(Math.round(value * 100) / 100);
}

// Splits a typed quantity like "250 gm", "2kg", "1/2 cup" or "3" into quantity and unit
export function parseQuantityText(text: string): { quantity?: string; unit?: string } {
  const trimmed = text.trim();
  if (!trimmed) return {};
  const match = trimmed.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s*([a-zA-Z.]*)$/);
  if (!match) return { quantity: trimmed };
  return { quantity: match[1].trim(), unit: match[2].replace(/\.$/, '') || undefined };
}

type UnitFamily = { family: 'mass' | 'volume' | 'other'; base: string; factor: number };

const UNIT_TABLE: Record<string, UnitFamily> = {
  g: { family: 'mass', base: 'g', factor: 1 }, gm: { family: 'mass', base: 'g', factor: 1 }, gms: { family: 'mass', base: 'g', factor: 1 },
  gram: { family: 'mass', base: 'g', factor: 1 }, grams: { family: 'mass', base: 'g', factor: 1 },
  kg: { family: 'mass', base: 'g', factor: 1000 }, kgs: { family: 'mass', base: 'g', factor: 1000 },
  kilogram: { family: 'mass', base: 'g', factor: 1000 }, kilograms: { family: 'mass', base: 'g', factor: 1000 },
  ml: { family: 'volume', base: 'ml', factor: 1 }, millilitre: { family: 'volume', base: 'ml', factor: 1 }, millilitres: { family: 'volume', base: 'ml', factor: 1 },
  l: { family: 'volume', base: 'ml', factor: 1000 }, litre: { family: 'volume', base: 'ml', factor: 1000 }, litres: { family: 'volume', base: 'ml', factor: 1000 },
  liter: { family: 'volume', base: 'ml', factor: 1000 }, liters: { family: 'volume', base: 'ml', factor: 1000 },
};

// Count-like units that all mean "pieces" ("2 nos" and "2 pcs" are the same thing)
const PIECE_UNITS = new Set(['no', 'nos', 'pc', 'pcs', 'piece', 'pieces', 'unit', 'units', '']);

function unitInfo(unit?: string): UnitFamily {
  const key = (unit ?? '').trim().toLowerCase().replace(/\.$/, '');
  if (UNIT_TABLE[key]) return UNIT_TABLE[key];
  if (PIECE_UNITS.has(key)) return { family: 'other', base: 'pieces', factor: 1 };
  return { family: 'other', base: key, factor: 1 };
}

// 1500 g -> "1.5 kg", 500 g -> "500 gm"; the app uses "gm" in its suggestions, so match it
function displayMeasure(value: number, base: string): { quantity: string; unit: string } {
  if (base === 'g') return value >= 1000 ? { quantity: formatAmount(value / 1000), unit: 'kg' } : { quantity: formatAmount(value), unit: 'gm' };
  if (base === 'ml') return value >= 1000 ? { quantity: formatAmount(value / 1000), unit: 'l' } : { quantity: formatAmount(value), unit: 'ml' };
  return { quantity: formatAmount(value), unit: base === 'pieces' ? '' : base };
}

// Adds two amounts of the same ingredient. 500 g + 1 kg -> 1.5 kg; 2 + 3 pieces -> 5; "2 nos" + "3 pcs" -> 5.
// Different kinds of unit (1 cup + 200 g) cannot be added, so the existing amount is kept.
export function mergeAmounts(
  a: { quantity?: string; unit?: string },
  b: { quantity?: string; unit?: string }
): { quantity?: string; unit?: string } {
  const amountA = parseAmount(a.quantity);
  const amountB = parseAmount(b.quantity);

  if (amountB === null) return { quantity: a.quantity, unit: a.unit };
  if (amountA === null) return a.quantity ? { quantity: a.quantity, unit: a.unit } : { quantity: b.quantity, unit: b.unit };

  const infoA = unitInfo(a.unit);
  const infoB = unitInfo(b.unit);
  const sameKind = infoA.family === infoB.family && infoA.base === infoB.base;
  if (!sameKind) return { quantity: a.quantity, unit: a.unit };

  const total = amountA * infoA.factor + amountB * infoB.factor;
  if (infoA.family === 'other') {
    const unit = (a.unit ?? '').trim() || (b.unit ?? '').trim();
    return { quantity: formatAmount(total), unit: unit || undefined };
  }
  const shown = displayMeasure(total, infoA.base);
  return { quantity: shown.quantity, unit: shown.unit };
}

// ---------- aisles ----------

export const CATEGORY_ORDER = [
  'Fruits & vegetables',
  'Dairy & eggs',
  'Meat & fish',
  'Grains, pulses & flour',
  'Spices & masalas',
  'Oils, sauces & pantry',
  'Other',
] as const;
export type ShoppingCategory = (typeof CATEGORY_ORDER)[number];

const CATEGORY_KEYWORDS: [ShoppingCategory, string[]][] = [
  // Phrases that would otherwise be caught by a more general keyword below (bell pepper is not a spice)
  ['Fruits & vegetables', ['bell pepper', 'green pepper', 'curry leaf', 'coriander leaf', 'mint leaf']],
  // Checked in this order, so "coriander powder" is a spice before "coriander" can be a vegetable
  ['Spices & masalas', ['powder', 'masala', 'seed', 'salt', 'pepper corn', 'peppercorn', 'pepper', 'turmeric', 'haldi', 'cumin', 'jeera', 'mustard', 'cardamom', 'elaichi', 'clove', 'cinnamon', 'bay', 'fenugreek', 'methi seed', 'asafoetida', 'hing', 'saffron', 'oregano', 'thyme', 'paprika', 'spice', 'chaat', 'dried']],
  ['Meat & fish', ['chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'prawn', 'shrimp', 'crab', 'keema', 'salmon', 'tuna', 'sausage', 'bacon', 'ham', 'turkey']],
  ['Oils, sauces & pantry', ['oil', 'vinegar', 'sauce', 'ketchup', 'sugar', 'jaggery', 'honey', 'tamarind', 'soy', 'mayonnaise', 'paste', 'stock', 'yeast', 'cocoa', 'vanilla', 'almond', 'cashew', 'raisin', 'peanut', 'walnut', 'tea', 'coffee', 'coconut milk', 'baking']],
  ['Grains, pulses & flour', ['rice', 'dal', 'lentil', 'atta', 'flour', 'maida', 'besan', 'rava', 'semolina', 'suji', 'poha', 'oat', 'pasta', 'noodle', 'bread', 'chickpea', 'chana', 'rajma', 'moong', 'urad', 'toor', 'masoor', 'quinoa', 'vermicelli', 'sabudana', 'couscous', 'barley', 'bean', 'macaroni', 'spaghetti']],
  ['Dairy & eggs', ['milk', 'curd', 'yogurt', 'yoghurt', 'paneer', 'cheese', 'butter', 'ghee', 'cream', 'egg', 'buttermilk', 'khoya', 'mozzarella', 'lassi']],
  ['Fruits & vegetables', ['tomato', 'onion', 'potato', 'garlic', 'ginger', 'chilli', 'chili', 'spinach', 'palak', 'coriander', 'cilantro', 'mint', 'lemon', 'lime', 'carrot', 'cabbage', 'cauliflower', 'brinjal', 'eggplant', 'aubergine', 'okra', 'bhindi', 'capsicum', 'cucumber', 'pea', 'pumpkin', 'banana', 'apple', 'mango', 'curry leaf', 'mushroom', 'corn', 'beetroot', 'radish', 'zucchini', 'broccoli', 'orange', 'grape', 'papaya', 'pomegranate', 'coconut', 'fruit', 'vegetable', 'leaf', 'lettuce', 'gourd', 'drumstick', 'basil', 'parsley', 'avocado', 'berry']],
];

export function categorize(name: string): ShoppingCategory {
  const words = nameWords(name);
  const text = words.join(' ');
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    // Match whole words, plus word prefixes for multi-word keywords like "coconut milk" / "curry leaf"
    if (keywords.some((keyword) => (keyword.includes(' ') ? text.includes(keyword) : words.some((word) => word === keyword || (keyword.length >= 4 && word.startsWith(keyword)))))) {
      return category;
    }
  }
  return 'Other';
}

export function groupByCategory<T extends { name: string }>(items: T[]): { category: ShoppingCategory; items: T[] }[] {
  const groups = new Map<ShoppingCategory, T[]>();
  for (const item of items) {
    const category = categorize(item.name);
    groups.set(category, [...(groups.get(category) ?? []), item]);
  }
  return CATEGORY_ORDER.filter((category) => groups.has(category)).map((category) => ({ category, items: groups.get(category)! }));
}

// ---------- adding items ----------

export type AddResult = { items: ShoppingItem[]; added: string[]; merged: string[]; skippedInPantry: string[] };

const titleCase = (name: string) => name.trim().replace(/^./, (c) => c.toUpperCase());

export function addItems(
  current: ShoppingItem[],
  incoming: IncomingItem[],
  options: { pantry?: PantryItemLike[]; recipeTitle?: string; now?: number; makeId?: () => string } = {}
): AddResult {
  const now = options.now ?? Date.now();
  let counter = 0;
  const makeId = options.makeId ?? (() => `shop-${now}-${counter++}-${Math.random().toString(36).slice(2, 7)}`);

  // Copy the nested array too: items live in a store, so mutating them in place would be a silent bug
  const items = current.map((item) => ({ ...item, recipes: [...item.recipes] }));
  const added: string[] = [];
  const merged: string[] = [];
  const skippedInPantry: string[] = [];

  for (const raw of incoming) {
    const name = raw.name?.trim();
    if (!name) continue;

    if (options.pantry?.some((pantryItem) => namesMatch(pantryItem.name, name))) {
      skippedInPantry.push(name);
      continue;
    }

    // Merge into an item still to buy; a bought (checked) one is a past purchase, so add a fresh entry
    const existing = items.find((item) => !item.checked && namesMatch(item.name, name));
    if (existing) {
      const combined = mergeAmounts(existing, raw);
      existing.quantity = combined.quantity;
      existing.unit = combined.unit;
      if (options.recipeTitle && !existing.recipes.includes(options.recipeTitle)) existing.recipes.push(options.recipeTitle);
      merged.push(existing.name);
      continue;
    }

    items.push({
      id: makeId(),
      name: titleCase(name),
      quantity: raw.quantity || undefined,
      unit: raw.unit || undefined,
      checked: false,
      addedAt: now,
      recipes: options.recipeTitle ? [options.recipeTitle] : [],
    });
    added.push(titleCase(name));
  }

  return { items, added, merged, skippedInPantry };
}

// ---------- sharing ----------

export function describeAmount(item: { quantity?: string; unit?: string }): string {
  return [item.quantity, item.unit].filter(Boolean).join(' ');
}

// Plain text for copy / WhatsApp. WhatsApp renders *text* as bold.
export function formatForSharing(items: ShoppingItem[]): string {
  const toBuy = items.filter((item) => !item.checked);
  if (toBuy.length === 0) return '';
  const sections = groupByCategory(toBuy).map(({ category, items: group }) => {
    const lines = group.map((item) => {
      const amount = describeAmount(item);
      return `• ${item.name}${amount ? ` — ${amount}` : ''}`;
    });
    return `*${category}*\n${lines.join('\n')}`;
  });
  return `🛒 *Shopping list*\n\n${sections.join('\n\n')}`;
}

// ---------- buying -> pantry ----------

// What to do with ticked-off items: add new pantry entries, or top up an existing one (bought 500 gm more tomato)
export function planPantryMove(
  bought: ShoppingItem[],
  pantry: PantryItemLike[]
): { toAdd: IncomingItem[]; toUpdate: { id: string; quantity?: string; unit?: string; name: string }[] } {
  const toAdd: IncomingItem[] = [];
  const toUpdate: { id: string; quantity?: string; unit?: string; name: string }[] = [];

  for (const item of bought) {
    const existing = pantry.find((pantryItem) => pantryItem.id && namesMatch(pantryItem.name, item.name));
    if (existing?.id) {
      const combined = mergeAmounts(existing, item);
      toUpdate.push({ id: existing.id, name: existing.name, quantity: combined.quantity, unit: combined.unit });
    } else {
      toAdd.push({ name: item.name, quantity: item.quantity, unit: item.unit });
    }
  }
  return { toAdd, toUpdate };
}
