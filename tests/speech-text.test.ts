import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toSpeech, pickPreferredVoice } from '@/lib/speech-text';

const cases: [string, string][] = [
  // fractions + units (read literally by a speech engine before)
  ['1/2 tsp Cumin seeds', 'half a teaspoon Cumin seeds'], ['Add 1/4 tsp turmeric', 'Add a quarter teaspoon turmeric'], ['3/4 cup milk', 'three quarters cup milk'],
  ['1/2 cup rice', 'half a cup rice'], ['1/3 cup water', 'a third cup water'], ['1 1/2 cups flour', '1 and a half cups flour'], ['2 1/4 cups water', '2 and a quarter cups water'],
  ['½ cup sugar', 'half a cup sugar'], ['1½ tsp salt', '1 and a half teaspoons salt'], ['Use 1/2 of the onion', 'Use half of the onion'],
  // units
  ['250 g Tomato', '250 grams Tomato'], ['250 gm Tomato', '250 grams Tomato'], ['1 tsp salt', '1 teaspoon salt'], ['2 tbsp oil', '2 tablespoons oil'], ['2 nos onion', '2 pieces onion'],
  ['1 kg rice', '1 kilogram rice'], ['200 ml milk', '200 millilitres milk'], ['1.5 tbsp ghee', '1.5 tablespoons ghee'], ['2 tbsp. oil', '2 tablespoons oil'],
  // ranges, including the non-breaking hyphen models really emit
  ['simmer for 15‑20 minutes', 'simmer for 15 to 20 minutes'], ['cook 5-6 min', 'cook 5 to 6 minutes'], ['4–5 minutes', '4 to 5 minutes'],
  // time
  ['wait 10 mins', 'wait 10 minutes'], ['rest 1 hr', 'rest 1 hour'], ['rest 2 hrs', 'rest 2 hours'], ['30 sec', '30 seconds'],
  // temperature, ratio
  ['Preheat to 180°C', 'Preheat to 180 degrees Celsius'], ['350 °F', '350 degrees Fahrenheit'], ['add water (2:1 ratio)', 'add water (2 to 1 ratio)'],
  // symbols, abbreviations, formatting
  ['salt & pepper', 'salt and pepper'], ['approx. 10 minutes', 'approximately 10 minutes'], ['spices, e.g. cumin', 'spices, for example cumin'],
  ['Heat oil — then add cumin', 'Heat oil, then add cumin'], ['**Stir** well', 'Stir well'], ['## Tips', 'Tips'],
  // sentence-ending periods are the pause between spoken items: keep them
  ['Cumin seeds, 1/2 tsp. Ingredient 3: Tomato', 'Cumin seeds, half a teaspoon. Ingredient 3: Tomato'], ['Tomato, 250 gm. Onion, 2 nos.', 'Tomato, 250 grams. Onion, 2 pieces.'],
  ['Soak for 10 mins.', 'Soak for 10 minutes.'], ['Add 1 1/2 tbsp. Then stir', 'Add 1 and a half tablespoons. Then stir'], ['Add 1/2 cup. Next', 'Add half a cup. Next'],
  ['Add 2 tbsp. oil and 1 tsp. salt', 'Add 2 tablespoons oil and 1 teaspoon salt'], ['Heat 1/2 tsp. cumin', 'Heat half a teaspoon cumin'],
  // must NOT change
  ['Add salt to taste', 'Add salt to taste'], ['Heat oil in a pan over medium heat.', 'Heat oil in a pan over medium heat.'], ['Cook 2 cups of rice', 'Cook 2 cups of rice'],
  ['Serves 4', 'Serves 4'], ['Cook for 12 minutes', 'Cook for 12 minutes'], ['no more than 3 pieces', 'no more than 3 pieces'], ['Step 1: no salt', 'Step 1: no salt'], ['', ''],
  // realistic whole sentences from the app
  ['Ingredient 7: Cumin seeds, 1/2 tsp', 'Ingredient 7: Cumin seeds, half a teaspoon'], ['Ingredient 11: Paneer, 200 g', 'Ingredient 11: Paneer, 200 grams'],
  ['Add rice and 2 cups water, bring to boil then simmer covered for 15‑20 minutes until rice is tender', 'Add rice and 2 cups water, bring to boil then simmer covered for 15 to 20 minutes until rice is tender'],
];

for (const [input, expected] of cases) {
  test(`toSpeech(${JSON.stringify(input)})`, () => assert.equal(toSpeech(input), expected));
}

test('a bare fraction is read as a word', () => assert.equal(toSpeech('1/2'), 'half'));

test('pickPreferredVoice prefers the best English (India) voice and ignores everything else', () => {
  const v = (name: string, lang: string) => ({ name, lang });
  assert.equal(pickPreferredVoice([v('Samantha', 'en-US'), v('Daniel', 'en-GB')]), undefined);
  assert.equal(pickPreferredVoice([v('Samantha', 'en-US'), v('Rishi', 'en-IN')])?.name, 'Rishi');
  assert.equal(pickPreferredVoice([v('Rishi', 'en-IN'), v('Rishi (Premium)', 'en-IN')])?.name, 'Rishi (Premium)');
  assert.equal(pickPreferredVoice([v('Rishi', 'en-IN'), v('Veena (Enhanced)', 'en-IN')])?.name, 'Veena (Enhanced)');
  assert.equal(pickPreferredVoice([v('A (Enhanced)', 'en-IN'), v('B (Premium)', 'en-IN')])?.name, 'B (Premium)');
  assert.equal(pickPreferredVoice([v('x', 'en_IN')])?.name, 'x', 'Android-style language tag');
  assert.equal(pickPreferredVoice([v('Lekha', 'hi-IN')]), undefined, 'Hindi voices read English badly');
  assert.equal(pickPreferredVoice([]), undefined);
});
