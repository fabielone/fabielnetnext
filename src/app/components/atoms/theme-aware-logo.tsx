'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ThemeAwareLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function ThemeAwareLogo({ 
  width = 48, 
  height = 30, 
  className = 'opacity-90 sm:w-18 sm:h-6' 
}: ThemeAwareLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a neutral placeholder during hydration
  if (!mounted) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
        style={{ width, height }}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Image
      src={isDark ? '/darklogo.png' : '/logo.png'}
      alt="Fabiel.Net Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
