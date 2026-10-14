// Validation of what the scan endpoint receives and returns. Pure functions (no Next, no network) so they run in
// Node tests. The image is untrusted input and the model's answer is untrusted output: neither goes further
// than this file says it may.

// Only real raster image types. "data:text/html" or "data:image/svg+xml" have no business reaching a vision model.
const IMAGE_DATA_URL = /^data:image\/(?:jpeg|jpg|png|webp|gif|heic|heif);base64,([A-Za-z0-9+/]+={0,2})$/i;
const BARE_BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

// Smaller than any real photo; rejects "hello"-style junk before it costs two provider calls
const MIN_BASE64_CHARS = 100;

export type ImageCheck = { ok: true; dataUrl: string } | { ok: false; error: string };

// Accepts a base64 image data URL (or bare base64, which is treated as JPEG) and returns a normalised data URL
export function validateScanImage(value: unknown): ImageCheck {
  if (typeof value !== 'string' || value.length === 0) return { ok: false, error: 'No image provided' };

  const dataUrl = value.startsWith('data:') ? value : `data:image/jpeg;base64,${value}`;
  const match = IMAGE_DATA_URL.exec(dataUrl);
  if (!match) return { ok: false, error: 'That is not a supported image (use a JPEG, PNG or WebP photo)' };
  if (match[1].length < MIN_BASE64_CHARS || !BARE_BASE64.test(match[1])) {
    return { ok: false, error: 'That image looks empty or damaged' };
  }
  return { ok: true, dataUrl };
}

export type ScannedIngredient = { name: string; quantity?: string; unit?: string; confidence?: number };

// A name or unit must be a string; a quantity may also arrive as a number (2, not "2")
const clean = (value: unknown, max: number, allowNumber = false): string | undefined => {
  if (allowNumber && typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
};

// The model is asked for a JSON array but may return anything. Keep only well-formed entries, most confident first.
export function sanitizeScanResults(value: unknown, max = 40): ScannedIngredient[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const results: ScannedIngredient[] = [];
  for (const entry of value) {
    if (typeof entry !== 'object' || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const name = clean(record.name, 80);
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    const confidence = typeof record.confidence === 'number' && Number.isFinite(record.confidence)
      ? Math.min(100, Math.max(0, Math.round(record.confidence)))
      : undefined;
    const quantity = clean(record.quantity, 20, true);
    const unit = clean(record.unit, 20);
    results.push({ name, ...(quantity ? { quantity } : {}), ...(unit ? { unit } : {}), ...(confidence !== undefined ? { confidence } : {}) });
  }
  return results.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0)).slice(0, max);
}
