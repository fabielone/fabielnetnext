// components/molecules/menus/MegaMenu.tsx
'use client';

import Link from 'next/link';
import { SubItem } from '../../types/navigation';
import { IoMdArrowForward } from 'react-icons/io'; // Import the arrow icon

interface MegaMenuProps {
  subItems?: SubItem[];
  onNavigate: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ subItems, onNavigate }) => (
  <div className="fixed left-1/2 transform -translate-x-1/2 mt-2 w-3xl bg-amber-100 dark:bg-gray-800 shadow-lg rounded-lg py-4 hidden group-hover:block z-50">
    <div className="grid grid-cols-3 gap-8 px-8">
      {subItems?.map((subItem, subIndex) => (
        <div
          key={subIndex}
          className="border-r border-gray-200 dark:border-gray-700 pr-8 last:border-r-0"
        >
          <p className="text-gray-800 dark:text-white font-semibold mb-2">
            <span>{subItem.name}</span>
          </p>
          <div>
            {subItem.subSections?.map((subSection, subSecIndex) => (
              <Link
                key={subSecIndex}
                href={subSection.path}
                className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-1"
                onClick={onNavigate}
              >
                <IoMdArrowForward 
                  className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500" 
                />
                <span>{subSection.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);