import { baseUrl } from 'src/app/sitemap';
import { getBlogPosts } from 'src/app/[locale]/blog/utils';

export async function GET() {
  try {
    // Get all blog posts across all locales
    let allBlogs = (await getBlogPosts()).flat();

    const itemsXml = allBlogs
      .sort((a, b) => {
        if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
          return -1;
        }
        return 1;
      })
      .map(
        (post) =>
          `<item>
            <title>${post.metadata.title}</title>
            <link>${baseUrl}/${post.locale}/blog/${post.slug}</link>
            <description>${post.metadata.summary || ''}</description>
            <pubDate>${new Date(
              post.metadata.publishedAt
            ).toUTCString()}</pubDate>
          </item>`
      )
      .join('\n');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
          <title>My Portfolio</title>
          <link>${baseUrl}</link>
          <description>This is my portfolio RSS feed</description>
          ${itemsXml}
      </channel>
    </rss>`;

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}