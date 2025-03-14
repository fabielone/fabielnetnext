// components/atoms/Logo.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes'; // Make sure to install and setup next-themes
import { useState, useEffect } from 'react';

interface LogoProps {
  onClick: () => void;
}

export const Logo = ({ onClick }: LogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex-shrink-0">
      <Link href="/" className="text-xl font-bold text-gray-800" onClick={onClick}>
        <div className="relative">
          {/* Desktop logo */}
          <div className="hidden md:block p-6">
            <Image
              src={theme === 'dark' ? '/darklogo.jpeg' : '/logo.jpeg'}
              alt="Company Logo"
              width={150}
              height={50}
              className="w-[150px] h-auto my-6"
              priority
            />
          </div>
          
          {/* Mobile logo (larger size) */}
          <div className="md:hidden">
            <Image
              src={theme === 'dark' ? '/darklogo.jpeg' : '/logo.jpeg'}
              alt="Company Logo"
              width={180} // Larger width for mobile
              height={60} // Proportionally larger height
              className="w-[120px] h-auto" // Responsive width
              priority
            />
          </div>
        </div>
      </Link>
    </div>
  );
};