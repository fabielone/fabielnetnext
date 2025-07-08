'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

  return (
    <Link href={`/blog/${slug}`}>
      <div 
        className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer h-full flex flex-col"
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
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {category}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          {/* Date and Read Time */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
            <time dateTime={date}>{date}</time>
            <span className="mx-2">•</span>
            <span>{readTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 break-words whitespace-normal leading-snug">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-4 break-words line-clamp-2 whitespace-normal flex-grow">
            {description}
          </p>

          {/* Author Info and Read More */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {author.name}
                </span>
                <span className="text-xs text-gray-500">
                  Author
                </span>
              </div>
            </div>

            {/* Read More Link */}
            <div className="inline-flex items-center group">
              <span className="text-sm sm:text-base text-yellow-600 font-semibold group-hover:text-yellow-700">
                Leer más
              </span>
              <svg
                className={`ml-1 sm:ml-2 w-4 h-4 transition-transform duration-300 ${
                  isHovered ? 'transform translate-x-2' : ''
                }`}
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