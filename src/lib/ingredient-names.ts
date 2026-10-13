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

export function namesMatch(a: string, b: string): boolean {
  const wordsA = nameWords(a);
  const wordsB = nameWords(b);
  if (wordsA.length === 0 || wordsB.length === 0) return false;
  return containsPhrase(wordsA, wordsB) || containsPhrase(wordsB, wordsA);
}
