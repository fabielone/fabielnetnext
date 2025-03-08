// components/molecules/MobileMenuItem.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { MobileMenuItemProps } from '../../types/navigation';

export const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ 
  item, 
  isOpen, 
  onToggle, 
  onNavigate 
}) => {
  if (item.path) {
    return (
      <Link
        href={item.path}
        className="block text-gray-800  hover:text-gray-600  px-3 py-2 rounded-md text-sm font-medium"
        onClick={onNavigate}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div className="text-gray-800  hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full"
      >
        <span>{item.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'transform rotate-90' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pl-4">
          {item.subItems?.map((subItem, subIndex) => (
            <div key={subIndex} className="mt-2">
              <p className="text-gray-800  font-semibold">
                {subItem.name}
              </p>
              <div>
                {subItem.subSections?.map((subSection, subSecIndex) => (
                  <Link
                    key={subSecIndex}
                    href={subSection.path}
                    className="block text-gray-600  hover:text-gray-800  py-1"
                    onClick={onNavigate}
                  >
                    {subSection.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};