// Cleaning of fields the model returns for a recipe. The model is asked for exact values ("easy" | "medium" | "hard",
// a number of minutes, a list of tags) but returns near-misses ("intermediate", "45 minutes", a string). These pure
// functions turn near-misses into the app's real types so the UI never has to guess.

export type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_WORDS: Record<string, Difficulty> = {
  easy: 'easy', beginner: 'easy', simple: 'easy', basic: 'easy', quick: 'easy', effortless: 'easy',
  medium: 'medium', intermediate: 'medium', moderate: 'medium', average: 'medium',
  hard: 'hard', difficult: 'hard', advanced: 'hard', challenging: 'hard', expert: 'hard', complex: 'hard',
};

export function normalizeDifficulty(value: unknown): Difficulty | undefined {
  return typeof value === 'string' ? DIFFICULTY_WORDS[value.trim().toLowerCase()] : undefined;
}

// 45, "45", "45 minutes", "45 min" -> 45. Anything else (or a nonsense amount) -> the fallback.
export function normalizeCookTime(value: unknown, fallback = 30): number {
  const minutes = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(minutes) && minutes >= 1 && minutes <= 1440 ? Math.round(minutes) : fallback;
}

export function normalizeTags(value: unknown, fallback: string[] = [], maxTags = 6): string[] {
  if (!Array.isArray(value)) return fallback;
  const tags = value
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().slice(0, 30))
    .filter(Boolean);
  return tags.length > 0 ? [...new Set(tags)].slice(0, maxTags) : fallback;
}

export function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export const asList = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

// Dishes that use nothing from the pantry (0% match) are noise when the user asked for what they can cook.
// If that would leave nothing, keep them all: an imperfect list beats an error, and the matcher can miss synonyms.
export function keepRecipesUsingPantry<T extends { usedIngredients?: unknown[] }>(recipes: T[], pantrySize: number): T[] {
  if (pantrySize === 0) return recipes;
  const relevant = recipes.filter((recipe) => (recipe.usedIngredients?.length ?? 0) > 0);
  return relevant.length > 0 ? relevant : recipes;
}
