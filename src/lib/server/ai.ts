// Server-only provider dispatcher. Tries each configured provider in order and falls back
// to the next on any failure (rate limit, overload, outage, bad key...).
// Provider order, keys and model lists all come from env vars; see ai-config.ts.
import type { TextGenerationResult } from '@/lib/api/util';
import { AIProviderError } from '@/lib/server/ai-error';
import { getProviderOrder, resolveOpenAICompatible } from '@/lib/server/ai-config';
import { canHandle, generateWithOpenAICompatible } from '@/lib/server/openai-compatible';
import { generateWithGemini, hasGeminiKey } from '@/lib/server/gemini';

type Provider = {
  name: string;
  // false = this provider can't serve the request (e.g. an image request but no vision model configured)
  canHandle: (hasImages: boolean) => boolean;
  generate: (prompt: string, imageUrls: string[]) => Promise<TextGenerationResult>;
};

const warned = new Set<string>();
function warnOnce(message: string) {
  if (!warned.has(message)) {
    warned.add(message);
    console.warn(`[ai] ${message}`);
  }
}

function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  for (const name of getProviderOrder(process.env)) {
    if (name === 'gemini') {
      if (hasGeminiKey()) providers.push({ name, canHandle: () => true, generate: generateWithGemini });
      continue;
    }

    const { provider, reason } = resolveOpenAICompatible(name, process.env);
    if (!provider) {
      // A missing key just means "not enabled"; anything else is a config mistake worth surfacing
      if (!reason.endsWith('_API_KEY is not set')) warnOnce(`provider "${name}" skipped: ${reason}`);
      continue;
    }
    providers.push({
      name,
      canHandle: (hasImages) => canHandle(provider, hasImages),
      generate: (prompt, imageUrls) => generateWithOpenAICompatible(provider, prompt, imageUrls),
    });
  }

  return providers;
}

export async function generateWithAI(prompt: string, imageUrls: string[] = []): Promise<TextGenerationResult> {
  const hasImages = imageUrls.length > 0;
  const providers = buildProviders();
  if (providers.length === 0) {
    throw new AIProviderError(
      'No AI provider configured. Set GROQ_API_KEY and/or GEMINI_API_KEY in .env.local (see .env.example).',
      500,
      'none'
    );
  }

  const capable = providers.filter((provider) => provider.canHandle(hasImages));
  if (capable.length === 0) {
    throw new AIProviderError(
      `No configured provider can handle ${hasImages ? 'image' : 'text'} requests. Set <PROVIDER>_VISION_MODELS (see .env.example).`,
      501,
      'none'
    );
  }

  const failures: AIProviderError[] = [];

  for (const provider of capable) {
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
