// app/blog/blog-layout.tsx (Client Component)
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Development",
  "AI",
  "Culture"
];

interface Author {
  name: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: Author;
  tags: string[];
}

interface BlogLayoutProps {
  posts: BlogPost[];
}

export default function BlogLayout({ posts }: BlogLayoutProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPost = posts[0]; // Use the first post as featured
  const latestPosts = posts.slice(1); // Rest of the posts

  const filteredPosts = latestPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold mb-4">
          The Daily Insight
        </h1>
        <p className="text-gray-600 text-lg">
          Where ideas meet innovation
        </p>
      </header>

      {/* Search and Categories */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-full border-2 border-gray-200 focus:border-gray-500 focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      <div className="mb-16">
        <Link href={`/blog/${featuredPost.id}`}>
          <article className="group relative rounded-2xl overflow-hidden bg-gray-900">
            <div className="relative h-[60vh] w-full">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
            </div>
            
            <div className="absolute bottom-0 p-8 md:p-12">
              <span className="inline-block px-4 py-1 mb-4 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                {featuredPost.category}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-200 text-lg mb-6 max-w-2xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="text-white">
                  <p className="font-medium">{featuredPost.author.name}</p>
                  <p className="text-sm text-gray-300">
                    {featuredPost.date} · {featuredPost.readTime}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>

      {/* Latest Articles Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm text-blue-600 font-medium">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium">{post.author.name}</p>
                      <p className="text-sm text-gray-500">
                        {post.date} · {post.readTime}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-serif font-bold mb-8">Popular Articles</h2>
          {/* Add popular articles here */}
        </div>
        
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-serif font-bold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {categories.slice(1).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-serif font-bold mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Get the latest articles and insights in your inbox every week.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
}