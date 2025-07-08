import { baseUrl } from 'src/app/sitemap';

// Define your hardcoded RSS feed items
const hardcodedFeedItems = [
  {
    title: 'My Latest Project',
    link: `${baseUrl}/projects/latest`,
    description: 'Check out my newest portfolio project',
    pubDate: new Date('2023-11-15').toUTCString()
  },
  {
    title: 'Web Development Tips',
    link: `${baseUrl}/blog/web-dev-tips`,
    description: 'My collection of useful web development tips',
    pubDate: new Date('2023-10-20').toUTCString()
  },
  {
    title: 'About Me',
    link: `${baseUrl}/about`,
    description: 'Learn more about my background and skills',
    pubDate: new Date('2023-09-10').toUTCString()
  }
];

export async function GET() {
  try {
    const itemsXml = hardcodedFeedItems
      .map(
        (item) =>
          `<item>
            <title>${item.title}</title>
            <link>${item.link}</link>
            <description>${item.description}</description>
            <pubDate>${item.pubDate}</pubDate>
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