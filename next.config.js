const path = require('path');

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
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@stripe/react-stripe-js': path.resolve(__dirname, 'lib/stripe-react-stub.tsx'),
      stripe: path.resolve(__dirname, 'lib/stripe-stub.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
