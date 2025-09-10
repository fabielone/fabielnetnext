// components/molecules/menus/DesktopMenu.tsx
'use client';

import Link from 'next/link';
import { NavItem } from '../../types/navigation';
import { MegaMenu } from './megamenu';
import { SocialIcons } from '../socials/socialicons';
import { FC } from 'react';
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

const NavItemWithMegaMenu = ({ item, onNavigate, t }: { 
  item: NavItem, 
  onNavigate: () => void,
  t: (key: string) => string 
}) => {
  const k = normalizeKey(item.name);
  return (
    <div className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
      <span>{t(k)}</span>
      <MegaMenu 
        subItems={item.subItems} 
        onNavigate={onNavigate}
      />
    </div>
  );
};

export const DesktopMenu: FC<DesktopMenuProps> = ({ navItems, onNavigate }) => {
  const t = useTranslations('nav');

  return (
    <div className="hidden md:flex md:items-center md:space-x-1 justify-center">
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
            />
          )}
        </div>
      ))}
      <SocialIcons />
    </div>
  );
};