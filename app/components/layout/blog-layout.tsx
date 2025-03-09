// app/blog/blog-layout.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchAndCategories from '../molecules/blog/searchandcategories';
import Newsletter from '../molecules/newsletter/subscribe';

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

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  const filteredPosts = latestPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Header Section */}
      <header className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-2 sm:mb-4">
          The Daily Insight
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Where ideas meet innovation
        </p>
      </header>

     
        {/* Search and Categories */}
        <SearchAndCategories
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

      {/* Featured Article */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <Link href={`/blog/${featuredPost.id}`}>
          <article className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900">
            <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] w-full">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
            </div>
            
            <div className="absolute bottom-0 p-4 sm:p-6 lg:p-8">
              <span className="inline-block px-3 py-1 mb-2 sm:mb-4 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm">
                {featuredPost.category}
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-2 sm:mb-4 group-hover:text-gray-200 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-none">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <Image
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                />
                <div className="text-white">
                  <p className="font-medium text-sm sm:text-base">{featuredPost.author.name}</p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {featuredPost.date} · {featuredPost.readTime}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>

      {/* Latest Articles Grid */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-40 sm:h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <span className="text-xs sm:text-sm text-blue-600 font-medium">
                    {post.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mt-1 sm:mt-2 mb-2 sm:mb-3">
                    {post.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className="rounded-full w-7 h-7 sm:w-8 sm:h-8"
                    />
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm font-medium">{post.author.name}</p>
                      <p className="text-xs text-gray-500">
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
      <aside className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="sm:col-span-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-8">Popular Articles</h2>
          {/* Add popular articles here */}
        </div>
        
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 sm:mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {categories.slice(1).map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter Subscription Form */}
                       <Newsletter
                       variant='light'
                       title='Noticias, Consejos y mas '
                       /> 
        </div>
      </aside>
    </div>
  );
}