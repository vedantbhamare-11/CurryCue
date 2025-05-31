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
