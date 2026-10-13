// Server-only: reads GROQ_API_KEY. Never import from client components.
import type { TextGenerationResult } from '@/lib/api/util';
import { AIProviderError, FALLBACK_STATUSES } from '@/lib/server/ai-error';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ATTEMPT_TIMEOUT_MS = 30_000;

// Each Groq model has its own rate-limit bucket (8k tokens/min on the free tier), so the 20b
// model is a useful fallback when 120b is rate limited. Override with GROQ_TEXT_MODEL / GROQ_VISION_MODEL.
const DEFAULT_TEXT_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
// Only Qwen accepts images on Groq at the moment (the gpt-oss models are text-only)
const DEFAULT_VISION_MODELS = ['qwen/qwen3.8-27b'];

export function hasGroqKey(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function generateWithGroq(
  prompt: string,
  imageUrls: string[] = []
): Promise<TextGenerationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AIProviderError('GROQ_API_KEY is not set. Add it to .env.local and restart the dev server.', 500, 'groq');
  }

  const hasImages = imageUrls.length > 0;
  const override = hasImages ? process.env.GROQ_VISION_MODEL : process.env.GROQ_TEXT_MODEL;
  const models = [...new Set([override, ...(hasImages ? DEFAULT_VISION_MODELS : DEFAULT_TEXT_MODELS)].filter(Boolean))] as string[];

  // Only data URLs: forwarding arbitrary remote URLs would make Groq's servers fetch them for us
  if (imageUrls.some((url) => !url.startsWith('data:image/'))) {
    throw new AIProviderError('Images must be base64 data URLs', 400, 'groq');
  }

  const content = hasImages
    ? [{ type: 'text', text: prompt }, ...imageUrls.map((url) => ({ type: 'image_url', image_url: { url } }))]
    : prompt;

  let data: any = null;
  let lastError = new AIProviderError('No Groq model available', 502, 'groq');

  for (const model of models) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content }],
          // gpt-oss models "reason" before answering; low effort cuts latency and token use
          // (which counts against the per-minute limit). Other models would reject the param.
          ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
        }),
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });

      const json = await response.json().catch(() => null);

      if (response.ok) {
        data = json;
        break;
      }

      lastError = new AIProviderError(
        `Groq error (${model}): ${json?.error?.message ?? `${response.status} ${response.statusText}`}`,
        response.status,
        'groq'
      );
      if (!FALLBACK_STATUSES.has(response.status)) throw lastError;
    } catch (error) {
      if (error instanceof AIProviderError) {
        if (!FALLBACK_STATUSES.has(error.statusCode)) throw error;
      } else {
        // fetch aborted (timeout) or network failure: try the next model
        lastError = new AIProviderError(
          `Groq request failed (${model}): ${error instanceof Error ? error.message : String(error)}`,
          504,
          'groq'
        );
      }
    }
  }

  if (!data) throw lastError;

  const choice = data.choices?.[0];
  const text: string = choice?.message?.content ?? '';
  if (!text) {
    throw new AIProviderError(`Groq returned no text (finish_reason: ${choice?.finish_reason ?? 'unknown'})`, 502, 'groq');
  }

  return {
    text,
    usage: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    },
    finishReason: choice.finish_reason === 'stop' ? 'stop' : choice.finish_reason === 'length' ? 'length' : 'content_filter',
  };
}
