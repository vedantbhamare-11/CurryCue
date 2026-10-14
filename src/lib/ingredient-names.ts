// Matching of ingredient names ("Tomatoes" vs "tomato", "Bell pepper" vs "green bell pepper"),
// shared by recipe generation, the shopping list and the pantry. Pure functions: tested in Node.

export function singularize(word: string): string {
  if (word === 'leaves') return 'leaf';
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.endsWith('oes')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

// Names that mean the same ingredient, written one canonical way so "Palak" and "Spinach" compare equal.
// Deliberately stricter than the search-box aliases: only true equivalents (lime is not a lemon, and chana dal
// is not chickpeas), because this decides what you "already have". [canonical name, other names]
const SYNONYMS: [string, string[]][] = [
  ['spinach', ['palak']], ['onion', ['pyaz', 'pyaaz', 'kanda']], ['potato', ['aloo', 'batata']], ['tomato', ['tamatar']],
  ['garlic', ['lehsun', 'lasan']], ['ginger', ['adrak']], ['coriander', ['cilantro', 'dhania']], ['mint', ['pudina']],
  ['chilli', ['chili', 'chile', 'mirchi']], ['green chilli', ['hari mirch']], ['red chilli', ['lal mirch']],
  ['eggplant', ['brinjal', 'aubergine', 'baingan']], ['capsicum', ['bell pepper', 'shimla mirch']],
  ['okra', ['bhindi', 'ladyfinger', 'lady finger']], ['pea', ['matar']], ['lemon', ['nimbu']],
  ['yogurt', ['curd', 'dahi', 'yoghurt']], ['egg', ['anda']], ['paneer', ['cottage cheese']], ['prawn', ['shrimp']],
  ['cumin', ['jeera']], ['turmeric', ['haldi']], ['mustard', ['rai']], ['asafoetida', ['hing', 'asafetida']],
  ['fenugreek', ['methi']], ['cardamom', ['elaichi']], ['clove', ['laung']], ['cinnamon', ['dalchini']],
  ['bay leaf', ['tej patta']], ['curry leaf', ['kadi patta', 'kadipatta', 'kari patta']], ['fennel', ['saunf']],
  ['carom', ['ajwain']], ['black pepper', ['kali mirch', 'peppercorn']], ['sugar', ['cheeni']], ['jaggery', ['gur']],
  ['honey', ['shahad']], ['tamarind', ['imli']], ['wheat flour', ['atta']], ['gram flour', ['besan']],
  ['all purpose flour', ['maida']], ['semolina', ['sooji', 'suji', 'rava', 'rawa']], ['flattened rice', ['poha', 'beaten rice']],
  ['sago', ['sabudana']], ['toor dal', ['arhar dal', 'tur dal']], ['chickpea', ['chole', 'garbanzo']],
  ['kidney bean', ['rajma']], ['ghee', ['clarified butter']], ['milk', ['doodh']], ['rice', ['chawal']], ['salt', ['namak']],
  ['zucchini', ['courgette']], ['spring onion', ['scallion', 'green onion']], ['carrot', ['gajar']], ['cucumber', ['kheera']],
  ['beetroot', ['beet', 'chukandar']], ['bottle gourd', ['lauki', 'doodhi']], ['bitter gourd', ['karela', 'bitter melon']],
  ['pumpkin', ['kaddu']], ['radish', ['mooli']], ['peanut', ['moongfali', 'groundnut']], ['cashew', ['kaju']], ['almond', ['badam']],
];

function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(singularize);
}

type Synonym = { other: string[]; canonical: string[] };
// First word of the other name -> its entries, longest first so "hari mirch" wins over "mirch"
const SYNONYM_INDEX = new Map<string, Synonym[]>();
for (const [canonical, others] of SYNONYMS) {
  for (const other of others) {
    const entry = { other: tokens(other), canonical: tokens(canonical) };
    SYNONYM_INDEX.set(entry.other[0], [...(SYNONYM_INDEX.get(entry.other[0]) ?? []), entry].sort((a, b) => b.other.length - a.other.length));
  }
}

function canonicalise(words: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < words.length; ) {
    const hit = SYNONYM_INDEX.get(words[i])?.find((entry) => entry.other.every((word, j) => words[i + j] === word));
    if (hit) {
      result.push(...hit.canonical);
      i += hit.other.length;
    } else {
      result.push(words[i++]);
    }
  }
  return result;
}

export function nameWords(name: string): string[] {
  return canonicalise(tokens(name));
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

// Models write notes into the name or unit: "Cream (optional)", "Onion, finely chopped", unit "tsp grated".
// The note is not part of what you buy or store, so it is dropped before an ingredient reaches a list.
export function cleanIngredientName(name: string): string {
  const cleaned = name.replace(/\([^)]*\)/g, ' ').replace(/,.*$/, '').replace(/\s+/g, ' ').trim();
  return cleaned || name.trim();
}

const PREPARATION_WORDS = new Set([
  'grated', 'chopped', 'minced', 'sliced', 'diced', 'crushed', 'ground', 'finely', 'roughly', 'peeled', 'optional',
  'fresh', 'beaten', 'shredded', 'cubed', 'mashed', 'melted', 'softened', 'boiled', 'cooked', 'toasted', 'roasted',
]);

export function cleanUnit(unit?: string): string | undefined {
  if (!unit) return undefined;
  const kept = unit
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !PREPARATION_WORDS.has(word.toLowerCase()))
    .join(' ');
  return kept || undefined;
}
