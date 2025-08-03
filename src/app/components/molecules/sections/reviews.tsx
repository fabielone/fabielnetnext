'use client';

import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { reviews } from '../../config/reviews';
import { useLocale } from 'next-intl';

const ReviewCard = ({ review }) => (
  <div className="inline-block mx-4 p-6 min-w-[300px] max-w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700">
    <div className="relative flex flex-col h-full">
      {/* Quote icon with gradient background */}
      <div className="absolute -top-8 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center shadow-md">
        <FaQuoteLeft className="text-amber-500 dark:text-amber-300 text-xl" />
      </div>

      {/* Star rating */}
      <div className="flex justify-end mb-4">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-amber-400 dark:text-amber-300 w-4 h-4" />
        ))}
      </div>

      {/* Review text */}
      <div className="flex-grow mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-normal">
          &apos;{review.text}&apos;
        </p>
      </div>

      {/* Author info */}
      <div className="flex items-start mt-auto pt-4 border-t border-amber-100 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-600 flex-shrink-0 flex items-center justify-center text-amber-700 dark:text-amber-200 font-bold text-lg">
          {review.author.charAt(0)}
        </div>
        <div className="ml-3 flex-grow min-w-0">
          <p className="text-gray-800 dark:text-gray-100 font-semibold truncate">
            {review.author}
          </p>
          <p className="text-amber-500 dark:text-amber-400 text-sm">{review.verified}</p>
        </div>
      </div>
    </div>
  </div>
);

const ReviewsScroller = () => {
  const locale = useLocale();
  const currentReviews = reviews[locale as keyof typeof reviews] || reviews.en;

  return (
    <div className="relative py-12 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full filter blur-3xl bg-amber-100 dark:bg-amber-900" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl bg-amber-100 dark:bg-amber-900" />
      </div>

      {/* Reviews scroller */}
      <div className="relative">
        {/* Gradient overlay left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-amber-50 dark:from-gray-900 to-transparent z-10" />
        
        {/* Gradient overlay right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-50 dark:from-gray-900 to-transparent z-10" />

        {/* Scrolling content */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-scroll p-4 inline-flex">
            {[...currentReviews, ...currentReviews].map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsScroller;