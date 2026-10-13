// src/app/api/detect-ingredients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { detectIngredientsFromImage } from '@/lib/services/ingredient-detection';
import { rateLimit } from '@/lib/server/rate-limit';

const MAX_IMAGE_CHARS = 4_000_000; // base64 string length, roughly 3MB of image

// Provider calls (esp. Gemini fallback) can take 20s+; Vercel's default function limit is much lower
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // Scans are token-heavy (one image is ~1-2k input tokens), so they get a tighter limit
  const limited = rateLimit(request, 'scan', { envName: 'AI_SCAN_RATE_LIMIT_PER_MIN', fallback: 6 });
  if (limited) return limited;

  try {
    const data = await request.json();

    if (!data.image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    if (typeof data.image !== 'string' || data.image.length > MAX_IMAGE_CHARS) {
      return NextResponse.json({ error: 'Invalid or too large image' }, { status: 413 });
    }

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
