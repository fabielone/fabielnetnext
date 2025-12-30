'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface BlogCardProps {
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
  readTime?: string;
}

export default function BlogCard({
  title,
  description,
  image,
  date,
  author,
  category,
  slug,
  readTime = '5 min'
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('blogCard');

  return (
    <Link href={`/blog/${slug}`}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/50 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-slate-900/70 cursor-pointer h-full flex flex-col border border-slate-200 dark:border-slate-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            style={{
              filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
            }}
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md">
            {category}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          {/* Date and Read Time */}
          <div className="flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
            <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
            <span>{readTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 break-words whitespace-normal leading-snug line-clamp-3 min-h-[4.5rem] sm:min-h-[5.25rem] transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 break-words line-clamp-2 whitespace-normal flex-grow">
            {description}
          </p>

          {/* Author Info and Read More */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                  {author.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('authorLabel')}
                </span>
              </div>
            </div>

            {/* Read More Link */}
            <div className="inline-flex items-center group">
              <span className="text-sm sm:text-base text-amber-600 dark:text-amber-400 font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                {t('readMore')}
              </span>
              <svg
                className={`ml-1 sm:ml-2 w-4 h-4 transition-transform duration-300 ${
                  isHovered ? 'transform translate-x-2' : ''
                } text-amber-600 dark:text-amber-400`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}