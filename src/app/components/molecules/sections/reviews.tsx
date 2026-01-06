'use client';

import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { reviews } from '../../config/reviews';
import { useLocale } from 'next-intl';

const ReviewCard = ({ review }: { review: { text: string; author: string; verified: string } }) => (
  <div className="inline-block mx-4 p-6 min-w-[300px] max-w-[400px] bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
    <div className="relative flex flex-col h-full">
      {/* Quote icon */}
      <div className="absolute -top-8 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
        <FaQuoteLeft className="text-white text-lg" />
      </div>

      {/* Star rating */}
      <div className="flex justify-end mb-4">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-amber-400 w-4 h-4" />
        ))}
      </div>

      {/* Review text */}
      <div className="flex-grow mb-4">
        <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed whitespace-normal">
          &quot;{review.text}&quot;
        </p>
      </div>

      {/* Author info */}
      <div className="flex items-start mt-auto pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-500 dark:to-slate-700 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">
          {review.author.charAt(0)}
        </div>
        <div className="ml-3 flex-grow min-w-0">
          <p className="text-slate-900 dark:text-white font-semibold truncate">
            {review.author}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{review.verified}</p>
        </div>
      </div>
    </div>
  </div>
);

const ReviewsScroller = () => {
  const locale = useLocale();
  let currentReviews: { text: string; author: string; verified: string }[] = [];
  if (Array.isArray(reviews)) {
    currentReviews = reviews;
  } else {
    const r = reviews as any;
    currentReviews = r[locale as string] ?? r.en ?? [];
  }

  return (
    <div className="relative py-16 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full filter blur-3xl bg-blue-100 dark:bg-blue-900/30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full filter blur-3xl bg-amber-100 dark:bg-amber-900/30" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Trusted by Thousands
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          See what our clients have to say
        </p>
      </div>

      {/* Reviews scroller */}
      <div className="relative">
        {/* Gradient overlay left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10" />
        
        {/* Gradient overlay right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10" />

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