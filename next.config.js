/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'placehold.co',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'fabielone.s3.us-west-1.amazonaws.com',
          port: '',
          pathname: '/portfolio/**',
        },
        // Add other patterns as needed
      ],
    },
};

module.exports = withNextIntl(nextConfig);