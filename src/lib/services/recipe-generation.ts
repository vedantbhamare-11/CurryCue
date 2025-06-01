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
 * Smart ingredient selection based on inventory size
 * @param ingredients Available ingredients
 * @returns Selected ingredients for recipe generation
 */
function selectIngredientsForRecipe(ingredients: Ingredient[]): Ingredient[] {
  const totalIngredients = ingredients.length;
  
  // If more than 10 ingredients, use a subset (3-7 ingredients)
  if (totalIngredients > 10) {
    // Prioritize main ingredients (proteins, grains, vegetables)
    const priorityIngredients = ingredients.filter(ing => 
      isPriorityIngredient(ing.name.toLowerCase())
    );
    
    const otherIngredients = ingredients.filter(ing => 
      !isPriorityIngredient(ing.name.toLowerCase())
    );
    
    // Take 2-3 priority ingredients and 2-4 others
    const selectedPriority = priorityIngredients.slice(0, 3);
    const selectedOthers = otherIngredients.slice(0, 4);
    
    return [...selectedPriority, ...selectedOthers].slice(0, 7);
  }
  
  // If 3-5 ingredients, use all of them
  if (totalIngredients >= 3 && totalIngredients <= 5) {
    return ingredients;
  }
  
  // For other cases, return all ingredients
  return ingredients;
}

/**
 * Check if an ingredient should be prioritized in recipe selection
 * @param ingredientName Name of the ingredient
 * @returns Whether ingredient is high priority
 */
function isPriorityIngredient(ingredientName: string): boolean {
  const priorityKeywords = [
    // Proteins
    'chicken', 'fish', 'meat', 'paneer', 'tofu', 'egg', 'dal', 'lentil',
    // Grains & Starches
    'rice', 'wheat', 'bread', 'pasta', 'potato', 'quinoa',
    // Main Vegetables
    'tomato', 'onion', 'garlic', 'ginger', 'bell pepper', 'cauliflower', 'broccoli'
  ];
  
  return priorityKeywords.some(keyword => ingredientName.includes(keyword));
}

/**
 * Get assumed pantry ingredients based on cuisine type
 * @param cuisineType Type of cuisine
 * @returns Array of assumed basic ingredients
 */
function getAssumedIngredientsForCuisine(cuisineType: string): string[] {
  const cuisine = cuisineType.toLowerCase();
  
  if (cuisine.includes('indian') || cuisine.includes('south indian')) {
    return [
      'Salt',
      'Oil (vegetable/sunflower/ghee)',
      'Turmeric',
      'Red Chili Powder',
      'Cumin Seeds',
      'Mustard Seeds',
      'Garam Masala',
      'Curry Leaves (for South Indian)',
      'Asafoetida (Hing)'
    ];
  }
  
  if (cuisine.includes('italian')) {
    return [
      'Salt',
      'Black Pepper',
      'Olive Oil',
      'Black Pepper',
      'Dried Herbs (Basil/Oregano)'
    ];
  }
  
  if (cuisine.includes('chinese') || cuisine.includes('asian')) {
    return [
      'Salt',
      'Soy Sauce',
      'Vegetable Oil',
      'Garlic',
      'Ginger',
      'White Pepper'
    ];
  }
  
  if (cuisine.includes('mexican')) {
    return [
      'Salt',
      'Vegetable Oil',
      'Cumin',
      'Chili Powder',
      'Black Pepper'
    ];
  }
  
  // General/Default pantry assumptions
  return [
    'Salt',
    'Vegetable Oil',
    'Black Pepper'
  ];
}

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
    
    // Smart ingredient selection logic
    const selectedIngredients = selectIngredientsForRecipe(ingredients);
    
    // Format selected ingredients for the prompt
    const ingredientsList = selectedIngredients.map(ing => {
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
    
    // Determine smart pantry assumptions based on cuisine
    const assumedIngredients = getAssumedIngredientsForCuisine(cuisineType || 'general');
    const assumedIngredientsText = assumedIngredients.length > 0 
      ? `\nAssumed basic pantry ingredients (do not include in ingredient list): ${assumedIngredients.join(', ')}`
      : '';
    
    // Create the authentic recipe generation prompt
    const prompt = `
      STRICT RULES FOR AUTHENTIC RECIPE GENERATION:
      
      1. ONLY suggest authentic, traditional, and well-known recipes from the specified cuisine
      2. DO NOT create fusion or invented recipes
      3. If cuisine is specified, suggest only dishes from that cuisine tradition
      4. Use ONLY the provided ingredients plus assumed pantry basics
      5. Suggest recipes that are commonly known and have established cooking methods
      
      Available ingredients from user's inventory: ${ingredientsList}
      ${assumedIngredientsText}
      ${dietaryInfo}
      ${additionalSpecs}
      
      Generate 3 AUTHENTIC recipes following these guidelines:
      - For Indian cuisine: Suggest dishes like Khichdi, Jeera Rice, Dal Tadka, etc.
      - For Italian cuisine: Suggest dishes like Pasta Aglio e Olio, Risotto, etc.
      - For Chinese cuisine: Suggest dishes like Fried Rice, Simple Stir-fry, etc.
      - Only use ingredients from the provided list plus assumed basics
      
      Format your response as a JSON array with this EXACT structure:
      [
        {
          "id": "1",
          "title": "Authentic Recipe Name",
          "description": "Brief description",
          "matchPercentage": 95,
          "cookTime": 30,
          "difficulty": "easy",
          "image": "",
          "usedIngredients": [
            {"id": "i1", "name": "Rice", "quantity": "1", "unit": "cup"},
            {"id": "i2", "name": "Moong Dal", "quantity": "1/2", "unit": "cup"}
          ],
          "assumedIngredients": [
            {"name": "Salt", "quantity": "to taste"},
            {"name": "Turmeric", "quantity": "1/2", "unit": "tsp"},
            {"name": "Oil", "quantity": "1", "unit": "tbsp"}
          ],
          "steps": [
            "Step 1: Wash and soak rice and dal for 15 minutes",
            "Step 2: Heat oil in a pot, add turmeric",
            "Step 3: Add rice and dal, stir for 2 minutes",
            "Step 4: Add water (2:1 ratio), salt to taste",
            "Step 5: Cook on medium heat for 20 minutes until soft"
          ],
          "cuisine": "${cuisineType || 'Indian'}",
          "tags": ["authentic", "traditional", "healthy"]
        }
      ]
      
      IMPORTANT:
      - Calculate match percentage based on how many user ingredients are used
      - Keep recipes simple and authentic
      - Provide clear, minimal steps
      - Include estimated cooking time
      - Separate user ingredients from assumed pantry ingredients
      - Only suggest recipes you are confident are authentic to the cuisine
      
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
      const aiRecipes = JSON.parse(jsonText) as any[];
      
      if (!Array.isArray(aiRecipes) || aiRecipes.length === 0) {
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
      
      // Transform AI response to match Recipe interface
      const recipes: Recipe[] = aiRecipes.map((aiRecipe, index) => {
        // Combine used ingredients and assumed ingredients
        const allIngredients = [
          ...(aiRecipe.usedIngredients || []),
          ...(aiRecipe.assumedIngredients || []).map((assumed: any) => ({
            ...assumed,
            id: `assumed-${Date.now()}-${Math.random()}`,
            isAssumed: true
          }))
        ];
        
        return {
          id: aiRecipe.id || `recipe-${Date.now()}-${index}`,
          title: aiRecipe.title,
          description: aiRecipe.description,
          matchPercentage: aiRecipe.matchPercentage || 85,
          cookTime: aiRecipe.cookTime || 30,
          difficulty: aiRecipe.difficulty || 'medium',
          image: recipeImages[index % recipeImages.length],
          ingredients: allIngredients,
          steps: aiRecipe.steps || [],
          cuisine: aiRecipe.cuisine || cuisineType || 'General',
          tags: aiRecipe.tags || ['authentic'],
          usedIngredients: aiRecipe.usedIngredients || [],
          assumedIngredients: aiRecipe.assumedIngredients || []
        };
      });
      
      return recipes;
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
