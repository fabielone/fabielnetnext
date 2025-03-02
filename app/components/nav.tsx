'use client'; // Mark this as a Client Component since we're using hooks and interactivity

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // Toggle category collapse
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Change language
  const changeLanguage = (lng: string) => {
    const newPath = `/${lng}${pathname}`; // Prepend the new locale to the current path
    router.replace(newPath); // Update the URL with the new locale
    setIsLanguageDropdownOpen(false); // Close the dropdown
    setIsMenuOpen(false); // Close the mobile menu
  };

  // Handle navigation click (closes the mobile menu)
  const handleNavigationClick = () => {
    setIsMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    {
      name: t('services'),
      subItems: [
        {
          name: t('softwareDevelopment'),
          subSections: [
            { name: t('web'), path: '/services/software-development/web' },
            { name: t('applications'), path: '/services/software-development/applications' },
            { name: t('solutions'), path: '/services/software-development/solutions' },
          ],
        },
        {
          name: t('marketing'),
          subSections: [
            { name: t('socialMedia'), path: '/services/marketing/social-media' },
            { name: t('contentCreation'), path: '/services/marketing/content-creation' },
            { name: t('blog'), path: '/services/marketing/blog' },
          ],
        },
        {
          name: t('businessFormations'),
          subSections: [
            { name: t('formYourLLC'), path: '/services/business-formations/form-your-llc' },
            { name: t('registeredAgent'), path: '/services/business-formations/registered-agent' },
            { name: t('compliance'), path: '/services/business-formations/compliance' },
            { name: t('conciergeService'), path: '/services/business-formations/concierge-service' },
          ],
        },
      ],
    },
    {
      name: t('portfolio'),
      path: '/portfolio',
    },
    {
      name: t('blog'),
      path: '/blog',
    },
    {
      name: t('contact'),
      path: '/contact',
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 dark:text-white"
              onClick={handleNavigationClick} // Close menu on logo click
            >
              {t('logo')}
            </Link>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 dark:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4 flex-grow justify-center">
            {/* Navigation Links */}
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.path ? (
                  <Link
                    href={item.path}
                    className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                    {item.name}
                    {/* Full-width dropdown */}
                    <div className="absolute left-0 right-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg py-4 hidden group-hover:block">
                      <div className="grid grid-cols-3 gap-8 px-8">
                        {item.subItems?.map((subItem, subIndex) => (
                          <div key={subIndex} className="border-r border-gray-200 dark:border-gray-700 pr-8 last:border-r-0">
                            <p className="text-gray-800 dark:text-white font-semibold mb-2">
                              {subItem.name}
                            </p>
                            {subItem.subSections?.map((subSection, subSecIndex) => (
                              <Link
                                key={subSecIndex}
                                href={subSection.path}
                                className="block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-1"
                                onClick={handleNavigationClick} // Close menu on submenu click
                              >
                                {subSection.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Social Media Icons */}
            <div className="flex space-x-4 ml-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.895 2.895 0 01-5.703 1.341 2.895 2.895 0 012.638-4.06v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-3.77-1.104z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L15 12l-5 3.464z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Language Dropdown and Log In / Sign Up */}
          <div className="flex items-center space-x-4">
            {/* Language Dropdown */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={toggleLanguageDropdown}
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {pathname.startsWith('/es') ? 'Español' : 'English'}
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-4 py-2"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('es')}
                    className="block w-full text-left text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-4 py-2"
                  >
                    Español
                  </button>
                </div>
              )}
            </div>

            {/* Log In / Sign Up */}
            <Link
              href="/login"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t('login')} / {t('signup')}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.path ? (
                    <Link
                      href={item.path}
                      className="block text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                      onClick={handleNavigationClick} // Close menu on link click
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                      <button
                        onClick={() => toggleCategory(item.name)}
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
                              <p className="text-gray-800 dark:text-white font-semibold">
                                {subItem.name}
                              </p>
                              {subItem.subSections?.map((subSection, subSecIndex) => (
                                <Link
                                  key={subSecIndex}
                                  href={subSection.path}
                                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-1"
                                  onClick={handleNavigationClick} // Close menu on submenu click
                                >
                                  {subSection.name}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Language Dropdown (Mobile) */}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className="block text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {pathname.startsWith('/es') ? 'Español' : 'English'}
                </button>
                {isLanguageDropdownOpen && (
                  <div className="mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2">
                    <button
                      onClick={() => changeLanguage('en')}
                      className="block w-full text-left text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-4 py-2"
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage('es')}
                      className="block w-full text-left text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-4 py-2"
                    >
                      Español
                    </button>
                  </div>
                )}
              </div>

              {/* Log In / Sign Up (Mobile) */}
              <Link
                href="/login"
                className="block text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                onClick={handleNavigationClick} // Close menu on link click
              >
                {t('login')} / {t('signup')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;