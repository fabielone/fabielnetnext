const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration for path types
const PAGE_TYPES = {
  landing: ['Home', 'Main', 'Index', 'Landing'],
  product: ['Product', 'Catalog', 'Shop'],
  blog: ['Blog', 'Article', 'Post'],
  service: ['Service', 'Offering'],
  about: ['About', 'Team', 'Company']
};

function crawlPages() {
  const pagesDir = path.join(process.cwd(), './src/app/');
  const configPath = path.join(process.cwd(), './scripts/site-config.json');

  // Find all page.tsx files
  const pageFiles = glob.sync(`${pagesDir}/**/page.{tsx,ts,js}`);

  // Existing config or new config
  let siteConfig = {};
  try {
    siteConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    siteConfig = { pages: {} };
  }

  // Reset pages in config
  siteConfig.pages = {};

  // Crawl and categorize pages
  pageFiles.forEach(file => {
    // Get relative path from the app directory
    const relativePath = path.relative(pagesDir, file);
    
    // Construct route
    const routeParts = path.dirname(relativePath).split(path.sep);
    const route = '/' + routeParts.join('/') + (routeParts.length > 0 ? '' : '');
    
    // Determine page type
    const pageType = Object.keys(PAGE_TYPES).find(type => 
      PAGE_TYPES[type].some(keyword => 
        routeParts.some(part => part.toLowerCase().includes(keyword.toLowerCase()))
      )
    ) || 'generic';

    // Update or add page to config
    siteConfig.pages[route] = {
      path: route,
      type: pageType,
      file: relativePath
    };
  });

  // Write updated config
  fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));
  console.log('Site configuration updated successfully');
}

crawlPages();