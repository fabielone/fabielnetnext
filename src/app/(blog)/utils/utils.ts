import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { BlogPost, BlogPostMetadata } from './types'; // You'll need to define these types

// Define the base directory for blog posts
const BLOG_POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

export async function getBlogPosts(): Promise<BlogPost[][]> {
  // Get all available locales (folders in the blog directory)
  const locales = await readdir(BLOG_POSTS_DIR);
  
  // Fetch posts for each locale in parallel
  const postsByLocale = await Promise.all(
    locales.map(async (locale) => {
      const localeDir = path.join(BLOG_POSTS_DIR, locale);
      const postSlugs = await readdir(localeDir);
      
      // Process each post in the locale
      const posts = await Promise.all(
        postSlugs.map(async (slug) => {
          const postPath = path.join(localeDir, slug, 'index.mdx');
          const source = await readFile(postPath, 'utf-8');
          
          // Extract frontmatter and compile MDX
          const { frontmatter } = await compileMDX<BlogPostMetadata>({
            source,
            options: { parseFrontmatter: true }
          });
          
          return {
            locale,
            slug: slug.replace(/\.mdx?$/, ''),
            metadata: frontmatter,
            content: source // Optional: include if you need the content elsewhere
          };
        })
      );
      
      return posts;
    })
  );
  
  return postsByLocale;
}

// Optional: Function to get a single blog post
export async function getBlogPost(locale: string, slug: string): Promise<BlogPost | null> {
  try {
    const postPath = path.join(BLOG_POSTS_DIR, locale, slug, 'index.mdx');
    const source = await readFile(postPath, 'utf-8');
    
    const { frontmatter, content } = await compileMDX<BlogPostMetadata>({
      source,
      options: { parseFrontmatter: true }
    });
    
    return {
      locale,
      slug,
      metadata: frontmatter,
     // content
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug} for locale ${locale}:`, error);
    return null;
  }
}
