import { generateTextWithImages } from '@/lib/api/util';
import { ModelProvider } from '@/types';

export interface DetectedIngredient {
  name: string;
  quantity?: string;
  unit?: string;
  confidence?: number;
}

/**
 * Detects ingredients from an image using ML vision models
 * @param imageBase64 Base64 encoded image data
 * @param provider AI model provider to use
 * @returns Promise with array of detected ingredients
 */
export async function detectIngredientsFromImage(
  imageBase64: string,
  provider: ModelProvider = "azure-gpt-4o"
): Promise<DetectedIngredient[]> {
  try {
    // Ensure image is properly formatted for the API
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;
    
    // Create a detailed prompt for the ML model to analyze the image
    const prompt = `
      Analyze this food image and identify all ingredients visible.
      For each ingredient, provide:
      1. The name of the ingredient (be specific)
      2. Estimated quantity if visible (e.g., "2", "handful", "1 cup")
      3. Unit of measurement if applicable (e.g., "pieces", "cups", "grams")
      4. Confidence level (0-100) of your identification
      
      Format your response as a JSON array with objects containing "name", "quantity", "unit", and "confidence" properties.
      Example:
      [
        {"name": "tomato", "quantity": "2", "unit": "medium", "confidence": 95},
        {"name": "onion", "quantity": "1", "unit": "large", "confidence": 90},
        {"name": "olive oil", "quantity": "2", "unit": "tablespoons", "confidence": 75}
      ]
      
      Only include ingredients you can clearly identify with at least 60% confidence.
      If you can't determine quantity or unit, omit those fields but still include confidence.
      Return ONLY the JSON array, nothing else.
    `;
    
    // Process the image through the vision-enabled AI model
    const result = await generateTextWithImages(prompt, [base64Data], provider);
    
    // Parse the response to extract the JSON
    let jsonText = result.text.trim();
    
    // Handle potential text before or after the JSON
    const startBracket = jsonText.indexOf('[');
    const endBracket = jsonText.lastIndexOf(']');
    
    if (startBracket !== -1 && endBracket !== -1) {
      jsonText = jsonText.substring(startBracket, endBracket + 1);
    }
    
    try {
      const ingredients = JSON.parse(jsonText) as DetectedIngredient[];
      
      // Sort ingredients by confidence level (if available)
      return ingredients.sort((a, b) => {
        const confA = a.confidence || 0;
        const confB = b.confidence || 0;
        return confB - confA;
      });
    } catch (parseError) {
      console.error("Failed to parse ingredient JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error detecting ingredients:", error);
    throw new Error(`Ingredient detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Processes an image to detect multiple food items and their quantities
 * @param imageBase64 Base64 encoded image data
 * @returns Promise with processed ingredients
 */
export async function processIngredientImage(
  imageBase64: string,
  provider: ModelProvider = "azure-gpt-4o"
): Promise<{
  ingredients: DetectedIngredient[];
  processingTime: number;
}> {
  const startTime = Date.now();
  
  try {
    // Detect ingredients using ML
    const ingredients = await detectIngredientsFromImage(imageBase64, provider);
    
    const processingTime = Date.now() - startTime;
    
    return {
      ingredients,
      processingTime
    };
  } catch (error) {
    console.error("Error processing ingredient image:", error);
    throw error;
  }
}
