// Matching of ingredient names ("Tomatoes" vs "tomato", "Bell pepper" vs "green bell pepper"),
// shared by recipe generation, the shopping list and the pantry. Pure functions: tested in Node.

export function singularize(word: string): string {
  if (word === 'leaves') return 'leaf';
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.endsWith('oes')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export function nameWords(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(singularize);
}

function containsPhrase(haystack: string[], needle: string[]): boolean {
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    if (needle.every((word, j) => haystack[i + j] === word)) return true;
  }
  return false;
}

// Words that turn an ingredient into a *different product*: rice flour is not rice, tomato puree is not a
// tomato, coconut milk is not milk. A match must not hinge on one of these being present on only one side.
const FORM_WORDS = new Set([
  'powder', 'flour', 'paste', 'puree', 'sauce', 'oil', 'milk', 'juice', 'cream', 'vinegar', 'syrup',
  'extract', 'stock', 'butter', 'masala', 'pickle', 'chutney', 'ketchup', 'jam', 'essence',
]);

// Harmless descriptors: "toned milk" is still milk, "unsalted butter" is still butter, "green bell pepper" is
// still a bell pepper
const MODIFIERS = new Set([
  'fresh', 'raw', 'ripe', 'large', 'small', 'medium', 'big', 'baby', 'whole', 'organic', 'chopped', 'sliced',
  'diced', 'minced', 'grated', 'boiled', 'cooked', 'frozen', 'dried', 'dry', 'toned', 'full', 'skimmed', 'low',
  'fat', 'boneless', 'skinless', 'green', 'red', 'yellow', 'white', 'black', 'brown', 'sweet', 'hot', 'plain',
  'unsalted', 'salted', 'roasted',
]);

/**
 * Do these two names refer to the same ingredient? Strict about derived products, so a pantry with "Rice"
 * does not count as having "Rice flour", but "Tomatoes" = "Tomato" and "Green bell pepper" = "Bell pepper".
 */
export function namesMatch(a: string, b: string): boolean {
  const wordsA = nameWords(a);
  const wordsB = nameWords(b);
  if (wordsA.length === 0 || wordsB.length === 0) return false;

  const [short, long] = wordsA.length <= wordsB.length ? [wordsA, wordsB] : [wordsB, wordsA];
  if (!containsPhrase(long, short)) return false;

  const extras = long.filter((word) => !short.includes(word));
  if (extras.length === 0) return true;
  if (extras.some((word) => FORM_WORDS.has(word))) return false;
  // "milk" alone is a form word: it only matches "toned milk", never "coconut milk" or "almond milk"
  if (short.every((word) => FORM_WORDS.has(word)) && !extras.every((word) => MODIFIERS.has(word))) return false;
  return true;
}

/**
 * Lenient containment, for recognising pantry staples: the staple "Oil" should cover "Mustard oil" and
 * "Cumin" should cover "Cumin powder", because nobody needs to buy those to cook.
 */
export function staplesMatch(staple: string, name: string): boolean {
  const wordsA = nameWords(staple);
  const wordsB = nameWords(name);
  if (wordsA.length === 0 || wordsB.length === 0) return false;
  return containsPhrase(wordsA, wordsB) || containsPhrase(wordsB, wordsA);
}
