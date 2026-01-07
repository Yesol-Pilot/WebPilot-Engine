// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/WebPilot-Engine',
  images: {
    unoptimized: true,
  },
  // API rewrites are not supported in static export (GitHub Pages)
  /*
  async rewrites() {
    return [
      {
        source: '/api/tripo/:path*',
        destination: 'https://api.tripo3d.ai/v2/openapi/:path*',
      },
      {
        source: '/api/blockade/:path*',
        destination: 'https://backend.blockadelabs.com/api/v1/:path*',
      },
    ];
  },
  */
};

export default nextConfig;
