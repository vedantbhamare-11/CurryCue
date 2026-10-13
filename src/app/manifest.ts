import type { MetadataRoute } from 'next';

// Served at /manifest.webmanifest and linked automatically by Next. The layout used to point at
// /site.webmanifest, which never existed (a 404 on every page load).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CurryCue',
    short_name: 'CurryCue',
    description: 'Turn your ingredients into delicious recipes with AI assistance',
    start_url: '/',
    display: 'standalone',
    background_color: '#F9F5F0',
    theme_color: '#E67E22',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
