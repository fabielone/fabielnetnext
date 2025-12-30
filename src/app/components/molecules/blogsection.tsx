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
    <div className="flex flex-col items-center py-16 bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {t('title')}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Blog Cards Carousel */}
      <div className="relative w-full overflow-hidden">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg z-20 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 border border-slate-200 dark:border-slate-600"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-slate-700 dark:text-white w-4 h-4" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg z-20 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 border border-slate-200 dark:border-slate-600"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-slate-700 dark:text-white w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-8">
        <a 
          href="https://blog.fabiel.net"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 font-semibold"
        >
          <FaBookReader className="w-5 h-5" />
          {t('cta')}
        </a>
      </div>
    </div>
  );
}