'use client';

import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { reviews1 } from '../../config/reviews';

const ReviewCard = ({ review }) => (
  <div className="inline-block mx-4 p-6 min-w-[300px] max-w-[400px] bg-white rounded-2xl shadow-lg border border-amber-100">
    <div className="relative flex flex-col h-full">
      {/* Quote icon with gradient background */}
      <div className="absolute -top-8 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-md">
        <FaQuoteLeft className="text-amber-500 text-xl" />
      </div>

      {/* Star rating */}
      <div className="flex justify-end mb-4">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-amber-400 w-4 h-4" />
        ))}
      </div>

      {/* Review text - with fixed height and scroll if needed */}
      <div className="flex-grow mb-4">
        <p className="text-gray-700 text-lg leading-relaxed whitespace-normal">
          &apos;{review.text}&apos;
        </p>
      </div>

      {/* Author info - now in a fixed position at bottom */}
      <div className="flex items-start mt-auto pt-4 border-t border-amber-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex-shrink-0 flex items-center justify-center text-amber-700 font-bold text-lg">
          {review.author.charAt(0)}
        </div>
        <div className="ml-3 flex-grow min-w-0"> {/* min-w-0 helps with text truncation */}
          <p className="text-gray-800 font-semibold truncate">
            {review.author}
          </p>
          <p className="text-amber-500 text-sm">Cliente Verificado ✓</p>
        </div>
      </div>
    </div>
  </div>
);

const ReviewsScroller = () => {
  return (
    <div className="relative py-12 bg-white overflow-hidden ">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96  rounded-full filter blur-3xl" />
      </div>

      {/* Reviews scroller */}
      <div className="relative">
        {/* Gradient overlay left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-amber-50 to-transparent z-10" />
        
        {/* Gradient overlay right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-50 to-transparent z-10" />

        {/* Scrolling content */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-scroll p-4 inline-flex">
            {[...reviews1, ...reviews1].map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsScroller;