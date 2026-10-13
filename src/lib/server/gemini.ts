// Server-only: reads GEMINI_API_KEY. Import this only from route handlers or via
// the dynamic import in lib/api/util.ts (server branch) so the key never reaches the client.
import type { TextGenerationResult } from '@/lib/api/util';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-flash-latest'; // alias: pinned names get retired for new users (2.5-flash already was)

export class GeminiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'GeminiError';
    this.statusCode = statusCode;
  }
}

// Only data URLs are accepted: fetching arbitrary remote image URLs from the server would be an SSRF vector.
function toInlineData(dataUrl: string) {
  const match = /^data:([\w.+-]+\/[\w.+-]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) {
    throw new GeminiError('Images must be base64 data URLs', 400);
  }
  return { mime_type: match[1], data: match[2] };
}

const FINISH_REASONS: Record<string, TextGenerationResult['finishReason']> = {
  STOP: 'stop',
  MAX_TOKENS: 'length',
};

export async function generateWithGemini(
  prompt: string,
  imageUrls: string[] = []
): Promise<TextGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server.', 500);
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const response = await fetch(`${GEMINI_BASE_URL}/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Header instead of ?key= so the key never ends up in URLs or logs
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, ...imageUrls.map((url) => ({ inline_data: toInlineData(url) }))],
        },
      ],
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message ?? `${response.status} ${response.statusText}`;
    throw new GeminiError(`Gemini error: ${message}`, response.status);
  }

  const candidate = data?.candidates?.[0];
  const text = (candidate?.content?.parts ?? [])
    .map((part: { text?: string }) => part.text ?? '')
    .join('');

  if (!text) {
    // Empty text usually means the prompt/response was blocked by safety filters
    throw new GeminiError(
      `Gemini returned no text (finishReason: ${candidate?.finishReason ?? data?.promptFeedback?.blockReason ?? 'unknown'})`,
      502
    );
  }

  return {
    text,
    usage: {
      promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
      completionTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens: data.usageMetadata?.totalTokenCount ?? 0,
    },
    finishReason: FINISH_REASONS[candidate?.finishReason] ?? 'content_filter',
  };
}
