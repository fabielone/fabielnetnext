'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
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
  readTime = "5 min"
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
          {category}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readTime}</span>
          <span className="mx-2">•</span>
          <span>{author}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Read More Button */}
        <Link 
          href={`/blog/${slug}`}
          className="inline-flex items-center group"
        >
          <span className="text-yellow-600 font-semibold group-hover:text-yellow-700">
            Leer más
          </span>
          <svg
            className={`ml-2 w-4 h-4 transition-transform duration-300 ${
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
        </Link>
      </div>
    </div>
  );
}