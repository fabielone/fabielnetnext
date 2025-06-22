// components/molecules/socials/SocialIcons.tsx
'use client';

import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const socialLinks = [
  { icon: FaFacebook, url: 'https://facebook.com' },
  { icon: FaInstagram, url: 'https://instagram.com' },
  { icon: FaTiktok, url: 'https://tiktok.com' },
  { icon: FaYoutube, url: 'https://youtube.com' },
];

export const SocialIcons: React.FC = () => (
  <div className="flex space-x-4 ml-4">
    {socialLinks.map(({ icon: Icon, url }) => (
      <a
        key={url}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
      >
        <Icon className="w-5 h-5" />
      </a>
    ))}
  </div>
);