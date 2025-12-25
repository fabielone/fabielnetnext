// components/molecules/socials/SocialIcons.tsx
'use client';

import { FC } from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export const socialLinks = [
  { icon: FaFacebook, url: 'https://facebook.com/fabielnet', label: 'Facebook' },
  { icon: FaInstagram, url: 'https://instagram.com/fabielnet', label: 'Instagram' },
  { icon: FaTiktok, url: 'https://tiktok.com/@fabielnet', label: 'TikTok' },
  { icon: FaYoutube, url: 'https://youtube.com/@fabielnet', label: 'YouTube' },
  { icon: FaXTwitter, url: 'https://x.com/fabielnet', label: 'X' },
  { icon: FaLinkedin, url: 'https://linkedin.com/company/fabielnet', label: 'LinkedIn' },
];

interface SocialIconsProps {
  className?: string;
  iconClassName?: string;
  variant?: 'light' | 'dark';
}

export const SocialIcons: FC<SocialIconsProps> = ({ 
  className = '', 
  iconClassName = 'w-5 h-5',
  variant = 'dark'
}) => {
  const colorClasses = variant === 'light'
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map(({ icon: Icon, url, label }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`transition-colors duration-200 ${colorClasses}`}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
};