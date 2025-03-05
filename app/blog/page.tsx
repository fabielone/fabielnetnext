// app/blog/page.tsx (Server Component)
import BlogLayout from '../components/layout/blog-layout';

export const metadata = {
  title: 'Blog',
  description: 'Insights, stories, and ideas worth sharing.',
};

export default function Page() {
  // Move the blogPosts array inside the component
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Development: AI and No-Code Solutions",
      excerpt: "Exploring how artificial intelligence and no-code platforms are reshaping the landscape of web development...",
      date: "December 15, 2023",
      readTime: "8 min read",
      category: "Technology",
      image: "/images/post1.jpg",
      author: {
        name: "John Doe",
        avatar: "/images/author1.jpg"
      },
      tags: ["AI", "Web Development", "Technology"]
    },
    {
      id: 2,
      title: "Designing for Accessibility: A Complete Guide",
      excerpt: "Learn how to create inclusive digital experiences that work for everyone...",
      date: "December 14, 2023",
      readTime: "6 min read",
      category: "Design",
      image: "/images/post2.jpg",
      author: {
        name: "Jane Smith",
        avatar: "/images/author2.jpg"
      },
      tags: ["Design", "Accessibility", "UX"]
    },
    // Add more posts as needed
  ];

  return <BlogLayout posts={blogPosts} />;
}