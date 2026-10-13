// The app's entry point for AI text and vision calls. Which provider and model actually answers is decided
// on the server (lib/server/ai.ts, configured through environment variables), so callers just ask.
//
// In the browser this calls our own /api/ai route, which holds the API keys; on the server (for example inside
// /api/detect-ingredients) it calls the provider layer directly, since a relative fetch() has no base URL there.

export class AIServiceError extends Error {
  statusCode: number;
  provider: string;

  constructor(message: string, statusCode: number, provider: string) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = statusCode;
    this.provider = provider;
  }
}

export type TextGenerationResult = {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter';
};

async function callAI(prompt: string, imageUrls: string[] = []): Promise<TextGenerationResult> {
  if (typeof window === 'undefined') {
    const { generateWithAI } = await import('@/lib/server/ai');
    return generateWithAI(prompt, imageUrls);
  }

  // Trailing slash matters: next.config has trailingSlash: true, so '/api/ai' would 308 first
  const response = await fetch('/api/ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, images: imageUrls }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AIServiceError(data?.error ?? `AI request failed: ${response.status}`, response.status, 'ai');
  }
  return data as TextGenerationResult;
}

// Failures keep their own message (rate limits, "no provider configured"...) so the UI can show it
function wrap(action: string, error: unknown): AIServiceError {
  if (error instanceof AIServiceError) return error;
  return new AIServiceError(`Error ${action}: ${error instanceof Error ? error.message : String(error)}`, 500, 'ai');
}

/**
 * Generate text from a prompt.
 */
export async function generateText(prompt: string): Promise<TextGenerationResult> {
  if (!prompt) throw new Error('Prompt is required');
  try {
    return await callAI(prompt);
  } catch (error) {
    throw wrap('generating text', error);
  }
}

/**
 * Generate text from a prompt plus images (base64 data URLs). Uses a vision-capable model.
 */
export async function generateTextWithImages(prompt: string, imageUrls: string[]): Promise<TextGenerationResult> {
  if (!prompt) throw new Error('Prompt is required');
  if (!imageUrls || !Array.isArray(imageUrls)) throw new Error('Image URLs must be an array');
  try {
    return await callAI(prompt, imageUrls);
  } catch (error) {
    throw wrap('generating text with images', error);
  }
}
