'use client';

import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Newsletter from './newsletter/subscribe';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Social Links */}
          <div className="space-y-4">
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
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.services')}</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.portfolio')}</Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.blog')}</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.contact')}</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.terms')}</Link>
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
                <Link href="/services/business-formations" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.businessFormations')}</Link>
              </li>
              <li>
                <Link href="/services/software-development" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.softwareDevelopment')}</Link>
              </li>
              <li>
                <Link href="/services/marketing" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.marketing')}</Link>
              </li>
              <li>
                <Link href="/services/registered-agent" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.registeredAgent')}</Link>
              </li>
              <li>
                <Link href="/services/compliance" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.compliance')}</Link>
              </li>
              <li>
                <Link href="/services/concierge-service" className="text-sm text-gray-300 hover:text-white transition-colors">{t('links.concierge')}</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription Form */}
          <Newsletter
                        
            title={t('newsletter')}
          /> 
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <Link href="/terms" className="hover:text-white transition-colors">{t('links.terms')}</Link>{' '}
            |{' '}
            <Link href="/privacy" className="hover:text-white transition-colors">{t('links.privacy')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}