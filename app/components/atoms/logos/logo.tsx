// components/atoms/Logo.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Convert numeric width to px string if needed
  const formatWidth = (width: number | string | undefined) => {
    if (typeof width === 'number') return `${width}px`;
    return width;
  };

  const containerClasses = cn(
    'flex-shrink-0',
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
    <div className={containerClasses} style={logoStyle}>
      <Link href="/" className="text-xl font-bold text-gray-800" onClick={onClick}>
        <div className="relative">
          {/* Desktop logo */}
          <div className="hidden md:block p-6">
            <Image
              src={theme === 'dark' ? '/darklogo.png' : '/logo.png'}
              alt="Company Logo"
              width={150}
              height={50}
              className="w-[150px] h-auto my-6"
              priority
            />
          </div>
          
          {/* Mobile logo */}
          <div className="md:hidden">
            <Image
              src={theme === 'dark' ? '/darklogo.png' : '/logo.png'}
              alt="Company Logo"
              width={180}
              height={60}
              className="w-[120px] h-auto"
              priority
            />
          </div>
        </div>
      </Link>
    </div>
  );
};