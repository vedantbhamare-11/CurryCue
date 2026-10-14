// Server-only: reads GEMINI_API_KEY. Import this only from route handlers or via
// the dynamic import in lib/api/util.ts (server branch) so the key never reaches the client.
import type { TextGenerationResult } from '@/lib/api/util';
import { AIProviderError, FALLBACK_STATUSES } from '@/lib/server/ai-error';
import { GEMINI_BASE_URL, resolveGeminiModels } from '@/lib/server/ai-config';

const ATTEMPT_TIMEOUT_MS = 45_000; // full recipe prompts can legitimately take 30s+ on thinking models

// Only data URLs are accepted: fetching arbitrary remote image URLs from the server would be an SSRF vector.
function toInlineData(dataUrl: string) {
  const match = /^data:([\w.+-]+\/[\w.+-]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) {
    throw new AIProviderError('Images must be base64 data URLs', 400, 'gemini');
  }
  return { mime_type: match[1], data: match[2] };
}

const FINISH_REASONS: Record<string, TextGenerationResult['finishReason']> = {
  STOP: 'stop',
  MAX_TOKENS: 'length',
};

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateWithGemini(
  prompt: string,
  imageUrls: string[] = []
): Promise<TextGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AIProviderError('GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server.', 500, 'gemini');
  }

  const models = resolveGeminiModels(process.env);
  const body = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }, ...imageUrls.map((url) => ({ inline_data: toInlineData(url) }))],
      },
    ],
  });

  type GeminiResponse = {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number };
  };
  let data: GeminiResponse | null = null;
  let lastError = new AIProviderError('No Gemini model available', 502, 'gemini');

  for (const model of models) {
    try {
      const response = await fetch(`${GEMINI_BASE_URL}/models/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Header instead of ?key= so the key never ends up in URLs or logs
          'x-goog-api-key': apiKey,
        },
        body,
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });

      const json = await response.json().catch(() => null);

      if (response.ok) {
        data = json;
        break;
      }

      lastError = new AIProviderError(
        `Gemini error (${model}): ${json?.error?.message ?? `${response.status} ${response.statusText}`}`,
        response.status,
        'gemini'
      );
      if (!FALLBACK_STATUSES.has(response.status)) throw lastError;
    } catch (error) {
      if (error instanceof AIProviderError && !FALLBACK_STATUSES.has(error.statusCode)) throw error;
      if (!(error instanceof AIProviderError)) {
        // fetch aborted (timeout) or network failure: fall through to the next model
        lastError = new AIProviderError(
          `Gemini request failed (${model}): ${error instanceof Error ? error.message : String(error)}`,
          504,
          'gemini'
        );
      }
    }
  }

  if (!data) throw lastError;

  const candidate = data?.candidates?.[0];
  const text = (candidate?.content?.parts ?? [])
    .map((part: { text?: string }) => part.text ?? '')
    .join('');

  if (!text) {
    // Empty text usually means the prompt/response was blocked by safety filters
    throw new AIProviderError(
      `Gemini returned no text (finishReason: ${candidate?.finishReason ?? data?.promptFeedback?.blockReason ?? 'unknown'})`,
      502,
      'gemini'
    );
  }

  return {
    text,
    usage: {
      promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
      completionTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens: data.usageMetadata?.totalTokenCount ?? 0,
    },
    finishReason: FINISH_REASONS[candidate?.finishReason ?? ''] ?? 'content_filter',
  };
}
