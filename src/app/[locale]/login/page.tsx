// app/login/page.tsx
'use client';

import { FormEvent, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  RiMailLine, 
  RiLockLine, 
  RiEyeLine, 
  RiEyeOffLine, 
  RiLoginBoxLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
  RiGoogleFill
} from 'react-icons/ri';
import { useAuth } from 'src/app/components/providers/AuthProvider';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const { user, login, loading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect');

  // Check for OAuth errors
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError('Failed to sign in with Google. Please try again.');
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const destination = redirectUrl || `/${locale}/dashboard`;
      window.location.href = destination;
    }
  }, [user, authLoading, locale, redirectUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Use window.location for a full page navigation to ensure cookies are picked up
      const destination = redirectUrl || `/${locale}/dashboard`;
      window.location.href = destination;
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirect = redirectUrl || `/${locale}/dashboard`;
    window.location.href = `/api/auth/google?locale=${locale}&redirect=${encodeURIComponent(redirect)}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-100 rounded-full">
              <RiLoginBoxLine className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href={`/${locale}/join`}
              className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 bg-white rounded-xl shadow-xl border border-amber-100/50">
          <div className="px-6 py-8 sm:px-8">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
            >
              <RiGoogleFill className="h-5 w-5 text-red-500" />
              Continue with Google
            </button>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMailLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiLockLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="flex">
                    <RiErrorWarningLine className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <RiShieldCheckLine className="h-5 w-5 text-gray-400 mr-2" />
          <p>Secure encrypted connection</p>
        </div>

        {/* Terms Note */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <Link href={`/${locale}/terms`} className="text-amber-600 hover:text-amber-500">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href={`/${locale}/privacy`} className="text-amber-600 hover:text-amber-500">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
