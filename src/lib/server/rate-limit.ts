// Server-side rate limiting for the AI routes. Without this, anyone who finds /api/ai can spend
// your provider quota/credits; the client-side limiter in services/rate-limiter.ts protects nothing.
//
// Sliding window kept in memory, so limits are per server instance: exact on a single Node server
// (local dev, self-hosting), best-effort on serverless (each warm instance counts separately).
// For hard guarantees on Vercel, add a Vercel Firewall rate-limit rule or a shared store (e.g. Redis).
//
// Tunable via env (set to 0 to disable a limit):
//   AI_RATE_LIMIT_PER_MIN         per IP, general AI calls      (default 20)
//   AI_SCAN_RATE_LIMIT_PER_MIN    per IP, image scans           (default 6; each image is token-heavy)
//   AI_RATE_LIMIT_GLOBAL_PER_MIN  all IPs combined, per route   (default 120)
import { NextRequest, NextResponse } from 'next/server';

const WINDOW_MS = 60_000;
const MAX_TRACKED_KEYS = 10_000; // bounds memory if someone rotates fake IPs

const hits = new Map<string, number[]>();

function readLimit(envName: string, fallback: number): number {
  const value = Number.parseInt(process.env[envName] ?? '', 10);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

// Returns 0 if allowed, otherwise the seconds until the oldest hit leaves the window
function consume(key: string, limit: number, now: number): number {
  if (limit === 0) return 0; // disabled

  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return Math.max(1, Math.ceil((recent[0] + WINDOW_MS - now) / 1000));
  }

  recent.push(now);
  // Re-insert so the Map's insertion order approximates least-recently-used
  hits.delete(key);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    const oldestKey = hits.keys().next().value;
    if (oldestKey !== undefined) hits.delete(oldestKey);
  }
  return 0;
}

// On Vercel the platform sets x-forwarded-for. Self-hosted without a trusted proxy a client can
// spoof it to dodge the per-IP limit, which is what the global cap is for.
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Returns a 429 response if the caller is over a limit, otherwise null.
 * @param route short name, so routes have separate counters (e.g. "ai", "scan")
 */
export function rateLimit(
  request: NextRequest,
  route: string,
  perIp: { envName: string; fallback: number }
): NextResponse | null {
  const now = Date.now();
  const ipLimit = readLimit(perIp.envName, perIp.fallback);
  const globalLimit = readLimit('AI_RATE_LIMIT_GLOBAL_PER_MIN', 120);

  // Per-IP first, and only count against the global budget if that passes: a client that is
  // already blocked must not be able to burn the global budget and lock everyone else out.
  const retryAfter =
    consume(`${route}:ip:${getClientIp(request)}`, ipLimit, now) || consume(`${route}:global`, globalLimit, now);
  if (retryAfter === 0) return null;

  return NextResponse.json(
    { error: `Rate limit exceeded. Please try again in ${retryAfter}s.` },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}
