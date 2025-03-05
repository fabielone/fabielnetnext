// components/atoms/HamburgerButton.tsx
'use client';

interface HamburgerButtonProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick }) => (
  <div className="flex md:hidden">
    <button
      onClick={onClick}
      className="text-gray-800 dark:text-white focus:outline-none menu-icon"
      aria-label="Toggle menu"
    >
      <svg
        className="h-6 w-6"
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
    </button>
  </div>
);