'use client';

import Link from 'next/link';
import Image from 'next/image';
import Newsletter from './newsletter/subscribe';
import { useTranslations } from 'next-intl';
import { SocialIcons } from './socials/socialicons';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white py-6 xl:py-12">
      <div className="xl:container mx-auto px-4 xl:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 xl:gap-8">
          {/* Column 1: Logo and Social Links */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/darklogo.png" // Path to your logo in the public folder
                alt="Fabiel.Net Logo"
                width={250} // Adjust width as needed
                height={40} // Adjust height as needed
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-300">
              {t('description')}
            </p>
            <SocialIcons variant="light" />
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/ourprocess" className="text-sm text-gray-300 hover:text-white transition-colors">Our Process</Link>
              </li>
              <li>
                <Link href="/allies" className="text-sm text-gray-300 hover:text-white transition-colors">Clients</Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-gray-300 hover:text-white transition-colors">Partners</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.contact')}</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.privacy')}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">{t('services')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/webdevelopment" className="text-sm text-gray-300 hover:text-white transition-colors">Web Development</Link>
              </li>
              <li>
                <Link href="/business" className="text-sm text-gray-300 hover:text-white transition-colors">Business Formations</Link>
              </li>
              <li>
                <a href="https://blog.fabiel.net" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <Link href="/join" className="text-sm text-gray-300 hover:text-white transition-colors">Join Us</Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription Form */}
          <div className="sm:col-span-2 md:col-span-1">
            <Newsletter
                          
              title={t('newsletter')}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-4 xl:mt-8 pt-4 xl:pt-8 text-center">
          <p className="text-sm text-gray-300">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <Link href="/privacy" className="hover:text-white transition-colors">{t('links.privacy')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}