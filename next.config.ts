import type { NextConfig } from 'next';
const nextConfig = {
  output: 'export',
  basePath: '/Rhyme-saga', // very important for GitHub Pages
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // make this flexible if you're using external images
      },
    ],
  },
};

export default nextConfig;

