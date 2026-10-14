// src/app/api/dish-photo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/server/rate-limit';
import { buildPhotoQuery, pickPhoto } from '@/lib/dish-photo';

// A photo for a dish name, from Pexels. The key stays on the server, like the AI keys.
// Without PEXELS_API_KEY (or without a good match) the answer is { photo: null } and the app keeps its placeholder.
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 'dish-photo', { envName: 'PHOTO_RATE_LIMIT_PER_MIN', fallback: 30 });
  if (limited) return limited;

  const params = request.nextUrl.searchParams;
  const title = params.get('title')?.trim() ?? '';
  const cuisine = params.get('cuisine')?.trim().slice(0, 40);
  if (title.length < 2 || title.length > 100) {
    return NextResponse.json({ error: 'A dish title is required' }, { status: 400 });
  }

  const key = process.env.PEXELS_API_KEY;
  if (!key) return NextResponse.json({ photo: null });

  try {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', buildPhotoQuery(title, cuisine));
    url.searchParams.set('per_page', '8');
    url.searchParams.set('orientation', 'landscape');
    const response = await fetch(url, { headers: { Authorization: key }, signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error(`Pexels answered ${response.status}`);

    const photo = pickPhoto(await response.json(), title);
    return NextResponse.json(
      { photo },
      // The same dish asks the same question: let the CDN answer for a day instead of calling Pexels again
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
    );
  } catch (error) {
    console.error('Dish photo lookup failed:', error);
    return NextResponse.json({ photo: null }, { status: 502 });
  }
}
