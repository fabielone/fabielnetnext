'use client';

import { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Language } from '../types/types';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'es', name: 'Español', flag: '🇲🇽' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations('LanguageSelector');

  const handleLanguageChange = (newLocale: Language) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/';
    
    // Create new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.replace(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
        aria-label={t('changeLanguage')}
      >
        <span>{languages.find(lang => lang.code === currentLocale)?.flag}</span>
        <span>{languages.find(lang => lang.code === currentLocale)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 ${
                currentLocale === language.code ? 'bg-gray-50' : ''
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-2 text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}