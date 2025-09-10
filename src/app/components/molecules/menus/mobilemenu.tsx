// components/molecules/menus/MobileMenu.tsx
'use client';

import { FC, useRef } from 'react';
import { NavItem } from '../../types/navigation';
import Link from 'next/link';
import { SocialIcons } from '../socials/socialicons';
import { IoMdArrowForward } from 'react-icons/io';
import { useTranslations } from 'next-intl';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  openCategories: Record<string, boolean>;
  onToggleCategory: (category: string) => void;
  onNavigate: () => void;
}

export const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  openCategories,
  onToggleCategory,
  onNavigate,
}) => {
  const t = useTranslations('nav');
  const normalizeKey = (key: string) => key.startsWith('nav.') ? key.slice(4) : key;
  const menuRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="md:hidden mt-2">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {/* Log In Link */}
        <Link
          href="/login"
          className="block text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          onClick={onNavigate}
        >
          {t('mobile.login')}
        </Link>

        {/* Register Link */}
        <Link
          href="/join"
          className="block text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          onClick={onNavigate}
        >
          {t('mobile.register')}
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
                <span>{t(normalizeKey(item.name))}</span>
              </Link>
            ) : (
              <div className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                <button
                  onClick={() => onToggleCategory(item.name)}
                  className="flex items-center justify-between w-full"
                >
                  <span>{t(normalizeKey(item.name))}</span>
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
                          <span>{t(normalizeKey(subItem.name))}</span>
                        </p>
                        <div>
                          {subItem.subSections?.map((subSection, subSecIndex) => (
                            <Link
                              key={subSecIndex}
                              href={subSection.path}
                              className="flex items-center text-gray-600 hover:text-gray-800 py-1"
                              onClick={onNavigate}
                            >
                              <IoMdArrowForward 
                                className="mr-2 text-gray-500" 
                              />
                              <span>{t(normalizeKey(subSection.name))}</span>
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
        <div onClick={onNavigate}>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};