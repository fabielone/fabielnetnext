'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import LanguageSelector from '../components/molecules/languageselector';
import { navItems } from './config/navigation';
import { Logo } from './atoms/logos/logo';
import { HamburgerButton } from './atoms/buttons/hamburger';
import { MobileMenu } from './molecules/menus/mobilemenu';
import { DesktopMenu } from './molecules/menus/desktopmenu';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.menu-icon')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleNavigationClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         <Logo onClick={function (): void {
            throw new Error('Function not implemented.');
          } }/>
          {/* Hamburger Menu (Mobile) */}
          <HamburgerButton onClick={toggleMenu} />

          {/* Desktop Menu */}
          <DesktopMenu 
        navItems={navItems} 
            onNavigate={handleNavigationClick} />

          {/* Language Selector and Login */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link
              href="/login"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión / 
            </Link>
            <Link
              href="/join"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Registrarse
            </Link>
          </div>
        </div>

         {/* Mobile Menu */}
       <MobileMenu  
         isOpen={isMenuOpen}
          navItems={navItems}
         openCategories={openCategories}
           onToggleCategory={toggleCategory}
            onNavigate={handleNavigationClick}
       />
      </div>
    </nav>
  );
}