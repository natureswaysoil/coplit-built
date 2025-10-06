/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'video.pictory.ai',
      },
      {
        protocol: 'https',
        hostname: 'd3uryq9bhgb5qr.cloudfront.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  async rewrites() {
    return [
      // Safety net: if Stripe is configured to POST to the site root, route it to the webhook handler
      {
        source: '/',
        has: [
          { type: 'header', key: 'stripe-signature' },
        ],
        destination: '/api/webhooks/stripe',
      },
    ]
  },
};

module.exports = nextConfig;
