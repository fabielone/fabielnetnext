'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import LanguageSelector from '../components/molecules/languageselector';

interface NavItem {
  name: string;
  path?: string;
  subItems?: {
    name: string;
    subSections: {
      name: string;
      path: string;
    }[];
  }[];
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: 'Servicios',
      subItems: [
        {
          name: 'Desarrollo de Software',
          subSections: [
            { name: 'Web', path: '/services/software-development/web' },
            { name: 'Tienda En Línea', path: '/services/software-development/applications' },
            { name: 'Automatización', path: '/services/software-development/solutions' },
          ],
        },
        {
          name: 'Marketing',
          subSections: [
            { name: 'Redes Sociales', path: '/services/marketing/social-media' },
            { name: 'Creación de Contenido', path: '/services/marketing/content-creation' },
            { name: 'Blog', path: '/services/marketing/blog' },
          ],
        },
        {
          name: 'Formación de Empresas',
          subSections: [
            { name: 'Forma tu LLC', path: '/services/business-formations/form-your-llc' },
            { name: 'Agente Registrado', path: '/services/business-formations/registered-agent' },
            { name: 'Cumplimiento', path: '/services/business-formations/compliance' },
          ],
        },
      ],
    },
    {
      name: 'Clientes',
      path: '/clientes',
    },
    {
      name: 'Servicio Black',
      subItems: [
        {
          name: 'Servicio de Concierge',
          subSections: [
            { name: 'Paquete Todo Incluido', path: '/services/vip/concierge' },
          ],
        },
        {
          name: 'Asesoría Exclusiva',
          subSections: [
            { name: 'Consultoría Personalizada', path: '/services/vip/consulting' },
            { name: 'Soporte Prioritario', path: '/services/vip/priority-support' },
          ],
        },
      ],
    },
    {
      name: 'Blog',
      path: '/blog',
    },
    {
      name: 'Contacto',
      path: '/contact',
    },
  ];

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
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 "
              onClick={handleNavigationClick}
            >
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={150}
                height={50}
                priority
              />
            </Link>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 dark:text-white focus:outline-none menu-icon"
              aria-label="Toggle menu"
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
          <div className="hidden md:flex md:items-center md:space-x-1  justify-center">
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
                    {/* Mega Menu Dropdown */}
                    <div className="fixed left-1/2 transform -translate-x-1/2 mt-2 w-3xl bg-amber-100 dark:bg-gray-800 shadow-lg rounded-lg py-4 hidden group-hover:block z-50">
  <div className="grid grid-cols-3 gap-8 px-8">
    {item.subItems?.map((subItem, subIndex) => (
      <div 
        key={subIndex} 
        className="border-r border-gray-200 dark:border-gray-700 pr-8 last:border-r-0"
      >
        <p className="text-gray-800 dark:text-white font-semibold mb-2">
          {subItem.name}
        </p>
        <div>
          {subItem.subSections?.map((subSection, subSecIndex) => (
            <Link
              key={subSecIndex}
              href={subSection.path}
              className="block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-1"
              onClick={handleNavigationClick}
            >
              {subSection.name}
            </Link>
          ))}
        </div>
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

          {/* Language Selector and Login */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link
              href="/login"
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión / Registrarse
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
                      onClick={handleNavigationClick}
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
                                  onClick={handleNavigationClick}
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}