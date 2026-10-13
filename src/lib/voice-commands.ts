// Pure voice-command parsing (no React, no browser APIs) so it can be tested without a microphone.
//
// Commands are matched as the WHOLE utterance, not as substrings. Substring matching meant
// ordinary kitchen talk triggered actions ("close the oven" exited cooking mode). Exiting
// therefore needs the word "cooking" ("exit cooking").

export type VoiceCommandAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; stepNumber: number }
  | { type: 'READ_STEP' }
  | { type: 'NEXT_INGREDIENT' }
  | { type: 'PREVIOUS_INGREDIENT' }
  | { type: 'LIST_INGREDIENTS' }
  | { type: 'READ_INGREDIENT'; ingredientIndex: number }
  | { type: 'START_TIMER'; minutes: number }
  | { type: 'STOP_TIMER' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'EXIT' };

export type VoiceParseResult =
  | { kind: 'action'; action: VoiceCommandAction }
  // Understood the command but the argument is invalid ("go to step 99"): tell the user why
  | { kind: 'error'; message: string }
  // Not a command (ambient speech): ignore silently
  | { kind: 'ignored' };

export type VoiceContext = { totalSteps: number; totalIngredients: number };

const MAX_TIMER_MINUTES = 180;

const ONES: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20,
};
const TENS: Record<string, number> = { thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

// Chrome usually returns digits already, but "step three" does happen. "twenty five" -> 25.
function wordsToDigits(tokens: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];
    const tensValue = token === 'twenty' ? 20 : TENS[token];
    if (tensValue !== undefined && next !== undefined && ONES[next] !== undefined && ONES[next] < 10) {
      out.push(String(tensValue + ONES[next]));
      i++;
    } else if (ONES[token] !== undefined) {
      out.push(String(ONES[token]));
    } else if (TENS[token] !== undefined) {
      out.push(String(TENS[token]));
    } else {
      out.push(token);
    }
  }
  return out;
}

function normalize(transcript: string): string {
  const cleaned = transcript
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return wordsToDigits(cleaned.split(' '))
    .join(' ')
    // politeness / filler around a command: "okay next step please"
    .replace(/^(?:(?:ok|okay|hey|now|please|can you|could you|will you|would you)\s+)+/, '')
    .replace(/(?:\s+(?:please|now|thanks|thank you))+$/, '')
    .trim();
}

const action = (a: VoiceCommandAction): VoiceParseResult => ({ kind: 'action', action: a });
const IGNORED: VoiceParseResult = { kind: 'ignored' };

export function parseVoiceCommand(transcript: string, context: VoiceContext): VoiceParseResult {
  const text = normalize(transcript);
  if (!text) return IGNORED;

  // Exit must be explicit ("exit cooking"), never a lone "exit"/"close"/"quit"
  if (/^(?:exit|close|quit|leave|stop) (?:the )?cooking(?: mode)?$/.test(text)) {
    return action({ type: 'EXIT' });
  }

  // Timers
  if (/^(?:stop|cancel|end|clear) (?:the )?timer$/.test(text)) {
    return action({ type: 'STOP_TIMER' });
  }
  const timerMatch =
    text.match(/^(?:set|start) (?:a |the )?timer (?:for )?(\d+)(?: minutes?| mins?)?$/) ||
    text.match(/^(?:set|start) (?:a )?(\d+) ?(?:minute|min) timer$/);
  if (timerMatch) {
    const minutes = parseInt(timerMatch[1], 10);
    if (minutes < 1 || minutes > MAX_TIMER_MINUTES) {
      return { kind: 'error', message: `Timers can be 1 to ${MAX_TIMER_MINUTES} minutes.` };
    }
    return action({ type: 'START_TIMER', minutes });
  }

  // Ingredients (checked before steps so "next ingredient" never reads as "next")
  const readIngredient = text.match(/^(?:read|what is|tell me about|show) ingredient (\d+)$/);
  if (readIngredient) {
    const number = parseInt(readIngredient[1], 10);
    if (number < 1 || number > context.totalIngredients) {
      return { kind: 'error', message: `Ingredient ${number} is out of range. There are ${context.totalIngredients} ingredients.` };
    }
    return action({ type: 'READ_INGREDIENT', ingredientIndex: number - 1 });
  }
  if (/^(?:next|following) ingredient$/.test(text)) return action({ type: 'NEXT_INGREDIENT' });
  if (/^(?:previous|last) ingredient$/.test(text)) return action({ type: 'PREVIOUS_INGREDIENT' });
  if (/^(?:list|show|read|what are)(?: me)?(?: all)?(?: the)? ingredients$|^what ingredients$/.test(text)) {
    return action({ type: 'LIST_INGREDIENTS' });
  }

  // Steps
  const goToStep = text.match(/^(?:go to|show|jump to|open) step (\d+)$/);
  if (goToStep) {
    const number = parseInt(goToStep[1], 10);
    if (number < 1 || number > context.totalSteps) {
      return { kind: 'error', message: `Step ${number} is out of range. There are ${context.totalSteps} steps.` };
    }
    return action({ type: 'GO_TO_STEP', stepNumber: number - 1 });
  }
  if (/^(?:next|next step|go forward|forward)$/.test(text)) return action({ type: 'NEXT_STEP' });
  if (/^(?:previous|previous step|go back|back|last step)$/.test(text)) return action({ type: 'PREVIOUS_STEP' });
  if (/^(?:read|read step|read it|repeat|repeat step|say it again|what does it say)$/.test(text)) {
    return action({ type: 'READ_STEP' });
  }

  // Display
  if (/^(?:(?:enter|exit|leave|toggle) )?full ?screen(?: mode)?$/.test(text)) {
    return action({ type: 'TOGGLE_FULLSCREEN' });
  }

  return IGNORED;
}

// The browser's speech recognition reports "network" when it can't reach its speech service.
// That is usually NOT the user's internet: Brave ships without Google's speech service, so
// recognition starts, permission is granted, and then it fails with "network". Say so.
export function speechNetworkErrorMessage(nav?: { brave?: unknown }): string {
  if (nav?.brave) {
    return "Brave doesn't include the speech service that voice commands use. Please use Chrome or Edge for voice commands.";
  }
  return "Voice commands couldn't reach the browser's speech service. Check your connection, VPN or firewall, or try Chrome or Edge.";
}
