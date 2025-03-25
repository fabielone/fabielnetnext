// components/blog/BlogCarousel.tsx
'use client';

import { useState, useRef, type JSX } from 'react';
import BlogCard from '../cards/blogcard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Author {
  name: string;
  avatar: string;
}

interface Blog {
  title: string;
  description: string;
  image: string;
  date: string;
  author: Author;
  category: string;
  slug: string;
  readTime: string;
}

interface BlogCarouselProps {
  title?: string;
  description?: string;
  blogs: Blog[];
  tag?: string;
  variant?: 'default' | 'featured' | 'minimal';
  showHeader?: boolean;
  showCTA?: boolean;
  CTAText?: string;
  CTALink?: string;
  className?: string;
}

export default function BlogCarousel({
  title = "Explora Nuestro Blog",
  description = "",
  blogs = [],
  variant = 'default',
  showHeader = true,
  showCTA = true,
  CTAText = "Ver Biblioteca Completa",
  CTALink = "/blog",
  className = "",
}: BlogCarouselProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const handleScroll = (direction: 'left' | 'right'): void => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (!container) return;

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    updateArrowVisibility();
  };

  const updateArrowVisibility = (): void => {
    const container = scrollRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < (container.scrollWidth - container.clientWidth)
    );
  };

  const variantStyles = {
    default: {
      container: "py-12 bg-gradient-to-t from-amber-100 to-white",
      wrapper: "px-4 sm:px-8",
      cardWidth: "w-[300px] sm:w-[350px]",
      gap: "gap-4 sm:gap-6"
    },
    featured: {
      container: "py-8 bg-white",
      wrapper: "px-4 sm:px-6 ",
      cardWidth: "w-full sm:w-[400px] lg:w-[500px]",
      gap: "gap-6 sm:gap-8"
    },
    minimal: {
      container: "py-6",
      wrapper: "px-2 sm:px-4",
      cardWidth: "w-[250px] sm:w-[300px]",
      gap: "gap-3 sm:gap-4"
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`flex font-serif flex-col items-center ${styles.container} ${className}`}>
      {/* Header Section */}
      {showHeader && (
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2 sm:mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {description}
          </p>
        </div>
      )}

      {/* Blog Cards Carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10" />
        
        <div className={`relative ${styles.wrapper}`}>
          <div 
            ref={scrollRef}
            className={`flex overflow-x-auto scrollbar-hide items-stretch ${styles.gap}`}
            onScroll={updateArrowVisibility}
          >
            {blogs.map((blog, index) => (
              <div key={index} className={`flex-none ${styles.cardWidth}`}>
                <BlogCard {...blog} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-20 hover:bg-white transition-all duration-300"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-800 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-20 hover:bg-white transition-all duration-300"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-800 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {showCTA && (
        <div className="text-center mt-6 sm:mt-8">
          <a 
            href={CTALink}
            className="inline-flex items-center gap-2 bg-amber-200 text-slate-900 px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-amber-300 transition-colors duration-300 font-semibold text-sm sm:text-base"
          >
            {CTAText}
          </a>
        </div>
      )}
    </div>
  );
}