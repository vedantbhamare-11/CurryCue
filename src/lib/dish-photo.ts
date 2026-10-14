// Finding a real photo of a dish. A wrong photo is worse than none (early versions put a pasta photo on a
// curry), so a search result is only used when its description mentions the dish.

export type DishPhoto = { url: string; credit: { name: string; url: string } };
// The server also needs the link Unsplash wants pinged when a photo is used; the browser never sees it
export type PickedPhoto = DishPhoto & { downloadLocation: string };

// Early versions attached one of six unrelated Unsplash stock photos to every recipe (a curry could get a
// pasta photo). Saved recipes may still carry those, so exactly those count as "no photo". Photos found
// by search are also on Unsplash, so the host alone cannot tell them apart.
const LEGACY_STOCK_PHOTOS = [
  'photo-1455619452474-d2be8b1e70cd', 'photo-1473093295043-cdd812d0e601', 'photo-1498837167922-ddd27525d352',
  'photo-1504674900247-0877df9cc836', 'photo-1512621776951-a57141f2eefd', 'photo-1546069901-ba9599a7e63c',
];
export const hasRealPhoto = (src?: string): src is string => Boolean(src) && !LEGACY_STOCK_PHOTOS.some((id) => src!.includes(id));

// Words that describe a dish in general, not which dish it is: matching on these alone proves nothing
const GENERIC_WORDS = new Set([
  'the', 'and', 'with', 'style', 'recipe', 'homemade', 'easy', 'quick', 'simple', 'classic', 'spicy', 'special',
  'curry', 'masala', 'indian', 'food', 'dish', 'traditional', 'authentic', 'fresh', 'hot', 'sweet',
]);

const words = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-z]+/g) ?? [];

export function significantWords(title: string): string[] {
  return [...new Set(words(title).filter((word) => word.length > 2 && !GENERIC_WORDS.has(word)))];
}

export const buildPhotoQuery = (title: string, cuisine?: string) =>
  `${title} ${cuisine && cuisine !== 'General' ? `${cuisine} ` : ''}food`.replace(/\s+/g, ' ').trim().slice(0, 100);

type UnsplashPhoto = {
  alt_description?: unknown; description?: unknown; tags?: unknown;
  urls?: { regular?: unknown }; user?: { name?: unknown; links?: { html?: unknown } }; links?: { download_location?: unknown };
};

const httpsUrlOn = (value: unknown, host: string): value is string => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === host;
  } catch {
    return false;
  }
};

// Everything a photo says about itself: Unsplash descriptions are short and often missing, so tags count too
function describe(photo: UnsplashPhoto): Set<string> {
  const tags = Array.isArray(photo.tags) ? photo.tags.map((tag) => (tag as { title?: unknown })?.title) : [];
  const text = [photo.alt_description, photo.description, ...tags].filter((part): part is string => typeof part === 'string').join(' ');
  return new Set(words(text));
}

// The first search result that is described as the dish, or null. Short names (one or two distinctive words)
// must match fully, so "paneer cubes" is not accepted for "palak paneer"; longer ones may miss a word.
export function pickPhoto(response: unknown, title: string): PickedPhoto | null {
  const wanted = significantWords(title);
  if (wanted.length === 0) return null;
  const needed = wanted.length <= 2 ? wanted.length : Math.ceil(wanted.length / 2);
  const results = (response as { results?: unknown })?.results;
  if (!Array.isArray(results)) return null;

  for (const photo of results as UnsplashPhoto[]) {
    const url = photo?.urls?.regular;
    const downloadLocation = photo?.links?.download_location;
    if (!httpsUrlOn(url, 'images.unsplash.com') || !httpsUrlOn(downloadLocation, 'api.unsplash.com')) continue;
    const described = describe(photo);
    if (wanted.filter((word) => described.has(word)).length < needed) continue;

    const profile = photo.user?.links?.html;
    return {
      url,
      downloadLocation,
      credit: {
        name: typeof photo.user?.name === 'string' && photo.user.name ? photo.user.name : 'Unsplash',
        // Unsplash asks for links back to it that carry the app name
        url: `${httpsUrlOn(profile, 'unsplash.com') ? profile : 'https://unsplash.com'}?utm_source=currycue&utm_medium=referral`,
      },
    };
  }
  return null;
}
