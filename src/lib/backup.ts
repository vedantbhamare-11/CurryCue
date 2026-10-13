// Backup and restore of everything the app keeps in the browser (pantry, shopping list, saved recipes,
// preferences). Pure functions (no React, no storage) so they can be tested in Node.
//
// A backup file is untrusted input: it may be hand-edited, truncated, from a newer version, or not a backup at
// all. Everything is therefore rebuilt from a whitelist of known fields with type checks and size limits; unknown
// fields are dropped, and nothing from the file is ever spread into app state as-is.
import type { Ingredient, Recipe, UserPreferences } from '@/types';
import { parseDateKey, toDateKey } from '@/lib/expiry';
import { addManyToPantry } from '@/lib/pantry';
import { addItems, type ShoppingItem } from '@/lib/shopping-list';

export const BACKUP_APP = 'curry-cue';
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 5_000_000;

const LIMITS = { ingredients: 500, shopping: 500, recipes: 200, recents: 10, steps: 60, tags: 12, recipeIngredients: 100, listItem: 20 };

export type BackupData = {
  ingredients: Ingredient[];
  shoppingList: ShoppingItem[];
  favoriteRecipes: Recipe[];
  recentRecipes: Recipe[];
  preferences?: UserPreferences;
};

export type Backup = { app: typeof BACKUP_APP; version: number; exportedAt: string; data: BackupData };

export type BackupSummary = { ingredients: number; shoppingItems: number; favoriteRecipes: number; recentRecipes: number; exportedAt?: string };

export type ParseResult = { ok: true; data: BackupData; summary: BackupSummary } | { ok: false; error: string };

// ---------- export ----------

export function createBackup(data: BackupData, now: Date = new Date()): Backup {
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now.toISOString(), data };
}

export function backupFileName(now: Date = new Date()): string {
  return `currycue-backup-${toDateKey(now)}.json`;
}

// ---------- sanitising ----------

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function number(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

// Only plain web images; a "javascript:" or "data:" URL from a file has no business in an <img>
function imageUrl(value: unknown): string | undefined {
  const url = text(value, 500);
  return url && /^https:\/\//i.test(url) ? url : undefined;
}

function stringList(value: unknown, maxItems: number, maxLength: number): string[] {
  return Array.isArray(value) ? value.map((item) => text(item, maxLength)).filter((item): item is string => !!item).slice(0, maxItems) : [];
}

function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)));
}

function makeId(prefix: string, index: number): string {
  return `${prefix}-restored-${Date.now()}-${index}`;
}

export function sanitizeIngredient(value: unknown, index = 0): Ingredient | null {
  if (!isRecord(value)) return null;
  const name = text(value.name, 100);
  if (!name) return null;
  const expiresOn = typeof value.expiresOn === 'string' && parseDateKey(value.expiresOn) ? value.expiresOn : undefined;
  return {
    id: text(value.id, 100) ?? makeId('ing', index),
    name,
    ...(text(value.quantity, 30) ? { quantity: text(value.quantity, 30) } : {}),
    ...(text(value.unit, 30) ? { unit: text(value.unit, 30) } : {}),
    ...(imageUrl(value.image) ? { image: imageUrl(value.image) } : {}),
    ...(expiresOn ? { expiresOn } : {}),
  };
}

export function sanitizeShoppingItem(value: unknown, index = 0): ShoppingItem | null {
  if (!isRecord(value)) return null;
  const name = text(value.name, 100);
  if (!name) return null;
  return {
    id: text(value.id, 100) ?? makeId('shop', index),
    name,
    ...(text(value.quantity, 30) ? { quantity: text(value.quantity, 30) } : {}),
    ...(text(value.unit, 30) ? { unit: text(value.unit, 30) } : {}),
    checked: value.checked === true,
    addedAt: number(value.addedAt, 0, 8_640_000_000_000_000, Date.now()),
    recipes: stringList(value.recipes, LIMITS.listItem, 100),
  };
}

function sanitizeIngredientList(value: unknown, max: number): Ingredient[] {
  return Array.isArray(value) ? value.slice(0, max).map((item, i) => sanitizeIngredient(item, i)).filter((item): item is Ingredient => !!item) : [];
}

export function sanitizeRecipe(value: unknown, index = 0): Recipe | null {
  if (!isRecord(value)) return null;
  const title = text(value.title, 200);
  const steps = stringList(value.steps, LIMITS.steps, 1000);
  // A recipe without a title or steps cannot be shown or cooked, so it is not worth keeping
  if (!title || steps.length === 0) return null;

  const difficulty = value.difficulty === 'easy' || value.difficulty === 'hard' ? value.difficulty : 'medium';
  const used = sanitizeIngredientList(value.usedIngredients, LIMITS.recipeIngredients);
  const assumed = sanitizeIngredientList(value.assumedIngredients, LIMITS.recipeIngredients);
  const missing = sanitizeIngredientList(value.missingIngredients, LIMITS.recipeIngredients);
  const ingredients = sanitizeIngredientList(value.ingredients, LIMITS.recipeIngredients);

  return {
    id: text(value.id, 100) ?? makeId('recipe', index),
    title,
    description: text(value.description, 1000) ?? '',
    matchPercentage: Math.round(number(value.matchPercentage, 0, 100, 0)),
    cookTime: Math.round(number(value.cookTime, 0, 1440, 30)),
    difficulty,
    image: imageUrl(value.image) ?? '',
    ingredients: ingredients.length > 0 ? ingredients : [...used, ...assumed, ...missing],
    steps,
    cuisine: text(value.cuisine, 50) ?? 'General',
    tags: stringList(value.tags, LIMITS.tags, 40),
    usedIngredients: used,
    assumedIngredients: assumed,
    missingIngredients: missing,
    usesExpiring: stringList(value.usesExpiring, LIMITS.listItem, 100),
  };
}

function sanitizeRecipes(value: unknown, max: number): Recipe[] {
  return Array.isArray(value) ? dedupe(value.slice(0, max).map((item, i) => sanitizeRecipe(item, i)).filter((item): item is Recipe => !!item)) : [];
}

function sanitizePreferences(value: unknown): UserPreferences | undefined {
  if (!isRecord(value)) return undefined;
  const skill = value.skillLevel === 'beginner' || value.skillLevel === 'advanced' ? value.skillLevel : 'intermediate';
  const time = isRecord(value.cookingTime)
    ? { min: number(value.cookingTime.min, 0, 1440, 0), max: number(value.cookingTime.max, 0, 1440, 60) }
    : undefined;
  return {
    dietaryRestrictions: stringList(value.dietaryRestrictions, 30, 60),
    allergies: stringList(value.allergies, 30, 60),
    cuisinePreferences: stringList(value.cuisinePreferences, 30, 60),
    skillLevel: skill,
    mealTypes: stringList(value.mealTypes, 10, 30),
    ...(time ? { cookingTime: time } : {}),
  };
}

// ---------- import ----------

export function parseBackup(raw: string): ParseResult {
  if (raw.length > MAX_BACKUP_BYTES) return { ok: false, error: 'This file is too large to be a CurryCue backup.' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "This file isn't valid JSON, so it can't be a CurryCue backup." };
  }

  if (!isRecord(parsed) || parsed.app !== BACKUP_APP || !isRecord(parsed.data)) {
    return { ok: false, error: "This doesn't look like a CurryCue backup file." };
  }
  if (typeof parsed.version !== 'number' || !Number.isInteger(parsed.version) || parsed.version < 1) {
    return { ok: false, error: 'This backup has no valid version number.' };
  }
  if (parsed.version > BACKUP_VERSION) {
    return { ok: false, error: 'This backup was made by a newer version of CurryCue. Update the app and try again.' };
  }

  const source = parsed.data;
  const data: BackupData = {
    ingredients: dedupe(sanitizeIngredientList(source.ingredients, LIMITS.ingredients)),
    shoppingList: dedupe(
      (Array.isArray(source.shoppingList) ? source.shoppingList.slice(0, LIMITS.shopping) : [])
        .map((item, i) => sanitizeShoppingItem(item, i))
        .filter((item): item is ShoppingItem => !!item)
    ),
    favoriteRecipes: sanitizeRecipes(source.favoriteRecipes, LIMITS.recipes),
    recentRecipes: sanitizeRecipes(source.recentRecipes, LIMITS.recents),
    preferences: sanitizePreferences(source.preferences),
  };

  const exportedAt = typeof parsed.exportedAt === 'string' && !Number.isNaN(Date.parse(parsed.exportedAt)) ? parsed.exportedAt : undefined;
  return {
    ok: true,
    data,
    summary: {
      ingredients: data.ingredients.length,
      shoppingItems: data.shoppingList.length,
      favoriteRecipes: data.favoriteRecipes.length,
      recentRecipes: data.recentRecipes.length,
      exportedAt,
    },
  };
}

// ---------- applying ----------

// Merge: nothing the user already has is lost. Pantry duplicates combine (amounts add up), shopping list items
// still to buy are added or combined, recipes are unioned by id with the current copy winning.
export function mergeBackup(
  current: BackupData,
  incoming: BackupData,
  // Preferences are one set of choices, not a list. Keep the current ones if the user has customised them;
  // a fresh app only has defaults, so there the backup's preferences are the better answer.
  options: { keepCurrentPreferences?: boolean } = {}
): BackupData {
  const { keepCurrentPreferences = true } = options;
  const pantry = addManyToPantry(current.ingredients, incoming.ingredients).items;
  const toBuy = incoming.shoppingList.filter((item) => !item.checked);
  const shoppingList = addItems(current.shoppingList, toBuy.map(({ name, quantity, unit }) => ({ name, quantity, unit })), {}).items;

  const union = (a: Recipe[], b: Recipe[], max: number) => {
    const ids = new Set(a.map((recipe) => recipe.id));
    return [...a, ...b.filter((recipe) => !ids.has(recipe.id))].slice(0, max);
  };

  return {
    ingredients: pantry,
    shoppingList,
    favoriteRecipes: union(current.favoriteRecipes, incoming.favoriteRecipes, LIMITS.recipes),
    recentRecipes: union(current.recentRecipes, incoming.recentRecipes, LIMITS.recents),
    preferences: keepCurrentPreferences ? current.preferences ?? incoming.preferences : incoming.preferences ?? current.preferences,
  };
}
