/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
    ],
  },
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
