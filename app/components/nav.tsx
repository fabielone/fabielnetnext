'use client'; // Mark this as a Client Component since we're using hooks and interactivity

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
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
      name: 'Services',
      subItems: [
        {
          name: 'Software Development',
          subSections: [
            { name: 'Web', path: '/services/software-development/web' },
            { name: 'Applications', path: '/services/software-development/applications' },
            { name: 'Solutions', path: '/services/software-development/solutions' },
          ],
        },
        {
          name: 'Marketing',
          subSections: [
            { name: 'Social Media', path: '/services/marketing/social-media' },
            { name: 'Content Creation', path: '/services/marketing/content-creation' },
            { name: 'Blog', path: '/services/marketing/blog' },
          ],
        },
        {
          name: 'Business Formations',
          subSections: [
            { name: 'Form Your LLC', path: '/services/business-formations/form-your-llc' },
            { name: 'Registered Agent', path: '/services/business-formations/registered-agent' },
            { name: 'Compliance', path: '/services/business-formations/compliance' },
            { name: 'Concierge Service', path: '/services/business-formations/concierge-service' },
          ],
        },
      ],
    },
    {
      name: 'Portfolio',
      path: '/portfolio',
    },
    {
      name: 'Blog',
      path: '/blog',
    },
    {
      name: 'Contact',
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
              Logo
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
                    <div className="absolute right-auto mt-2 w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-lg py-4 hidden group-hover:block">
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
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaYoutube className="w-5 h-5" />
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
              Login / Signup
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
                Login / Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}