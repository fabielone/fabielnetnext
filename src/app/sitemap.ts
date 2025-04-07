export const baseUrl = 'https://fabiel.net'

export default async function sitemap() {
  const routes = [
    '',           // Home page
    '/blog',      // Blog index
    '/about',     // About page
    '/projects',  // Projects page
    '/contact'    // Contact page
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return routes;
}