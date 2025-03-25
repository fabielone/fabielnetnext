// components/molecules/menus/DesktopMenu.tsx
'use client';

import Link from 'next/link';
import { NavItem } from '../../types/navigation';
import { MegaMenu } from './megamenu';
import { SocialIcons } from '../socials/socialicons';

interface DesktopMenuProps {
  navItems: NavItem[];
  onNavigate: () => void;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ navItems, onNavigate }) => (
  <div className="hidden md:flex md:items-center md:space-x-1 justify-center">
    {navItems.map((item, index) => (
      <div key={index} className="relative group">
        {item.path ? (
          <Link
            href={item.path}
            className="text-gray-800 dark:text-white text-center
             hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
          >
            <span>{item.name}</span>
          </Link>
        ) : (
          <div className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
            <span>{item.name}</span>
            <MegaMenu subItems={item.subItems} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    ))}
    <SocialIcons />
  </div>
);