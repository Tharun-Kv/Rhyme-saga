import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // 👈 required for static export
  basePath: '/Rhyme-saga', // 👈 match your repo name exactly
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // 👈 required for GitHub Pages
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
