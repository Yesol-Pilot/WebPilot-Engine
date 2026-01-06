// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
