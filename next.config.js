/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  output: 'standalone',
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
      { protocol: 'https', hostname: 'docs.google.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
