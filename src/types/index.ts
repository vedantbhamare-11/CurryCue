export type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  image?: string;
  // Local calendar date ("YYYY-MM-DD") after which it should be used up; see lib/expiry.ts
  expiresOn?: string;
};

export type UserPreferences = {
  dietaryRestrictions: string[];
  allergies: string[];
  cuisinePreferences: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  mealTypes?: string[];
  cookingTime?: {
    min: number;
    max: number;
  };
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  cuisine: string;
  tags: string[];
  missingIngredients?: Ingredient[];
  usedIngredients?: Ingredient[];
  assumedIngredients?: Ingredient[];
  // Names of soon-to-expire pantry items this recipe uses up
  usesExpiring?: string[];
};

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}
