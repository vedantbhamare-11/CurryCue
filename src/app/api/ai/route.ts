import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/server/ai';
import { AIProviderError } from '@/lib/server/ai-error';

const MAX_PROMPT_CHARS = 20_000;
const MAX_IMAGES = 4;
const MAX_IMAGE_CHARS = 4_000_000; // base64 string length, roughly 3MB of image

// Provider calls (esp. Gemini fallback) can take 20s+; Vercel's default function limit is much lower
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const prompt = body?.prompt;
    const images = body?.images ?? [];

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    if (prompt.length > MAX_PROMPT_CHARS) {
      return NextResponse.json({ error: 'Prompt is too long' }, { status: 413 });
    }
    if (
      !Array.isArray(images) ||
      images.length > MAX_IMAGES ||
      images.some((img) => typeof img !== 'string' || img.length > MAX_IMAGE_CHARS)
    ) {
      return NextResponse.json({ error: 'Invalid images' }, { status: 400 });
    }

    return NextResponse.json(await generateWithAI(prompt, images));
  } catch (error) {
    console.error('Error in /api/ai:', error);
    const status = error instanceof AIProviderError ? error.statusCode : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status }
    );
  }
}
