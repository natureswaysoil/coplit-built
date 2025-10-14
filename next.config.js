/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  output: 'standalone', // For Cloud Run
  eslint: {
    // Temporary: allow production builds despite ESLint errors. Cleanup pending.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'video.pictory.ai' },
      { protocol: 'https', hostname: 'd3uryq9bhgb5qr.cloudfront.net' },
      { protocol: 'https', hostname: 'd3uryq9bhgb5qr.cloudfront.net', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [ // Add Cloud Run/other domains here
      'm.media-amazon.com',
      'docs.google.com',
      // Add other image domains you use
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        has: [ { type: 'header', key: 'stripe-signature' } ],
        destination: '/api/webhooks/stripe',
      },
    ];
  },
};

module.exports = nextConfig;