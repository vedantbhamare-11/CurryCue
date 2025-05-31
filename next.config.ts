// @ts-ignore
/** @type {import("next").NextConfig} */
const config = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: true,
  webpack: (config: { stats: string; devtool: string; resolve: { fallback: any; }; }, { isServer }: any) => {
    config.stats = "verbose";
    config.devtool = 'source-map'
    // Enhanced node polyfills for postgres and other modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // File system - never needed in browser
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        'perf_hooks': false,

        // Definitely not needed in browser
        child_process: false,
        dns: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/_next/:path*.map',
        destination: '/_next/:path*.map',
      },
    ];
  },
};
export default config;
