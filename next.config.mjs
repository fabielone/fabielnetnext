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
        pathname: '/**', // This covers all paths under the domain
      },
      {
        protocol: 'https',
        hostname: 'blog.fabiel.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      }
    ],
  },

  // .
  
  // Optionally, add any other Next.js config below
  async rewrites() {
    // Only add WordPress rewrites if the URL is configured
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    if (!wordpressUrl) {
      return [];
    }
    
    return [
      {
        source: '/:locale/wp-json/:path*',
        destination: `${wordpressUrl}/wp-json/:path*`,
      },
    ];
  },
};



// Combine all plugins
export default withNextIntl(nextConfig);