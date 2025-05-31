export type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  image?: string;
};

export type ModelProvider = 
  | "claude-bedrock" 
  | "azure-gpt-4o" 
  | "azure-gpt-4o-o3-mini";


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
};