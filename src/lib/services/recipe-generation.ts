import { generateText, TextGenerationResult } from '@/lib/api/util';
import { Ingredient, Recipe, UserPreferences } from '@/types';
import { ModelProvider } from '@/types';
import { RateLimiter } from '@/lib/services/rate-limiter';

export interface RecipeGenerationOptions {
  ingredients: Ingredient[];
  preferences?: UserPreferences;
  cuisineType?: string;
  mealType?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxCookingTime?: number;
  servings?: number;
}

// Rate limiter for API calls - 10 requests per minute
const recipeGenerationLimiter = new RateLimiter({
  maxRequests: 10,
  timeWindow: 60 * 1000, // 1 minute in milliseconds
});

/**
 * Generate recipes based on ingredients and preferences using AI
 * @param options Recipe generation options including ingredients and preferences
 * @param provider AI model provider to use (default: azure-gpt-4o)
 * @returns Promise with array of generated recipes
 */
export async function generateRecipes(
  options: RecipeGenerationOptions,
  provider: ModelProvider = "azure-gpt-4o"
): Promise<Recipe[]> {
  try {
    // Check rate limit before proceeding
    if (!recipeGenerationLimiter.allowRequest()) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    const { ingredients, preferences, cuisineType, mealType, difficulty, maxCookingTime, servings } = options;
    
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided for recipe generation");
    }
    
    // Format ingredients for the prompt
    const ingredientsList = ingredients.map(ing => {
      if (ing.quantity && ing.unit) {
        return `${ing.name} (${ing.quantity} ${ing.unit})`;
      }
      return ing.name;
    }).join(", ");
    
    // Build dietary restrictions and preferences
    let dietaryInfo = '';
    if (preferences) {
      if (preferences.dietaryRestrictions && preferences.dietaryRestrictions.length > 0) {
        dietaryInfo += `\nDietary restrictions: ${preferences.dietaryRestrictions.join(', ')}`;
      }
      if (preferences.allergies && preferences.allergies.length > 0) {
        dietaryInfo += `\nAllergies: ${preferences.allergies.join(', ')}`;
      }
      if (preferences.cuisinePreferences && preferences.cuisinePreferences.length > 0) {
        dietaryInfo += `\nPreferred cuisines: ${preferences.cuisinePreferences.join(', ')}`;
      }
      dietaryInfo += `\nCooking skill level: ${preferences.skillLevel || 'intermediate'}`;
    }
    
    // Additional specifications
    let additionalSpecs = '';
    if (cuisineType) additionalSpecs += `\nCuisine type: ${cuisineType}`;
    if (mealType) additionalSpecs += `\nMeal type: ${mealType}`;
    if (difficulty) additionalSpecs += `\nDifficulty level: ${difficulty}`;
    if (maxCookingTime) additionalSpecs += `\nMaximum cooking time: ${maxCookingTime} minutes`;
    if (servings) additionalSpecs += `\nServings: ${servings}`;
    
    // Create the prompt for the AI
    const prompt = `
      Generate 3 unique and creative recipes using some or all of these ingredients: ${ingredientsList}.
      ${dietaryInfo}
      ${additionalSpecs}
      
      For each recipe, provide:
      1. A creative name
      2. A brief description
      3. Cooking time in minutes
      4. Difficulty level (easy, medium, or hard)
      5. List of ingredients with quantities
      6. Step-by-step cooking instructions
      7. Cuisine type
      8. Tags (e.g., "quick", "vegetarian", "comfort food")
      
      Format your response as a JSON array with the following structure:
      [
        {
          "id": "1",
          "title": "Recipe Name",
          "description": "Brief description",
          "matchPercentage": 95,
          "cookTime": 30,
          "difficulty": "easy",
          "image": "",
          "ingredients": [
            {"id": "i1", "name": "Ingredient 1", "quantity": "1", "unit": "cup"},
            {"id": "i2", "name": "Ingredient 2", "quantity": "2", "unit": "tablespoons"}
          ],
          "steps": [
            "Step 1: Do this",
            "Step 2: Do that"
          ],
          "cuisine": "Italian",
          "tags": ["quick", "pasta", "vegetarian"]
        }
      ]
      
      Calculate the match percentage based on how many of the user's ingredients are used in the recipe.
      Leave the image field empty.
      Return ONLY the JSON array, nothing else.
    `;
    
    // Call the AI service with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), 30000); // 30 second timeout
    });
    
    const resultPromise = generateText(prompt, provider);
    const result = await Promise.race([resultPromise, timeoutPromise]) as TextGenerationResult;
    
    // Parse the response to extract the JSON
    let jsonText = result.text.trim();
    
    // Handle potential text before or after the JSON
    const startBracket = jsonText.indexOf('[');
    const endBracket = jsonText.lastIndexOf(']');
    
    if (startBracket !== -1 && endBracket !== -1) {
      jsonText = jsonText.substring(startBracket, endBracket + 1);
    } else {
      throw new Error("Invalid response format from AI service");
    }
    
    try {
      const recipes = JSON.parse(jsonText) as Recipe[];
      
      if (!Array.isArray(recipes) || recipes.length === 0) {
        throw new Error("No valid recipes returned from AI service");
      }
      
      // Add placeholder images to recipes
      const recipeImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd'
      ];
      
      return recipes.map((recipe, index) => ({
        ...recipe,
        image: recipeImages[index % recipeImages.length]
      }));
    } catch (parseError) {
      console.error("Failed to parse recipe JSON:", parseError);
      throw new Error("Failed to parse AI response into valid recipe format");
    }
  } catch (error) {
    console.error("Error generating recipes:", error);
    if (error instanceof Error) {
      throw error; // Re-throw the error with its original message
    } else {
      throw new Error("Unknown error occurred during recipe generation");
    }
  }
}

/**
 * Generate detailed recipe based on title and ingredients
 * @param recipeTitle Title of the recipe to generate
 * @param ingredients List of ingredients available
 * @param provider AI model provider to use (default: azure-gpt-4o)
 * @returns Promise with generated recipe details or null if generation fails
 */
export async function generateRecipeDetails(
  recipeTitle: string,
  ingredients: Ingredient[],
  provider: ModelProvider = "azure-gpt-4o"
): Promise<Recipe | null> {
  try {
    // Check rate limit before proceeding
    if (!recipeGenerationLimiter.allowRequest()) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    if (!recipeTitle || recipeTitle.trim() === "") {
      throw new Error("Recipe title is required");
    }
    
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided for recipe generation");
    }
    
    // Format ingredients for the prompt
    const ingredientsList = ingredients.map(ing => {
      if (ing.quantity && ing.unit) {
        return `${ing.name} (${ing.quantity} ${ing.unit})`;
      }
      return ing.name;
    }).join(", ");
    
    // Create the prompt for the AI
    const prompt = `
      Create a detailed recipe for "${recipeTitle}" using some or all of these ingredients: ${ingredientsList}.
      
      Provide:
      1. A brief description
      2. Cooking time in minutes
      3. Difficulty level (easy, medium, or hard)
      4. List of ingredients with quantities
      5. Step-by-step cooking instructions
      6. Cuisine type
      7. Tags (e.g., "quick", "vegetarian", "comfort food")
      
      Format your response as a JSON object with the following structure:
      {
        "id": "1",
        "title": "${recipeTitle}",
        "description": "Brief description",
        "matchPercentage": 95,
        "cookTime": 30,
        "difficulty": "easy",
        "image": "",
        "ingredients": [
          {"id": "i1", "name": "Ingredient 1", "quantity": "1", "unit": "cup"},
          {"id": "i2", "name": "Ingredient 2", "quantity": "2", "unit": "tablespoons"}
        ],
        "steps": [
          "Step 1: Do this",
          "Step 2: Do that"
        ],
        "cuisine": "Italian",
        "tags": ["quick", "pasta", "vegetarian"]
      }
      
      Calculate the match percentage based on how many of the user's ingredients are used in the recipe.
      Leave the image field empty.
      Return ONLY the JSON object, nothing else.
    `;
    
    // Call the AI service with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), 30000); // 30 second timeout
    });
    
    const resultPromise = generateText(prompt, provider);
    const result = await Promise.race([resultPromise, timeoutPromise]) as TextGenerationResult;
    
    // Parse the response to extract the JSON
    let jsonText = result.text.trim();
    
    // Handle potential text before or after the JSON
    const startBracket = jsonText.indexOf('{');
    const endBracket = jsonText.lastIndexOf('}');
    
    if (startBracket !== -1 && endBracket !== -1) {
      jsonText = jsonText.substring(startBracket, endBracket + 1);
    } else {
      throw new Error("Invalid response format from AI service");
    }
    
    try {
      const recipe = JSON.parse(jsonText) as Recipe;
      
      if (!recipe || !recipe.title || !recipe.steps || recipe.steps.length === 0) {
        throw new Error("Invalid recipe data returned from AI service");
      }
      
      // Add placeholder image - randomly select from a collection of food images
      const recipeImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd'
      ];
      
      return {
        ...recipe,
        image: recipeImages[Math.floor(Math.random() * recipeImages.length)]
      };
    } catch (parseError) {
      console.error("Failed to parse recipe JSON:", parseError);
      throw new Error("Failed to parse AI response into valid recipe format");
    }
  } catch (error) {
    console.error("Error generating recipe details:", error);
    if (error instanceof Error) {
      throw error; // Re-throw the error with its original message
    } else {
      throw new Error("Unknown error occurred during recipe generation");
    }
  }
}
