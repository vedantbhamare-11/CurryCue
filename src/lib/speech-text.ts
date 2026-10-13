// Turns recipe text into something that sounds natural when a speech engine reads it aloud.
// Pure functions (no React, no browser APIs) so they can be tested without a speaker.
// Keep non-erasable TypeScript out of this file: it is run directly by Node in tests.

const UNICODE_FRACTIONS: Record<string, string> = {
  '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8',
};

// Spoken forms of common fractions ("1/2 cup" -> "half a cup")
const FRACTION_WORDS: Record<string, string> = {
  '1/2': 'half', '1/3': 'a third', '2/3': 'two thirds', '1/4': 'a quarter', '3/4': 'three quarters',
  '1/8': 'an eighth', '3/8': 'three eighths', '5/8': 'five eighths', '7/8': 'seven eighths',
};

// abbreviation -> [singular, plural]
const UNITS: Record<string, [string, string]> = {
  tsp: ['teaspoon', 'teaspoons'],
  tbsp: ['tablespoon', 'tablespoons'],
  g: ['gram', 'grams'],
  gm: ['gram', 'grams'],
  gms: ['gram', 'grams'],
  kg: ['kilogram', 'kilograms'],
  ml: ['millilitre', 'millilitres'],
  oz: ['ounce', 'ounces'],
  lb: ['pound', 'pounds'],
  lbs: ['pound', 'pounds'],
  pc: ['piece', 'pieces'],
  pcs: ['piece', 'pieces'],
  no: ['piece', 'pieces'],
  nos: ['piece', 'pieces'],
  min: ['minute', 'minutes'],
  mins: ['minute', 'minutes'],
  sec: ['second', 'seconds'],
  secs: ['second', 'seconds'],
  hr: ['hour', 'hours'],
  hrs: ['hour', 'hours'],
};

const UNIT_PATTERN = Object.keys(UNITS).join('|');

export function toSpeech(input: string): string {
  let text = input;

  // Formatting characters a speech engine may read out loud ("asterisk", "hash")
  text = text.replace(/[*_`#]+/g, ' ');

  // Dashes: non-breaking/figure hyphens and en dashes between numbers are ranges ("5‑6" -> "5-6");
  // an em dash is a pause
  text = text.replace(/[‐‑‒–]/g, '-').replace(/\s*[—]\s*/g, ', ');

  for (const [char, fraction] of Object.entries(UNICODE_FRACTIONS)) {
    text = text.split(char).join(` ${fraction}`);
  }

  // Only after a number (so "e.g." is not read as grams). "2 tbsp. oil" -> abbreviation dot (drop it); "1/2 tsp. Ingredient 3" -> end of sentence (keep it, it
  // is the pause between spoken items). Decided by whether a lowercase word follows; checked without the
  // regex's case-insensitive flag so capitals count as a new sentence.
  text = text.replace(
    new RegExp(`(?<=\\d\\s*)\\b(${UNIT_PATTERN}|cups?)\\.(?=\\s)`, 'gi'),
    (match, unit: string, offset: number, whole: string) =>
      /^\s+[a-z0-9(]/.test(whole.slice(offset + match.length)) ? unit : match
  );

  // Temperatures: 180°C -> 180 degrees Celsius
  text = text
    .replace(/(\d)\s*°\s*C\b/g, '$1 degrees Celsius')
    .replace(/(\d)\s*°\s*F\b/g, '$1 degrees Fahrenheit')
    .replace(/°/g, ' degrees ');

  // Ratios: 2:1 -> 2 to 1 (before ranges, so "1:2-3" cannot be misread)
  text = text.replace(/(\d+)\s*:\s*(\d+)/g, '$1 to $2');

  // Ranges: 5-6 -> 5 to 6 (so "5-6 minutes" is not read "five minus six minutes")
  text = text.replace(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/g, '$1 to $2');

  // Mixed numbers: "1 1/2 tsp" -> "1 and a half teaspoons". The unit after a mixed number is always
  // plural (more than one), and "half" needs an article here ("1 and half cups" does not sound right).
  text = text.replace(
    new RegExp(`(\\d+)\\s+(\\d+\\/\\d+)(?:\\s*(${UNIT_PATTERN}|cups?)\\b)?`, 'gi'),
    (match, whole: string, fraction: string, unitText?: string) => {
      const word = FRACTION_WORDS[fraction];
      if (!word) return match;
      const spoken = `${whole} and ${word === 'half' ? 'a half' : word}`;
      if (!unitText) return spoken;
      const lower = unitText.toLowerCase();
      const unit = lower === 'cup' || lower === 'cups' ? 'cups' : UNITS[lower] ? UNITS[lower][1] : lower;
      return `${spoken} ${unit}`;
    }
  );

  // Fraction followed by a unit: "1/2 tsp" -> "half a teaspoon", "1/4 cup" -> "a quarter cup"
  text = text.replace(
    new RegExp(`(?<![\\d/])(\\d+\\/\\d+)\\s*(${UNIT_PATTERN}|cup|cups)\\b`, 'gi'),
    (match, fraction: string, unitText: string) => {
      const word = FRACTION_WORDS[fraction];
      if (!word) return match;
      const lower = unitText.toLowerCase();
      const unit = lower === 'cups' ? 'cup' : UNITS[lower] ? UNITS[lower][0] : lower;
      return word === 'half' ? `half a ${unit}` : `${word} ${unit}`;
    }
  );

  // Remaining bare fractions: "1/2" -> "half"
  text = text.replace(/(?<![\d/])(\d+\/\d+)(?![\d/])/g, (match, fraction: string) => FRACTION_WORDS[fraction] ?? match);

  // Units after a number: "250 gm" -> "250 grams", "1 tsp" -> "1 teaspoon", "2 nos" -> "2 pieces"
  text = text.replace(
    new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})\\b`, 'gi'),
    (match, amount: string, unitText: string) => {
      const [singular, plural] = UNITS[unitText.toLowerCase()];
      return `${amount} ${Number(amount) === 1 ? singular : plural}`;
    }
  );

  // Common abbreviations and symbols
  text = text
    .replace(/\bapprox\.?(?=\s)/gi, 'approximately')
    .replace(/\be\.g\.,?/gi, 'for example')
    .replace(/\bi\.e\.,?/gi, 'that is')
    .replace(/\betc\.?/gi, 'and so on')
    .replace(/\s&\s/g, ' and ');

  return text.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

// Ranks voices when choosing the nicest English (India) one: installed "enhanced/premium/neural"
// variants sound far less robotic than the basic system voice.
const QUALITY_MARKERS: [RegExp, number][] = [
  [/premium/i, 4],
  [/neural|natural/i, 3],
  [/enhanced/i, 2],
];

export type VoiceLike = { name: string; lang: string; default?: boolean; localService?: boolean };

export function pickPreferredVoice<T extends VoiceLike>(voices: T[]): T | undefined {
  const indian = voices.filter((voice) => /^en[-_]IN$/i.test(voice.lang));
  if (indian.length === 0) return undefined;

  const score = (voice: T) => QUALITY_MARKERS.reduce((best, [pattern, points]) => (pattern.test(voice.name) ? Math.max(best, points) : best), 0);
  return [...indian].sort((a, b) => score(b) - score(a))[0];
}
