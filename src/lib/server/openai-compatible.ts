// Server-only generic client for any provider that speaks the OpenAI chat-completions format
// (Groq, Cerebras, OpenRouter, Together, Mistral, OpenAI, ...). Configuration lives in ai-config.ts.
import type { TextGenerationResult } from '@/lib/api/util';
import { AIProviderError, FALLBACK_STATUSES } from '@/lib/server/ai-error';
import type { ResolvedOpenAICompatible } from '@/lib/server/ai-config';

const ATTEMPT_TIMEOUT_MS = 30_000;

export function canHandle(provider: ResolvedOpenAICompatible, hasImages: boolean): boolean {
  return hasImages ? provider.visionModels.length > 0 : provider.textModels.length > 0;
}

export async function generateWithOpenAICompatible(
  provider: ResolvedOpenAICompatible,
  prompt: string,
  imageUrls: string[] = []
): Promise<TextGenerationResult> {
  const hasImages = imageUrls.length > 0;
  const models = hasImages ? provider.visionModels : provider.textModels;

  // Only data URLs: forwarding arbitrary remote URLs would make the provider fetch them for us
  if (imageUrls.some((url) => !url.startsWith('data:image/'))) {
    throw new AIProviderError('Images must be base64 data URLs', 400, provider.name);
  }

  const content = hasImages
    ? [{ type: 'text', text: prompt }, ...imageUrls.map((url) => ({ type: 'image_url', image_url: { url } }))]
    : prompt;

  type ChatResponse = {
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  let data: ChatResponse | null = null;
  let lastError = new AIProviderError(`No ${provider.name} model available`, 502, provider.name);

  for (const model of models) {
    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content }],
          ...provider.bodyFor?.(model),
        }),
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });

      const json = await response.json().catch(() => null);

      if (response.ok) {
        data = json;
        break;
      }

      lastError = new AIProviderError(
        `${provider.name} error (${model}): ${json?.error?.message ?? `${response.status} ${response.statusText}`}`,
        response.status,
        provider.name
      );
      if (!FALLBACK_STATUSES.has(response.status)) throw lastError;
    } catch (error) {
      if (error instanceof AIProviderError) {
        if (!FALLBACK_STATUSES.has(error.statusCode)) throw error;
      } else {
        // fetch aborted (timeout) or network failure: try the next model
        lastError = new AIProviderError(
          `${provider.name} request failed (${model}): ${error instanceof Error ? error.message : String(error)}`,
          504,
          provider.name
        );
      }
    }
  }

  if (!data) throw lastError;

  const choice = data.choices?.[0];
  const text: string = choice?.message?.content ?? '';
  if (!text) {
    throw new AIProviderError(
      `${provider.name} returned no text (finish_reason: ${choice?.finish_reason ?? 'unknown'})`,
      502,
      provider.name
    );
  }

  return {
    text,
    usage: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    },
    finishReason: choice?.finish_reason === 'stop' ? 'stop' : choice?.finish_reason === 'length' ? 'length' : 'content_filter',
  };
}
