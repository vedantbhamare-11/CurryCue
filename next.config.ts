import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Nothing embeds this app, so refuse to be framed (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The app itself needs the camera (scan) and microphone (voice); nobody else does
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=()' },
];

const config: NextConfig = {
  // The browser tests build into their own folder so they never disturb a running `next dev`
  distDir: process.env.NEXT_DIST_DIR || '.next',
  trailingSlash: true,
  poweredByHeader: false,
  headers: async () => [{ source: '/:path*', headers: securityHeaders }],
  images: {
    // Recipe photos are plain remote URLs, so skip Next's image optimizer (which would need an allow-list of hosts)
    unoptimized: true,
  },
  typescript: {
    // Type errors fail the build. They used to be ignored, which hid real problems.
    ignoreBuildErrors: false,
  },
};

export default config;
