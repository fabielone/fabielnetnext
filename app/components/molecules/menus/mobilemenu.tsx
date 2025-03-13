// components/organisms/MobileMenu.tsx
'use client';

import { useRef } from 'react';
import { NavItem } from '../../types/navigation';
import Link from 'next/link';
import { SocialIcons } from '../socials/socialicons';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  openCategories: Record<string, boolean>;
  onToggleCategory: (category: string) => void;
  onNavigate: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  openCategories,
  onToggleCategory,
  onNavigate,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="md:hidden mt-2">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {/* Log In Link */}
        <Link
          href="/login"
          className="block text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          onClick={onNavigate} // Add onNavigate here
        >
          Iniciar Sesión
        </Link>

        {/* Register Link */}
        <Link
          href="/join"
          className="block text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          onClick={onNavigate} // Add onNavigate here
        >
          Registrarse
        </Link>

        {/* Navigation Items */}
        {navItems.map((item, index) => (
          <div key={index}>
            {item.path ? (
              <Link
                href={item.path}
                className="block text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={onNavigate}
              >
                <span>{item.name}</span>
              </Link>
            ) : (
              <div className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                <button
                  onClick={() => onToggleCategory(item.name)}
                  className="flex items-center justify-between w-full"
                >
                  <span>{item.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openCategories[item.name] ? 'transform rotate-90' : ''
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
                {openCategories[item.name] && (
                  <div className="pl-4">
                    {item.subItems?.map((subItem, subIndex) => (
                      <div key={subIndex} className="mt-2">
                        <p className="text-gray-800 font-semibold">
                          <span>{subItem.name}</span>
                        </p>
                        <div>
                          {subItem.subSections?.map((subSection, subSecIndex) => (
                            <Link
                              key={subSecIndex}
                              href={subSection.path}
                              className="block text-gray-600 hover:text-gray-800 py-1"
                              onClick={onNavigate}
                            >
                              <span>{subSection.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Social Icons */}
        <div onClick={onNavigate}> {/* Wrap SocialIcons in a div and add onNavigate */}
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};