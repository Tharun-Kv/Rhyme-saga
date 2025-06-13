import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Required for static export
  basePath: '/Rhyme-saga', // Replace with your GitHub repo name
  trailingSlash: true, // Needed for GitHub Pages routing

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
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
