'use client';

import { useState, useRef } from 'react';
import BlogCard from './cards/blogcard';
import { FaChevronLeft, FaChevronRight, FaBookReader } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface Blog {
  title: string;
  description: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  slug: string;
  readTime: string;
}

export default function BlogList() {
  const t = useTranslations('blogSection');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const blogs = t.raw('posts').map((post: any) => ({
    ...post,
    image: 'https://placehold.co/600x400/png',
    date: '2024-01-15',
    author: {
      name: 'Fabiel Ramirez',
      avatar: '/'
    },
    slug: post.title.toLowerCase().replace(/\s+/g, '-'),
    readTime: '5 min'
  }));

  const handleScroll = (direction: 'left' | 'right'): void => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (!container) return;

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setTimeout(() => {
      if (!container) return;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < (container.scrollWidth - container.clientWidth)
      );
    }, 100);
  };

  const handleScrollCheck = (): void => {
    const container = scrollRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < (container.scrollWidth - container.clientWidth)
    );
  };

  return (
    <div className="flex flex-col items-center py-12 bg-gradient-to-t from-amber-100 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {t('title')}
        </h2>
        <p className="text-slate-600 dark:text-gray-300 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Blog Cards Carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10" />
      
        <div className="relative px-8">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto whitespace-nowrap gap-6 py-4 scrollbar-hide items-center"
            onScroll={handleScrollCheck}
          >
            {blogs.map((blog: Blog, index: number) => (
              <div key={index} className="w-[300px] flex-none">
                <BlogCard {...blog} />
              </div>
            ))}
          </div>

          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full shadow-lg z-20 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-800 dark:text-white w-5 h-5" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full shadow-lg z-20 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-800 dark:text-white w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-2">
        <a 
          href="/blog"
          className="inline-flex items-center gap-2 bg-amber-200 dark:bg-amber-600 text-slate-900 dark:text-white px-2 py-3 rounded-lg hover:bg-amber-300 dark:hover:bg-amber-500 transition-colors duration-300 font-semibold"
        >
          <FaBookReader className="w-5 h-5" />
          {t('cta')}
        </a>
      </div>
    </div>
  );
}