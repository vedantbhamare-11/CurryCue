// Finding a real photo of a dish. A wrong photo is worse than none (early versions put a pasta photo on a
// curry), so a search result is only used when its description mentions the dish.

export type DishPhoto = { url: string; credit: { name: string; url: string } };

// Early versions attached one of five unrelated Unsplash stock photos to every recipe. Saved recipes may
// still carry those, so they count as "no photo".
export const hasRealPhoto = (src?: string): src is string => Boolean(src) && !src!.includes('images.unsplash.com');

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

type PexelsPhoto = { alt?: unknown; url?: unknown; photographer?: unknown; photographer_url?: unknown; src?: { large?: unknown } };

const isPexelsImage = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'images.pexels.com';
  } catch {
    return false;
  }
};

// The first result whose description names the dish, or null. Short names (one or two distinctive words)
// must match fully, so "paneer cubes" is not accepted for "palak paneer"; longer ones may miss a word.
export function pickPhoto(response: unknown, title: string): DishPhoto | null {
  const wanted = significantWords(title);
  if (wanted.length === 0) return null;
  const needed = wanted.length <= 2 ? wanted.length : Math.ceil(wanted.length / 2);
  const photos = (response as { photos?: unknown })?.photos;
  if (!Array.isArray(photos)) return null;

  for (const photo of photos as PexelsPhoto[]) {
    if (!photo || typeof photo.alt !== 'string' || !isPexelsImage(photo.src?.large)) continue;
    const described = new Set(words(photo.alt));
    if (wanted.filter((word) => described.has(word)).length < needed) continue;
    return {
      url: photo.src.large,
      credit: {
        name: typeof photo.photographer === 'string' && photo.photographer ? photo.photographer : 'Pexels',
        url: typeof photo.photographer_url === 'string' && photo.photographer_url.startsWith('https://www.pexels.com/')
          ? photo.photographer_url
          : 'https://www.pexels.com',
      },
    };
  }
  return null;
}
