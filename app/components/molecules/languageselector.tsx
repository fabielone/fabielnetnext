// components/LanguageSelector.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language } from '../types';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setCurrentLanguage(pathname.startsWith('/en') ? 'en' : 'es');
  }, [pathname]);

  const handleLanguageChange = (lng: Language) => {
    if (lng === 'es') {
      const newPath = pathname.replace(/^\/en/, '') || '/';
      router.replace(newPath);
    } else {
      const pathWithoutLang = pathname.replace(/^\/en/, '');
      const newPath = `/${lng}${pathWithoutLang || ''}`;
      router.replace(newPath);
    }
    
    setCurrentLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        <span>{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
        <span>{languages.find(lang => lang.code === currentLanguage)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 ${
                currentLanguage === language.code ? 'bg-gray-50' : ''
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-2 text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}