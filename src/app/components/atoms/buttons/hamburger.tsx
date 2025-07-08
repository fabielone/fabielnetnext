// components/atoms/HamburgerButton.tsx
'use client';
import React from 'react'

type HamburgerButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  buttonTextColor?: string; // Make it optional with a default value
  iconClassName?: string; // Allow customizing the SVG icon
};

const HamburgerIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || 'h-6 w-6'}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

export function HamburgerButton({
  onClick,
  buttonTextColor = 'text-black',
  iconClassName,
}: HamburgerButtonProps) {
  return (
    <div className="flex md:hidden">
      <button
        onClick={onClick}
        className={`${buttonTextColor} focus:outline-none menu-icon`}
        aria-label="Toggle menu"
      >
        <HamburgerIcon className={iconClassName} />
      </button>
    </div>
  );
}