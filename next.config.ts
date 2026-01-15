import type { NextConfig } from "next";

// [Polyfill] Fix Undici/Nodes 'ReferenceError: ProgressEvent is not defined'
if (typeof ProgressEvent === 'undefined') {
  // @ts-ignore
  global.ProgressEvent = class ProgressEvent { };
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint config is handled via eslint.config.mjs in Next.js 15+ / Flat Config
  // eslint: { ignoreDuringBuilds: true },
  // Output: 'export' removed to enable Server Side Rendering and API Routes for backend integration
  // basePath removed for standard root deployment
  serverExternalPackages: ['@prisma/client'],

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
