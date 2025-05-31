import { NextRequest, NextResponse } from 'next/server';
import { detectIngredientsFromImage } from '@/lib/services/ingredient-detection';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Process the image through ML detection
    const detectedIngredients = await detectIngredientsFromImage(data.image, data.provider || "azure-gpt-4o");
    
    return NextResponse.json({ 
      ingredients: detectedIngredients,
      success: true 
    });
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
