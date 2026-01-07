import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output: 'export' removed to enable Server Side Rendering and API Routes for backend integration
  // basePath removed for standard root deployment

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
