import createNextIntlPlugin from 'next-intl/plugin';


const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // Add images configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add other image hosts as needed
    ],
  },

  images: {
    domains: [
      'blog.fabiel.net',
      // Add other domains if needed
    ],
  },
  // .
  
  // Optionally, add any other Next.js config below
  async rewrites() {
    return [
      {
        source: '/:locale/wp-json/:path*',
        destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/:path*`,
      },
    ];
  },
};



// Combine all plugins
export default withNextIntl(nextConfig);