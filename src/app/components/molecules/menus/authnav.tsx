// components/auth-navigation.tsx
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiLogIn, FiUserPlus, FiSettings, FiLogOut } from 'react-icons/fi';
import { Popover } from '../popover/popover';

interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface AuthNavigationProps {
  user?: User | null;
}

export default function AuthNavigation({ user }: AuthNavigationProps) {
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
                    alt={user.name || 'User avatar'}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <span className="text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"></span>
              </div>
              <span className="hidden text-sm font-medium md:inline">
                {user.name || 'Account'}
              </span>
            </div>
          }
        >
          <div className="w-56 p-2">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <div className="mt-1 space-y-1">
              <Link
                href="/profile"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiUser className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiSettings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/logout"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLogOut className="h-4 w-4" />
                Sign out
              </Link>
            </div>
          </div>
        </Popover>
      ) : (
        <Popover
          align="end"
          trigger={
            <div className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800">
              <FiUser className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </div>
          }
        >
          <div className="w-48 p-2">
            <div className="space-y-1">
              <Link
                href="/login"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/join"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiUserPlus className="h-4 w-4" />
                Register
              </Link>
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}