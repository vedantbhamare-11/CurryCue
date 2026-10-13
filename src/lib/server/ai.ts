// Server-only provider dispatcher. Tries each configured provider in order and falls back
// to the next on any failure (rate limit, overload, outage, bad key...).
// Order comes from AI_PROVIDERS (default "groq,gemini"); a provider without its API key is skipped.
import type { TextGenerationResult } from '@/lib/api/util';
import { AIProviderError } from '@/lib/server/ai-error';
import { generateWithGroq, hasGroqKey } from '@/lib/server/groq';
import { generateWithGemini, hasGeminiKey } from '@/lib/server/gemini';

type Provider = {
  name: string;
  isConfigured: () => boolean;
  generate: (prompt: string, imageUrls: string[]) => Promise<TextGenerationResult>;
};

const PROVIDERS: Record<string, Provider> = {
  groq: { name: 'groq', isConfigured: hasGroqKey, generate: generateWithGroq },
  gemini: { name: 'gemini', isConfigured: hasGeminiKey, generate: generateWithGemini },
};

export async function generateWithAI(prompt: string, imageUrls: string[] = []): Promise<TextGenerationResult> {
  const order = (process.env.AI_PROVIDERS || 'groq,gemini')
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name in PROVIDERS);

  const providers = order.map((name) => PROVIDERS[name]).filter((provider) => provider.isConfigured());
  if (providers.length === 0) {
    throw new AIProviderError('No AI provider configured. Set GROQ_API_KEY and/or GEMINI_API_KEY in .env.local.', 500, 'none');
  }

  const failures: AIProviderError[] = [];

  for (const provider of providers) {
    try {
      return await provider.generate(prompt, imageUrls);
    } catch (error) {
      const failure =
        error instanceof AIProviderError
          ? error
          : new AIProviderError(error instanceof Error ? error.message : String(error), 500, provider.name);
      failures.push(failure);
      console.warn(`[ai] ${provider.name} failed (${failure.statusCode}): ${failure.message}`);
    }
  }

  // Report the primary provider's status code, but include every failure so nothing is hidden
  throw new AIProviderError(
    [...new Set(failures.map((failure) => failure.message))].join(' | '),
    failures[0].statusCode,
    failures[0].provider
  );
}
