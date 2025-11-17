'use client';

import React, { useState, useRef, useEffect } from 'react';
import LanguageSelector from './languageselector';
import { navItems } from '../config/navigation';
import { Logo } from '../atoms/logos/logo';
import { HamburgerButton } from '../atoms/buttons/hamburger';
import { MobileMenu } from './menus/mobilemenu';
import { DesktopMenu } from './menus/desktopmenu';
import ThemeToggle from './themeselector';
import AuthNavigation from './menus/authnav';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);



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
    <nav className="bg-background-primary dark:bg-dark-background-primary 
     text-tx-primary  dark:text-dark-tx-primary
    shadow-md fixed w-full z-50 px-5">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center h-16 gap-2">
          <Logo 
            onClick={() => {
              throw new Error('Function not implemented.');
    
            }}
            // minWidth={"200px"}
  
          />
          <HamburgerButton onClick={toggleMenu} buttonTextColor={'text-hamburger dark:text-dark-hamburger'} />

          {/* Desktop Menu */}
          <div className="flex-grow flex justify-center min-w-0">
            <DesktopMenu 
              navItems={navItems} 
              onNavigate={handleNavigationClick} />
          </div>

          {/* Language Selector and Login - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
          
            <LanguageSelector />
            <ThemeToggle />
            <AuthNavigation />
          </div>

          {/* Mobile/Tablet Utility Icons - Show on mobile/tablet only */}
          <div className="flex lg:hidden items-center space-x-2 ml-auto">
            <LanguageSelector />
            <ThemeToggle />
            <AuthNavigation />
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