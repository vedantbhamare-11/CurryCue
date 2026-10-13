import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseVoiceCommand, speechNetworkErrorMessage, type VoiceParseResult } from '@/lib/voice-commands';

const ctx = { totalSteps: 6, totalIngredients: 8 };
const A = (type: string, extra: object = {}): VoiceParseResult => ({ kind: 'action', action: { type, ...extra } as never });
const E = (message: string): VoiceParseResult => ({ kind: 'error', message });
const IGNORED: VoiceParseResult = { kind: 'ignored' };

const groups: Record<string, [string, VoiceParseResult][]> = {
  'documented commands': [
    ['next step', A('NEXT_STEP')], ['go forward', A('NEXT_STEP')], ['next', A('NEXT_STEP')],
    ['previous step', A('PREVIOUS_STEP')], ['go back', A('PREVIOUS_STEP')], ['previous', A('PREVIOUS_STEP')], ['back', A('PREVIOUS_STEP')],
    ['go to step 3', A('GO_TO_STEP', { stepNumber: 2 })], ['jump to step 6', A('GO_TO_STEP', { stepNumber: 5 })], ['show step 1', A('GO_TO_STEP', { stepNumber: 0 })],
    ['read step', A('READ_STEP')], ['repeat step', A('READ_STEP')], ['what does it say', A('READ_STEP')], ['read', A('READ_STEP')],
    ['next ingredient', A('NEXT_INGREDIENT')], ['following ingredient', A('NEXT_INGREDIENT')], ['previous ingredient', A('PREVIOUS_INGREDIENT')], ['last ingredient', A('PREVIOUS_INGREDIENT')],
    ['list ingredients', A('LIST_INGREDIENTS')], ['show ingredients', A('LIST_INGREDIENTS')], ['what ingredients', A('LIST_INGREDIENTS')], ['what are the ingredients', A('LIST_INGREDIENTS')],
    ['read ingredient 2', A('READ_INGREDIENT', { ingredientIndex: 1 })], ['tell me about ingredient 8', A('READ_INGREDIENT', { ingredientIndex: 7 })],
    ['start timer 5 minutes', A('START_TIMER', { minutes: 5 })], ['set timer for 10 minutes', A('START_TIMER', { minutes: 10 })], ['set a timer for 3 minutes', A('START_TIMER', { minutes: 3 })], ['set a 15 minute timer', A('START_TIMER', { minutes: 15 })],
    ['stop timer', A('STOP_TIMER')], ['cancel timer', A('STOP_TIMER')], ['end timer', A('STOP_TIMER')],
    ['fullscreen', A('TOGGLE_FULLSCREEN')], ['full screen', A('TOGGLE_FULLSCREEN')], ['exit full screen', A('TOGGLE_FULLSCREEN')],
    ['exit cooking', A('EXIT')], ['close cooking mode', A('EXIT')], ['quit cooking', A('EXIT')],
  ],
  'polite and noisy variants': [
    ['Okay, next step please', A('NEXT_STEP')], ['Hey next step.', A('NEXT_STEP')], ['could you go back please', A('PREVIOUS_STEP')], ['  NEXT   STEP  ', A('NEXT_STEP')], ['Go to step three', A('GO_TO_STEP', { stepNumber: 2 })],
    ['set timer for twenty five minutes', A('START_TIMER', { minutes: 25 })], ['set a timer for ten minutes', A('START_TIMER', { minutes: 10 })], ['read ingredient two', A('READ_INGREDIENT', { ingredientIndex: 1 })],
  ],
  'how speech recognition really transcribes these': [
    ['next ingredients', A('NEXT_INGREDIENT')], ['previous ingredients', A('PREVIOUS_INGREDIENT')], ['read ingredient to', A('READ_INGREDIENT', { ingredientIndex: 1 })], ['read ingredient too', A('READ_INGREDIENT', { ingredientIndex: 1 })],
    ['read ingredients 3', A('READ_INGREDIENT', { ingredientIndex: 2 })], ['tell me about ingredient for', A('READ_INGREDIENT', { ingredientIndex: 3 })], ['go to step to', A('GO_TO_STEP', { stepNumber: 1 })], ['go to step for', A('GO_TO_STEP', { stepNumber: 3 })],
    ['ingredient list', A('LIST_INGREDIENTS')], ['show me the ingredients', A('LIST_INGREDIENTS')], ['list ingredient', A('LIST_INGREDIENTS')],
    ['timer 5 minutes', A('START_TIMER', { minutes: 5 })], ['timer for ten minutes', A('START_TIMER', { minutes: 10 })], ['start a 5 minutes timer', A('START_TIMER', { minutes: 5 })], ['set the timer for 7 mins', A('START_TIMER', { minutes: 7 })], ['start timer 5 min', A('START_TIMER', { minutes: 5 })],
  ],
  'ordinary kitchen talk must NOT trigger anything': [
    ['close the oven', IGNORED], ['can you close the door', IGNORED], ['exit the kitchen', IGNORED], ['quit it', IGNORED], ['i need to go back to the store', IGNORED], ['the next step is hard', IGNORED],
    ['pass me the next ingredient list', IGNORED], ['read the label on that jar', IGNORED], ['what time is it', IGNORED], ['stop', IGNORED], ['exit', IGNORED], ['close', IGNORED], ['quit', IGNORED], ['', IGNORED], ['   ', IGNORED],
    ['full screen tv is on', IGNORED], ['my timer is broken', IGNORED], ['fifteen minutes later', IGNORED], ['start timer', IGNORED],
    ['i want to read ingredient labels', IGNORED], ['go to the store', IGNORED], ['for step by step help', IGNORED], ['to step', IGNORED],
  ],
  'out of range or invalid': [
    ['go to step 7', E('Step 7 is out of range. There are 6 steps.')], ['go to step 0', E('Step 0 is out of range. There are 6 steps.')],
    ['read ingredient 9', E('Ingredient 9 is out of range. There are 8 ingredients.')], ['set timer for 500 minutes', E('Timers can be 1 to 180 minutes.')], ['set timer for 0 minutes', E('Timers can be 1 to 180 minutes.')],
  ],
};

for (const [group, cases] of Object.entries(groups)) {
  test(group, () => {
    for (const [phrase, expected] of cases) assert.deepEqual(parseVoiceCommand(phrase, ctx), expected, JSON.stringify(phrase));
  });
}

test('the speech-service error names Brave instead of blaming the connection', () => {
  assert.match(speechNetworkErrorMessage({ brave: {} }), /Brave/);
  assert.match(speechNetworkErrorMessage({}), /Chrome or Edge/);
  assert.doesNotMatch(speechNetworkErrorMessage({}), /Brave/);
  assert.match(speechNetworkErrorMessage(undefined), /speech service/);
});
