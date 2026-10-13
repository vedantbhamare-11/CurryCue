// Provider configuration, shared by the runtime (ai.ts, openai-compatible.ts, gemini.ts) and
// scripts/check-models.mjs. Keep this file free of '@/' imports and of non-erasable TypeScript
// (enums, parameter properties) so Node can run it directly.
//
// To change models or providers, edit environment variables (.env.local / Vercel), not code:
//   AI_PROVIDERS=groq,gemini            order of providers; later ones are fallbacks
//   <NAME>_API_KEY=...                  required for a provider to be used
//   <NAME>_TEXT_MODELS=a,b,c            replaces the built-in text model list
//   <NAME>_VISION_MODELS=a,b            replaces the built-in image-capable model list
//   <NAME>_BASE_URL=https://.../v1      only needed for providers without a preset below
// where <NAME> is the provider name upper-cased (groq -> GROQ, my-host -> MY_HOST).

export type Env = Record<string, string | undefined>;

export type ModelBodyFn = (model: string) => Record<string, unknown>;

export type OpenAICompatiblePreset = {
  baseUrl: string;
  textModels?: string[];
  visionModels?: string[];
  // Extra request-body params for specific models
  bodyFor?: ModelBodyFn;
};

// Any provider that speaks the OpenAI chat-completions format. Only groq ships with default
// models; for the others, set <NAME>_TEXT_MODELS (and _VISION_MODELS for image support).
export const OPENAI_COMPATIBLE_PRESETS: Record<string, OpenAICompatiblePreset> = {
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    // Each Groq model has its own rate-limit bucket (8k tokens/min on the free tier), so the
    // 20b model is a real fallback when 120b is rate limited.
    textModels: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
    // Only Qwen accepts images on Groq at the moment (the gpt-oss models are text-only)
    visionModels: ['qwen/qwen3.8-27b'],
    // gpt-oss models "reason" before answering; low effort cuts latency and token use, which
    // counts against the per-minute limit. Other models would reject the param.
    bodyFor: (model) => (model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
  },
  cerebras: { baseUrl: 'https://api.cerebras.ai/v1' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1' },
  together: { baseUrl: 'https://api.together.xyz/v1' },
  mistral: { baseUrl: 'https://api.mistral.ai/v1' },
  openai: { baseUrl: 'https://api.openai.com/v1' },
};

export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
// Tried in order. The alias survives model retirements (2.5-flash was retired for new users)
// but gets overloaded ("high demand", sometimes hanging); the lite alias is the fallback.
export const GEMINI_DEFAULT_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];

export const DEFAULT_PROVIDER_ORDER = 'groq,gemini';

export function envPrefix(providerName: string): string {
  return providerName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

// "a, b,c" -> ['a','b','c']; unset or empty -> undefined (so callers fall back to defaults)
export function envList(env: Env, key: string): string[] | undefined {
  const items = (env[key] ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

export function getProviderOrder(env: Env): string[] {
  return (env.AI_PROVIDERS || DEFAULT_PROVIDER_ORDER)
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
}

export type ResolvedOpenAICompatible = {
  name: string;
  baseUrl: string;
  apiKey: string;
  textModels: string[];
  visionModels: string[];
  bodyFor?: ModelBodyFn;
};

// null = not usable (no key, no base URL, or no text models); `reason` says why, for warnings
export function resolveOpenAICompatible(
  name: string,
  env: Env
): { provider: ResolvedOpenAICompatible; reason?: undefined } | { provider: null; reason: string } {
  const prefix = envPrefix(name);
  const preset = OPENAI_COMPATIBLE_PRESETS[name];

  const apiKey = env[`${prefix}_API_KEY`];
  if (!apiKey) return { provider: null, reason: `${prefix}_API_KEY is not set` };

  const baseUrl = (env[`${prefix}_BASE_URL`] || preset?.baseUrl || '').replace(/\/+$/, '');
  if (!baseUrl) return { provider: null, reason: `${prefix}_BASE_URL is not set (no preset for "${name}")` };

  const textModels = envList(env, `${prefix}_TEXT_MODELS`) ?? preset?.textModels ?? [];
  if (textModels.length === 0) return { provider: null, reason: `${prefix}_TEXT_MODELS is not set` };

  const visionModels = envList(env, `${prefix}_VISION_MODELS`) ?? preset?.visionModels ?? [];

  return { provider: { name, baseUrl, apiKey, textModels, visionModels, bodyFor: preset?.bodyFor } };
}

export function resolveGeminiModels(env: Env): string[] {
  return envList(env, 'GEMINI_MODELS') ?? GEMINI_DEFAULT_MODELS;
}
