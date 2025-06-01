export type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  image?: string;
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
};

export type UserAccount = {
  id: string;
  email: string;
  phone: string;
  name?: string;
  profilePhoto?: string;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  preferences: UserPreferences;
  account: UserAccount;
};

export type OnboardingData = {
  step: number;
  account: {
    email: string;
    phone: string;
    password: string;
  };
  dietaryPreferences: string[];
  cuisinePreferences: string[];
  allergies: string[];
  otherAllergies: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
};

export type CookingSession = {
  id: string;
  recipeId: string;
  currentStep: number;
  messages: ChatMessage[];
  started: number;
  completed?: number;
};

export type ModelProvider = 
  | "claude-bedrock" 
  | "azure-gpt-4o" 
  | "azure-gpt-4o-o3-mini";

// API related types
export interface ApiError {
  message: string;
  statusCode: number;
  errorCode?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

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
