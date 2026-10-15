import { sanitizeRecipe } from '@/lib/backup';
import type { Recipe } from '@/types';

// Sharing a recipe without a server: the recipe itself travels inside the link (compressed, then base64url).
// Only what makes the recipe is shared. What depends on the sender's pantry (what they have, what is missing,
// the match %) is left out and worked out again for whoever opens it.

const SHARE_VERSION = 1;
// A longer link than this is not worth sharing (some apps cut long links); the plain text is shared on its own
export const MAX_LINK_PAYLOAD_CHARS = 8000;
// Guard for links that are not ours: compressed data can expand enormously ("zip bomb")
const MAX_DECODED_BYTES = 60_000;
const IMAGE_HOST = 'images.unsplash.com';
const CREDIT_HOST = 'unsplash.com';

type SharedPayload = {
  v: number;
  t: string; // title
  d?: string; // description
  c?: number; // cook time, minutes
  f?: string; // difficulty
  u?: string; // cuisine
  g?: string[]; // tags
  i: [string, string?, string?][]; // ingredients: name, quantity, unit
  s: string[]; // steps
  p?: string; // photo
  a?: [string, string]; // photo credit: name, link
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}

async function compress(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Stops reading as soon as the output passes the limit instead of inflating everything first
async function decompress(bytes: Uint8Array, maxBytes: number): Promise<Uint8Array | null> {
  try {
    const reader = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  } catch {
    return null;
  }
}

const hostOf = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.hostname : null;
  } catch {
    return null;
  }
};

export function toSharedPayload(recipe: Recipe): SharedPayload {
  const photo = hostOf(recipe.image) === IMAGE_HOST ? recipe.image : undefined;
  return {
    v: SHARE_VERSION,
    t: recipe.title,
    ...(recipe.description ? { d: recipe.description } : {}),
    c: recipe.cookTime,
    f: recipe.difficulty,
    ...(recipe.cuisine ? { u: recipe.cuisine } : {}),
    ...(recipe.tags.length ? { g: recipe.tags } : {}),
    i: recipe.ingredients.map((item) => [item.name, item.quantity, item.unit] as [string, string?, string?]),
    s: recipe.steps,
    ...(photo ? { p: photo } : {}),
    ...(photo && recipe.imageCredit ? { a: [recipe.imageCredit.name, recipe.imageCredit.url] as [string, string] } : {}),
  };
}

export async function encodeRecipe(recipe: Recipe): Promise<string> {
  return toBase64Url(await compress(new TextEncoder().encode(JSON.stringify(toSharedPayload(recipe)))));
}

// A recipe from a link is untrusted input: anyone can write one by hand. It goes through the same cleaning as a
// restored backup, and only a photo from Unsplash (where ours come from) is kept, so a link cannot make the page
// load an image from some other server.
export async function decodeRecipe(encoded: string | undefined): Promise<Recipe | null> {
  if (!encoded || encoded.length > MAX_LINK_PAYLOAD_CHARS * 2) return null;
  const compressed = fromBase64Url(encoded);
  if (!compressed) return null;
  const bytes = await decompress(compressed, MAX_DECODED_BYTES);
  if (!bytes) return null;

  let payload: Partial<SharedPayload>;
  try {
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== 'object' || payload.v !== SHARE_VERSION) return null;

  const ingredients = (Array.isArray(payload.i) ? payload.i : []).map((row, index) => ({
    id: `shared-${index}`,
    name: Array.isArray(row) ? row[0] : undefined,
    quantity: Array.isArray(row) ? row[1] : undefined,
    unit: Array.isArray(row) ? row[2] : undefined,
  }));
  const photo = typeof payload.p === 'string' && hostOf(payload.p) === IMAGE_HOST ? payload.p : '';

  const recipe = sanitizeRecipe({
    id: `shared-${shortHash(encoded)}`,
    title: payload.t,
    description: payload.d,
    cookTime: payload.c,
    difficulty: payload.f,
    cuisine: payload.u,
    tags: payload.g,
    ingredients,
    steps: payload.s,
    image: photo,
  });
  if (!recipe) return null;

  const [creditName, creditUrl] = Array.isArray(payload.a) ? payload.a : [];
  const creditHost = typeof creditUrl === 'string' ? hostOf(creditUrl) : null;
  const credited = photo && typeof creditName === 'string' && creditName.trim() && creditHost && (creditHost === CREDIT_HOST || creditHost.endsWith(`.${CREDIT_HOST}`));
  return {
    ...recipe,
    matchPercentage: 0,
    usedIngredients: [],
    assumedIngredients: [],
    missingIngredients: [],
    usesExpiring: [],
    ...(credited ? { imageCredit: { name: creditName.trim().slice(0, 100), url: creditUrl as string } } : {}),
  };
}

// Same link, same id: saving a recipe you were sent twice does not add it twice
function shortHash(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) hash = ((hash * 33) ^ value.charCodeAt(i)) >>> 0;
  return hash.toString(36);
}

// "Tomato Onion Curry" -> "tomato-onion-curry": only there so the link reads like a recipe
export function recipeSlug(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
  return slug || 'recipe';
}

// null when the recipe is too big for a sensible link
export async function buildShareUrl(origin: string, recipe: Recipe): Promise<string | null> {
  const encoded = await encodeRecipe(recipe);
  if (encoded.length > MAX_LINK_PAYLOAD_CHARS) return null;
  return `${origin}/recipe/${recipeSlug(recipe.title)}/?d=${encoded}`;
}

// The readable message that goes out with (or instead of) the link
export function recipeShareText(recipe: Recipe, url: string | null): string {
  const facts = [recipe.cuisine, recipe.cookTime ? `${recipe.cookTime} min` : '', recipe.difficulty].filter(Boolean).join(' · ');
  const ingredients = recipe.ingredients.map((item) => `• ${[item.quantity, item.unit, item.name].filter(Boolean).join(' ')}`);
  const steps = recipe.steps.map((step, index) => `${index + 1}. ${step}`);
  return [
    `🍛 ${recipe.title}`,
    facts,
    '',
    'Ingredients:',
    ...ingredients,
    '',
    'Steps:',
    ...steps,
    ...(url ? ['', `Open it in CurryCue: ${url}`] : []),
  ]
    .filter((line, index, all) => !(line === '' && (index === 0 || all[index - 1] === '')) )
    .join('\n');
}
