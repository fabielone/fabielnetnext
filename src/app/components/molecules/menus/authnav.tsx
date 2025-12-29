// components/auth-navigation.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUser, FiLogIn, FiUserPlus, FiSettings, FiLogOut, FiGrid, FiShoppingBag, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { useTranslations , useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../providers/AuthProvider';

export default function AuthNavigation() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsOpen(false);
    window.location.href = `/${locale}`;
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return '?';
    const first = user.firstName?.charAt(0)?.toUpperCase() || '';
    const last = user.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || user.email?.charAt(0)?.toUpperCase() || '?';
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.email?.split('@')[0] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {user ? (
        <>
          {/* Logged in state */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="User menu"
          >
            <div className="relative h-8 w-8">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={getDisplayName()}
                  width={32}
                  height={32}
                  className="h-full w-full rounded-full object-cover ring-2 ring-amber-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white ring-2 ring-amber-300">
                  <span className="text-xs font-semibold">{getInitials()}</span>
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"></span>
            </div>
            <span className="hidden text-sm font-medium md:inline max-w-[100px] truncate">
              {getDisplayName()}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={getDisplayName()}
                        width={40}
                        height={40}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                        <span className="text-sm font-semibold">{getInitials()}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiGrid className="h-4 w-4 text-gray-400" />
                  {t('dashboard') || 'Dashboard'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/orders`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiShoppingBag className="h-4 w-4 text-gray-400" />
                  {t('orders') || 'Orders'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/subscriptions`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiRefreshCw className="h-4 w-4 text-gray-400" />
                  {t('subscriptions') || 'Subscriptions'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/payments`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiCreditCard className="h-4 w-4 text-gray-400" />
                  {t('payments') || 'Payments'}
                </Link>
                <Link
                  href={`/${locale}/dashboard/settings`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiSettings className="h-4 w-4 text-gray-400" />
                  {t('settings') || 'Settings'}
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                      Signing out...
                    </>
                  ) : (
                    <>
                      <FiLogOut className="h-4 w-4" />
                      {t('signOut') || 'Sign Out'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Logged out state */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center gap-2 rounded-full p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Account menu"
          >
            <FiUser className="h-5 w-5" />
            <span className="hidden md:inline">{t('account') || 'Account'}</span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-2">
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiLogIn className="h-4 w-4 text-gray-400" />
                  {t('signIn') || 'Sign In'}
                </Link>
                <Link
                  href={`/${locale}/join`}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiUserPlus className="h-4 w-4 text-gray-400" />
                  {t('register') || 'Create Account'}
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
