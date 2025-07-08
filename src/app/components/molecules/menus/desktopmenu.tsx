// components/molecules/menus/DesktopMenu.tsx
'use client';

import Link from 'next/link';
import { NavItem } from '../../types/navigation';
import { MegaMenu } from './megamenu';
import { SocialIcons } from '../socials/socialicons';
import { FC } from 'react';

interface DesktopMenuProps {
  navItems: NavItem[];
  onNavigate: () => void;
}

const NavLink = ({ item, onNavigate }: { item: NavItem, onNavigate: () => void }) => (
  <Link
    href={item.path!}
    className="text-gray-800 dark:text-white text-center hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
    onClick={onNavigate}
  >
    <span>{item.name}</span>
  </Link>
);

const NavItemWithMegaMenu = ({ item, onNavigate }: { item: NavItem, onNavigate: () => void }) => (
  <div className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
    <span>{item.name}</span>
    <MegaMenu subItems={item.subItems} onNavigate={onNavigate} />
  </div>
);

export const DesktopMenu: FC<DesktopMenuProps> = ({ navItems, onNavigate }) => (
  <div className="hidden md:flex md:items-center md:space-x-1 justify-center">
    {navItems.map((item, index) => (
      <div key={index} className="relative group">
        {item.path ? (
          <NavLink item={item} onNavigate={onNavigate} />
        ) : (
          <NavItemWithMegaMenu item={item} onNavigate={onNavigate} />
        )}
      </div>
    ))}
    <SocialIcons />
  </div>
);