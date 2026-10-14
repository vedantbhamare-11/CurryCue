import { generateText, TextGenerationResult } from '@/lib/api/util';
import { Ingredient, Recipe, UserPreferences } from '@/types';
import { RateLimiter } from '@/lib/services/rate-limiter';
import { stripStepLabel } from '@/lib/utils';
import { namesMatch, nameWords, staplesMatch } from '@/lib/ingredient-names';
import { asList, asText, keepRecipesUsingPantry, normalizeCookTime, normalizeDifficulty, normalizeTags } from '@/lib/recipe-fields';

export interface RecipeGenerationOptions {
  ingredients: Ingredient[];
  preferences?: UserPreferences;
  cuisineType?: string;
  mealType?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxCookingTime?: number;
  servings?: number;
  // Pantry items that are expired or about to expire. They are always kept in the ingredient selection
  // and the model is asked to use them up
  useSoon?: Ingredient[];
  // true = build every recipe around the soon-to-expire items ("Cook with these"); false = a soft preference
  strictUseSoon?: boolean;
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
 * Staples we never ask the user to own. Matched by whole-word phrase, so "Oil" covers
 * "Olive Oil" and "Cumin" covers "Cumin Seeds", but "Black Pepper" does not cover "Bell Pepper".
 */
// The shape of a recipe in the model's JSON reply; every field is optional because the model can omit any
type AIRecipe = {
  title?: unknown;
  description?: unknown;
  cookTime?: unknown;
  difficulty?: unknown;
  cuisine?: unknown;
  tags?: unknown;
  steps?: unknown;
  usedIngredients?: unknown;
  assumedIngredients?: unknown;
  missingIngredients?: unknown;
};

const PANTRY_STAPLES = [
  'Water', 'Salt', 'Oil', 'Ghee', 'Sugar', 'Black Pepper', 'White Pepper', 'Turmeric',
  'Red Chili Powder', 'Chili Powder', 'Cumin', 'Mustard Seeds', 'Garam Masala',
  'Curry Leaves', 'Asafoetida', 'Hing', 'Soy Sauce', 'Dried Herbs', 'Oregano'
];

/**
 * The LLM decides which ingredients are "used" vs "assumed", and routinely invents things the
 * user doesn't have. Re-classify every ingredient it returned against the real pantry:
 * pantry match -> used, known staple -> assumed, anything else -> missing.
 */
export function classifyIngredients(llmIngredients: unknown[], pantry: Ingredient[]) {
  const used: Ingredient[] = [];
  const assumed: Ingredient[] = [];
  const missing: Ingredient[] = [];
  const seen = new Set<string>();

  for (const raw of llmIngredients) {
    if (!raw || typeof (raw as { name?: unknown }).name !== 'string') continue;
    const item = raw as Ingredient;
    const key = nameWords(item.name).join(' ');
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const pantryItem = pantry.find(p => namesMatch(p.name, item.name));
    if (pantryItem) {
      used.push({ ...item, id: pantryItem.id, name: pantryItem.name });
    } else if (PANTRY_STAPLES.some(staple => staplesMatch(staple, item.name))) {
      assumed.push(item);
    } else {
      missing.push(item);
    }
  }

  return { used, assumed, missing };
}

/**
 * Generate recipes based on ingredients and preferences using AI
 * @param options Recipe generation options including ingredients and preferences
 * @returns Promise with array of generated recipes
 */
export async function generateRecipes(
  options: RecipeGenerationOptions
): Promise<Recipe[]> {
  try {
    // Check rate limit before proceeding
    if (!recipeGenerationLimiter.allowRequest()) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    const { ingredients, preferences, cuisineType, mealType, difficulty, maxCookingTime, servings, useSoon = [], strictUseSoon = false } = options;
    
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided for recipe generation");
    }
    
    // Smart ingredient selection logic
    // Copy: for small pantries selectIngredientsForRecipe returns the caller's own (store) array
    const selectedIngredients = [...selectIngredientsForRecipe(ingredients)];
    for (const item of useSoon) {
      if (!selectedIngredients.some(selected => selected.id === item.id)) selectedIngredients.unshift(item);
    }
    
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
    
    // Soon-to-expire items: a soft preference normally, a hard requirement for "Cook with these"
    const useSoonText = useSoon.length === 0
      ? ''
      : strictUseSoon
        ? `\nIMPORTANT: these ingredients expire soon. Build every recipe around them and use as many of them as possible: ${useSoon.map(item => item.name).join(', ')}`
        : `\nThese ingredients expire soon, so prefer recipes that use them up: ${useSoon.map(item => item.name).join(', ')}`;

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
      4. Use ONLY the provided ingredients plus assumed pantry basics. Never list an ingredient under
         usedIngredients unless it appears in the available ingredients list above; anything else the
         dish needs goes under missingIngredients
      5. Suggest recipes that are commonly known and have established cooking methods
      
      Available ingredients from user's inventory: ${ingredientsList}${useSoonText}
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
          "missingIngredients": [],
          "steps": [
            "Wash and soak rice and dal for 15 minutes",
            "Heat oil in a pot, add turmeric",
            "Add rice and dal, stir for 2 minutes",
            "Add water (2:1 ratio), salt to taste",
            "Cook on medium heat for 20 minutes until soft"
          ],
          "cuisine": "${cuisineType || 'Indian'}",
          "tags": ["authentic", "traditional", "healthy"]
        }
      ]
      
      IMPORTANT:
      - Calculate match percentage based on how many user ingredients are used
      - Keep recipes simple and authentic
      - Provide clear, minimal steps; write each step as plain text without a "Step N:" or numbered prefix (the app numbers them)
      - Include estimated cooking time
      - Separate user ingredients from assumed pantry ingredients
      - Only suggest recipes you are confident are authentic to the cuisine
      
      Return ONLY the JSON array, nothing else.
    `;
    
    // Call the AI service with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), 100000); // 100 second timeout (Gemini thinking models take 20-40s, plus one model fallback)
    });
    
    const resultPromise = generateText(prompt);
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
      const parsed: unknown = JSON.parse(jsonText);

      // A recipe without a title or any steps cannot be shown or cooked, so it is dropped rather than displayed broken
      const aiRecipes = (Array.isArray(parsed) ? parsed : []).filter((entry): entry is AIRecipe =>
        typeof entry === 'object' && entry !== null &&
        asText((entry as AIRecipe).title) !== '' && asList((entry as AIRecipe).steps).some((step) => asText(step) !== '')
      );

      if (aiRecipes.length === 0) {
        throw new Error("No valid recipes returned from AI service");
      }
      
      // Transform AI response to match Recipe interface
      const recipes: Recipe[] = aiRecipes.map((aiRecipe, index) => {
        const { used, assumed, missing } = classifyIngredients(
          [
            ...asList(aiRecipe.usedIngredients),
            ...asList(aiRecipe.assumedIngredients),
            ...asList(aiRecipe.missingIngredients)
          ],
          ingredients
        );

        // Match % = share of the dish's non-staple ingredients the user actually has
        const needed = used.length + missing.length;
        const matchPercentage = needed === 0 ? 0 : Math.round((used.length / needed) * 100);

        const allIngredients = [
          ...used,
          ...assumed.map((item, i) => ({
            ...item,
            id: `assumed-${Date.now()}-${index}-${i}`,
            isAssumed: true
          })),
          ...missing.map((item, i) => ({ ...item, id: item.id || `missing-${Date.now()}-${index}-${i}` }))
        ];

        return {
          // Always generate our own id: the LLM echoes the prompt's example ("1", "2", ...),
          // which collides across generations and breaks favorites/recents/cooking lookups.
          id: `recipe-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
          title: asText(aiRecipe.title),
          description: asText(aiRecipe.description),
          matchPercentage,
          cookTime: normalizeCookTime(aiRecipe.cookTime),
          // The model says "intermediate", "beginner", ...: map to the three values the UI knows
          difficulty: normalizeDifficulty(aiRecipe.difficulty) ?? 'medium',
          // No photo: the AI only writes text, and unrelated stock photos misled more than they helped
          image: '',
          ingredients: allIngredients,
          steps: asList(aiRecipe.steps).map(stripStepLabel).filter(Boolean),
          cuisine: asText(aiRecipe.cuisine, cuisineType || 'General'),
          tags: normalizeTags(aiRecipe.tags, ['authentic']),
          usedIngredients: used,
          assumedIngredients: assumed,
          missingIngredients: missing,
          // used[] carries the pantry item's id (see classifyIngredients), so this is an exact match
          usesExpiring: useSoon.filter(item => used.some(u => u.id === item.id)).map(item => item.name)
        };
      });

      const shown = keepRecipesUsingPantry(recipes, ingredients.length);

      // Recipes that use up more of what is about to expire come first (stable for equal counts)
      if (useSoon.length > 0) {
        shown.sort((a, b) => (b.usesExpiring?.length ?? 0) - (a.usesExpiring?.length ?? 0));
      }
      
      return shown;
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
