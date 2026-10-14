import type { NextConfig } from 'next';

const config: NextConfig = {
  trailingSlash: true,
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
