'use client'
import { LLCFormData, UpdateFormData } from '../types';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { RiGoogleFill, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

interface AccountStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
  scrollToError?: (field: string) => void;
}

const AccountStep = ({ formData, updateFormData, onNext, onPrev, scrollToError }: AccountStepProps) => {
  const { user, login, register, loading: authLoading, refreshUser } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Update user profile with BasicInfo data when logged in
  const updateUserProfile = async () => {
    if (!user || profileUpdated) return;
    
    try {
      // Update the user's profile with name/phone from BasicInfoStep
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
        }),
      });
      
      if (response.ok) {
        await refreshUser(); // Refresh user data
        setProfileUpdated(true);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // If user is already logged in, update their profile and sync email
  useEffect(() => {
    if (user && !authLoading) {
      // Update form email to match logged-in user's email (from Google/account)
      updateFormData('email', user.email);
      
      // Update user's profile with name/phone from BasicInfoStep
      if (formData.firstName && formData.lastName) {
        updateUserProfile();
      }
    }
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0 && scrollToError) {
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToError(firstErrorField);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (user) {
      onNext();
    }
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
        });
      }

      if (result.success) {
        // If logging in (not registering), update profile with BasicInfo data
        if (isLogin) {
          await updateUserProfile();
        }
        onNext();
      } else {
        setServerError(result.error || 'Authentication failed. Please try again.');
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Store form data in sessionStorage before redirecting
    sessionStorage.setItem('llcFormData', JSON.stringify(formData));
    // Include step=3 in redirect URL to return to the same step after login
    window.location.href = '/api/auth/google?locale=en&redirect=/checkout/businessformation?step=3';
  };

  const handleChange = (field: keyof LLCFormData, value: string) => {
    updateFormData(field, value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setServerError('');
  };

  // If user is already logged in
  if (user) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            Step 3 of 6: Account
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Verified</h2>
          <p className="text-gray-600">You&apos;re logged in and ready to continue</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Successfully Logged In</h3>
                <p className="text-green-700">{user.firstName} {user.lastName}</p>
                <p className="text-green-600 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2 text-sm">Account Benefits:</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Track your LLC formation progress in your dashboard</li>
            <li>• Access all your business documents anytime</li>
            <li>• Manage additional services and businesses</li>
            <li>• Receive important updates and reminders</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
          <button
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold order-1 sm:order-2"
          >
            Continue to LLC Details
          </button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 3 of 6: Account
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-gray-600">An account is required to track your order and access your dashboard</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        {/* Google Sign Up */}
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
          >
            <RiGoogleFill className="h-5 w-5 text-red-500" />
            Continue with Google
          </button>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-amber-50 text-amber-600">or</span>
            </div>
          </div>
        </div>

        {/* Centered Tab Navigation */}
        <div className="flex justify-center my-6">
          <div className="bg-amber-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                !isLogin
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                isLogin
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-md mx-auto space-y-4">
          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
              {user && <span className="ml-2 text-xs text-green-600 font-normal">(Using verified account email)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiMailLine className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => !user && handleChange('email', e.target.value)}
                readOnly={!!user}
                disabled={!!user}
                className={`w-full pl-10 px-3 text-gray-800 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm ${
                  user ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                } ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="your@email.com"
              />
            </div>
            {user && (
              <p className="text-xs text-gray-500 mt-1">This email is linked to your account and cannot be changed.</p>
            )}
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isLogin ? 'Password *' : 'Create Password *'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockLine className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-10 pr-10 text-gray-800 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder={isLogin ? 'Enter your password' : 'Minimum 8 characters'}
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field (only for signup) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 text-gray-800 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Re-enter your password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Account Benefits (only show for create account) */}
          {!isLogin && (
            <div className="bg-amber-100 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-amber-900 mb-2 text-sm">Account Benefits:</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Track your LLC formation progress in real-time</li>
                <li>• Access all your documents in one place</li>
                <li>• Manage all your businesses from one dashboard</li>
                <li>• Receive important compliance reminders</li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleAuth}
            disabled={isLoading}
            className={`w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm mt-6 flex items-center justify-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In & Continue' : 'Create Account & Continue'
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
        >
          Back
        </button>
        <div className="order-1 sm:order-2">
          {/* Navigation handled by action buttons above */}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Money Back Guarantee</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
            </svg>
            <span>Data Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStep;
