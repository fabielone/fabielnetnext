// components/atoms/Logo.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

interface LogoProps {
  onClick: () => void;
}

export const Logo = ({ 
  onClick
}: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent navigation if already on homepage
    // Check if current path is root or locale-based home (/, /en, /en/)
    const normalizedPath = pathname.endsWith('/') && pathname.length > 1 
      ? pathname.slice(0, -1) 
      : pathname;
    
    const isHomePage = normalizedPath === '/' || 
                      normalizedPath === '/en' ||
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