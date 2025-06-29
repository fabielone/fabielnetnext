"use client"
import { LLCFormData, UpdateFormData } from '../types';
import { useState } from 'react';

interface AccountStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
  scrollToError?: (field: string) => void;
}

const AccountStep = ({ formData, updateFormData, onNext, onPrev, scrollToError }: AccountStepProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = () => {
    return (
      formData.password.length >= 8 && 
      formData.password === formData.confirmPassword
    );
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isLogin) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
    } else {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0 && scrollToError) {
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToError(firstErrorField);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (isLoggedIn || validateForm()) {
      onNext();
    }
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      setIsLoggedIn(true);
    }
  };

  const handleSignup = () => {
    if (validateForm()) {
      console.log('Signup attempt:', { email: formData.email, password: formData.password });
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    updateFormData('password', '');
    updateFormData('confirmPassword', '');
  };

  const handleContinueWithoutAccount = () => {
    updateFormData('password', '');
    updateFormData('confirmPassword', '');
    onNext();
  };

  const handleChange = (field: keyof LLCFormData, value: string) => {
    updateFormData(field, value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // If user is already logged in
  if (isLoggedIn) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            Step 3 of 6: Account
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Verified</h2>
          <p className="text-gray-600">You're logged in and ready to continue</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Successfully Logged In</h3>
                <p className="text-green-700">{formData.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 3 of 6: Account
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Setup</h2>
        <p className="text-gray-600">Create an account to track progress or continue as guest</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        {/* Centered Tab Navigation */}
        <div className="flex justify-center mb-8">
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
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              name="email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isLogin}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm ${
                !isLogin ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
              } ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">Using email from previous step</p>
            )}
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isLogin ? 'Password *' : 'Create Password *'}
            </label>
            <input
              name="password"
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder={isLogin ? 'Enter your password' : 'Minimum 8 characters'}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field (only for signup) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Account Benefits (only show for create account) */}
          {!isLogin && (
            <div className="bg-amber-100 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-amber-900 mb-2 text-sm">Account Benefits:</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Track your LLC formation progress</li>
                <li>• Access all your documents</li>
                <li>• Manage additional services</li>
                <li>• Receive important updates</li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={isLogin ? handleLogin : handleSignup}
            className="w-full px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm mt-6"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          {/* Continue Without Account */}
          <div className="text-center mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-amber-50 text-amber-600">or</span>
              </div>
            </div>
            
            <button
              onClick={handleContinueWithoutAccount}
              className="w-full px-6 py-2.5 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm"
            >
              Continue as Guest
            </button>
            <p className="text-xs text-amber-600 mt-2">
              All documents and updates will be sent to your email address
            </p>
          </div>
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
        <p className="text-xs">
          © 2025 Fabiel.net - Your information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default AccountStep;