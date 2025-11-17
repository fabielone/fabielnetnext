// components/atoms/Logo.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/twmerge'; // Assuming you're using clsx or tailwind-merge

interface LogoProps {
  onClick: () => void;
  minWidth?: number | string; // Optional minimum width (number for px or string for any unit)
  maxWidth?: number | string; // Optional maximum width
  inline?: boolean; // Whether to display inline (default: false)
  centerVertically?: boolean; // Whether to center vertically when inline (default: false)
}

export const Logo = ({ 
  onClick, 
  minWidth = 100, // Default minimum width
  maxWidth,
  inline = false,
  centerVertically = false
}: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent navigation if already on homepage
    // Check if current path is root or locale-based home (/, /en, /es, /en/, /es/)
    const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
      ? pathname.slice(0, -1) 
      : pathname;
    
    const isHomePage = normalizedPath === '/' || 
                      normalizedPath === '/en' || 
                      normalizedPath === '/es' ||
                      normalizedPath.match(/^\/[a-z]{2}$/);
    
    if (isHomePage) {
      e.preventDefault();
      e.stopPropagation();
      // Still call onClick to close mobile menu if needed
      onClick();
      return;
    }
    onClick();
  };

  // Show placeholder during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-[100px] h-[40px] md:w-[150px] md:h-[50px]" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  // Extract locale from pathname (e.g., /en/somepage -> /en, /es -> /es)
  const getHomeLink = () => {
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    if (localeMatch) {
      return `/${localeMatch[1]}`;
    }
    return '/';
  };

  // Convert numeric width to px string if needed
  const formatWidth = (width: number | string | undefined) => {
    if (typeof width === 'number') return `${width}px`;
    return width;
  };

  const containerClasses = cn(
    {
      'inline-flex': inline,
      'items-center': centerVertically && inline,
    }
  );

  const logoStyle = {
    minWidth: formatWidth(minWidth),
    maxWidth: formatWidth(maxWidth),
  };

  return (
    <Link href={getHomeLink()} className="text-xl font-bold text-gray-800 block" onClick={handleLogoClick}>
      <div className="relative">
        {/* Desktop logo */}
        <div className="hidden md:block py-2">
          <Image
            src={isDark ? '/darklogo.png' : '/logo.png'}
            alt="Company Logo"
            width={150}
            height={50}
            className="w-[150px] h-auto"
            priority
          />
        </div>
        
        {/* Mobile logo */}
        <div className="md:hidden">
          <Image
            src={isDark ? '/darklogo.png' : '/logo.png'}
            alt="Company Logo"
            width={120}
            height={40}
            className="w-[100px] h-auto"
            priority
          />
        </div>
      </div>
    </Link>
  );
};