// src/app/api/dish-photo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/server/rate-limit';
import { buildPhotoQuery, pickPhoto } from '@/lib/dish-photo';

// A photo for a dish name, from Unsplash. The key stays on the server, like the AI keys.
// Without UNSPLASH_ACCESS_KEY (or without a good match) the answer is { photo: null } and the app keeps its placeholder.
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 'dish-photo', { envName: 'PHOTO_RATE_LIMIT_PER_MIN', fallback: 30 });
  if (limited) return limited;

  const params = request.nextUrl.searchParams;
  const title = params.get('title')?.trim() ?? '';
  const cuisine = params.get('cuisine')?.trim().slice(0, 40);
  if (title.length < 2 || title.length > 100) {
    return NextResponse.json({ error: 'A dish title is required' }, { status: 400 });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ photo: null });

  try {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', buildPhotoQuery(title, cuisine));
    url.searchParams.set('per_page', '8');
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');
    const response = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' }, signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error(`Unsplash answered ${response.status}`);

    const picked = pickPhoto(await response.json(), title);
    if (picked) {
      // Unsplash's API rules ask apps to report a photo being used; failing to do so must not lose the photo
      fetch(picked.downloadLocation, { headers: { Authorization: `Client-ID ${key}` }, signal: AbortSignal.timeout(4000) }).catch(() => {});
    }
    const photo = picked && { url: picked.url, credit: picked.credit };
    return NextResponse.json(
      { photo },
      // The same dish asks the same question: let the CDN answer for a day instead of calling Unsplash again
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
    );
  } catch (error) {
    console.error('Dish photo lookup failed:', error);
    return NextResponse.json({ photo: null }, { status: 502 });
  }
}
