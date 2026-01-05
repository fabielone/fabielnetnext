'use client';

import { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Language } from '../types/types';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import ReactCountryFlag from 'react-country-flag';

interface LanguageOption {
  code: Language;
  name: string;
  countryCode: string;
}

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations('LanguageSelector');

  const languages: LanguageOption[] = [
    { 
      code: 'en', 
      name: 'English', 
      countryCode: 'US' 
    },
  ];

  const handleLanguageChange = (newLocale: Language) => {
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.replace(newPath);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('changeLanguage')}
      >
        <span className="text-gray-700 dark:text-gray-300">
          {currentLanguage && (
            <ReactCountryFlag 
              countryCode={currentLanguage.countryCode}
              svg
              style={{
                width: '1.25rem',
                height: '1.25rem',
              }}
              aria-label={currentLanguage.name}
            />
          )}
        </span>
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage?.name}
        </span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                currentLocale === language.code ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-gray-700 dark:text-gray-300">
                <ReactCountryFlag 
                  countryCode={language.countryCode}
                  svg
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                  }}
                  aria-label={language.name}
                />
              </span>
              <span className="flex-1 text-left">{language.name}</span>
              {currentLocale === language.code && (
                <FiCheck className="text-green-500 dark:text-green-400 w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}