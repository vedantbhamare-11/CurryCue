import type { NextConfig } from 'next';

const config: NextConfig = {
  trailingSlash: true,
  images: {
    // Recipe photos are plain remote URLs, so skip Next's image optimizer (which would need an allow-list of hosts)
    unoptimized: true,
  },
  eslint: {
    // `next lint` crashes with "Invalid Options" against this ESLint setup, and there are ~140 existing
    // lint errors, so linting stays out of the build for now. Run `npm run lint` directly instead.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors fail the build. They used to be ignored, which hid real problems.
    ignoreBuildErrors: false,
  },
};

export default config;
