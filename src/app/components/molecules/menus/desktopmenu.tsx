// components/molecules/menus/DesktopMenu.tsx
'use client';

import Link from 'next/link';
import { NavItem } from '../../types/navigation';
import { MegaMenu } from './megamenu';
import { SocialIcons } from '../socials/socialicons';
import { FC, useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface DesktopMenuProps {
  navItems: NavItem[];
  onNavigate: () => void;
}

// Normalize translation key (strip leading 'nav.' if namespace already provided via useTranslations('nav'))
const normalizeKey = (key: string) => key.startsWith('nav.') ? key.slice(4) : key;

const NavLink = ({ item, onNavigate, t }: { 
  item: NavItem, 
  onNavigate: () => void,
  t: (key: string) => string 
}) => {
  const k = normalizeKey(item.name);
  return (
    <Link
      href={item.path!}
      className="text-gray-800 dark:text-white text-center hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
      onClick={onNavigate}
    >
      <span>{t(k)}</span>
    </Link>
  );
};

const NavItemWithMegaMenu = ({ item, onNavigate, t, isOpen, onToggle }: { 
  item: NavItem, 
  onNavigate: () => void,
  t: (key: string) => string,
  isOpen: boolean,
  onToggle: () => void
}) => {
  const k = normalizeKey(item.name);
  
  const handleNavigate = () => {
    onToggle(); // Close the mega menu
    onNavigate();
  };
  
  return (
    <div 
      className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
      onClick={onToggle}
    >
      <span>{t(k)}</span>
      <MegaMenu 
        subItems={item.subItems} 
        onNavigate={handleNavigate}
        isOpen={isOpen}
      />
    </div>
  );
};

export const DesktopMenu: FC<DesktopMenuProps> = ({ navItems, onNavigate }) => {
  const t = useTranslations('nav');
  const [openMegaMenu, setOpenMegaMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMegaMenu = (index: number) => {
    setOpenMegaMenu(openMegaMenu === index ? null : index);
  };

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMegaMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="hidden lg:flex lg:items-center lg:space-x-1 justify-center text-center">
      {navItems.map((item, index) => (
        <div key={index} className="relative group">
          {item.path ? (
            <NavLink 
              item={item} 
              onNavigate={onNavigate}
              t={t}
            />
          ) : (
            <NavItemWithMegaMenu 
              item={item} 
              onNavigate={onNavigate}
              t={t}
              isOpen={openMegaMenu === index}
              onToggle={() => handleToggleMegaMenu(index)}
            />
          )}
        </div>
      ))}
      <SocialIcons />
    </div>
  );
};