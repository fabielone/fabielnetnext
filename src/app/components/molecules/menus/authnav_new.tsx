// components/auth-navigation.tsx
'use client';

import { FiUser, FiLogIn, FiUserPlus, FiSettings, FiLogOut } from 'react-icons/fi';
import { Popover } from '../popover/popover';
import { useTranslations } from 'next-intl';
import { OptimizedLink } from '../../atoms/OptimizedLink';
import Image from 'next/image';

interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface AuthNavigationProps {
  user?: User | null;
}

export default function AuthNavigation({ user }: AuthNavigationProps) {
  const t = useTranslations('auth');

  return (
    <div className="flex items-center">
      {user ? (
        <Popover
          align="end"
          sideOffset={8}
          trigger={
            <div className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="relative h-8 w-8">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || t('account')}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <span className="text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || t('account').charAt(0)}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"></span>
              </div>
              <span className="hidden text-sm font-medium md:inline">
                {user.name || t('account')}
              </span>
            </div>
          }
        >
          <div className="w-48 p-2">
            <div className="mb-1 p-2">
              <p className="text-sm font-medium">{user.name || t('account')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <div className="mt-1 space-y-1">
              <OptimizedLink
                href="/profile"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                loadingMessage="Loading profile..."
              >
                <FiUser className="h-4 w-4" />
                {t('profile')}
              </OptimizedLink>
              <OptimizedLink
                href="/settings"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                loadingMessage="Loading settings..."
              >
                <FiSettings className="h-4 w-4" />
                {t('settings')}
              </OptimizedLink>
              <OptimizedLink
                href="/logout"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                loadingMessage="Signing out..."
              >
                <FiLogOut className="h-4 w-4" />
                {t('signOut')}
              </OptimizedLink>
            </div>
          </div>
        </Popover>
      ) : (
        <Popover
          align="end"
          trigger={
            <div className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800">
              <FiUser className="h-4 w-4" />
              <span className="hidden md:inline">{t('account')}</span>
            </div>
          }
        >
          <div className="w-48 p-2">
            <div className="space-y-1">
              <OptimizedLink
                href="/login"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                loadingMessage="Loading login..."
              >
                <FiLogIn className="h-4 w-4" />
                {t('signIn')}
              </OptimizedLink>
              <OptimizedLink
                href="/join"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                loadingMessage="Loading registration..."
              >
                <FiUserPlus className="h-4 w-4" />
                {t('register')}
              </OptimizedLink>
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}
