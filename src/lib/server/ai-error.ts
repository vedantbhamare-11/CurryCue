// Shared by every server-side AI provider (groq.ts, gemini.ts) and the dispatcher in ai.ts.
export class AIProviderError extends Error {
  statusCode: number;
  provider: string;

  constructor(message: string, statusCode: number, provider: string) {
    super(message);
    this.name = 'AIProviderError';
    this.statusCode = statusCode;
    this.provider = provider;
  }
}

// Overloaded / rate limited / server error / model retired or unknown / our own timeout:
// worth trying the next model or provider
export const FALLBACK_STATUSES = new Set([404, 429, 500, 502, 503, 504]);
