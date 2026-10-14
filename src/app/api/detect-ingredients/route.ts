// src/app/api/detect-ingredients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { detectIngredientsFromImage } from '@/lib/services/ingredient-detection';
import { rateLimit } from '@/lib/server/rate-limit';
import { validateScanImage } from '@/lib/scan-image';

const MAX_IMAGE_CHARS = 4_000_000; // base64 string length, roughly 3MB of image

// Provider calls (esp. Gemini fallback) can take 20s+; Vercel's default function limit is much lower
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // Scans are token-heavy (one image is ~1-2k input tokens), so they get a tighter limit
  const limited = rateLimit(request, 'scan', { envName: 'AI_SCAN_RATE_LIMIT_PER_MIN', fallback: 6 });
  if (limited) return limited;

  try {
    const data = await request.json().catch(() => null);

    if (typeof data?.image === 'string' && data.image.length > MAX_IMAGE_CHARS) {
      return NextResponse.json({ error: 'That image is too large' }, { status: 413 });
    }
    // Anything that is not a real base64 image is rejected here, before it costs provider calls
    const image = validateScanImage(data?.image);
    if (!image.ok) {
      return NextResponse.json({ error: image.error }, { status: 400 });
    }

    const detectedIngredients = await detectIngredientsFromImage(image.dataUrl);

    return NextResponse.json({
      ingredients: detectedIngredients,
      success: true
    });
  } catch (error) {
    // The real error (provider names, models, upstream messages) stays in the server log, not the response
    console.error('Error detecting ingredients:', error);
    return NextResponse.json(
      { error: 'We could not analyse that image right now. Please try again.' },
      { status: 502 }
    );
  }
}
