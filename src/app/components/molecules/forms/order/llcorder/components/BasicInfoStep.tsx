'use client'
import { LLCFormData, UpdateFormData } from '../types'; 
import { useState } from 'react';

interface Props {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
  scrollToError?: (field: string) => void;
}

const BasicInfoStep = ({ formData, updateFormData, onNext, onPrev, scrollToError }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    
    // Scroll to first error if exists
    if (Object.keys(newErrors).length > 0 && scrollToError) {
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToError(firstErrorField);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleChange = (field: keyof LLCFormData, value: string) => {
    updateFormData(field, value);
    // Clear the error for the field being edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        {/* Step Pill */}
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 1 of 6: Basic Information
        </div>
        
        <p className="text-gray-600 mb-6">Enter your basic business and contact information</p>
        
        {/* Pricing */}
        <div className="bg-amber-50 rounded-lg p-4 mb-4 max-w-md mx-auto">
          <div className="text-2xl font-bold text-amber-900 mb-1">$124.99 Total</div>
          <div className="text-amber-700 text-sm">$49.99 service fee + $75.00 state filing fee</div>
        </div>
        
        {/* What's Included */}
        <div className="bg-amber-50 rounded-lg p-4 text-left max-w-lg mx-auto">
          <h3 className="font-semibold text-amber-900 mb-3 text-center">What's Included in Your LLC Package:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-800">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              Filing with California Secretary of State
            </div>
            <div className="flex items-center">
              <span className="text-green-600 mr-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              EIN (Federal Tax ID)
            </div>
            <div className="flex items-center">
              <span className="text-green-600 mr-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              Operating Agreement template
            </div>
            <div className="flex items-center">
              <span className="text-green-600 mr-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              Bank resolution letter
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Company Name - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired LLC Name *
            </label>
            <input
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                errors.companyName ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Enter your desired LLC name"
            />
            <p className="text-xs text-amber-600 mt-1">
              <span className="font-medium">Do not include "LLC" or "Limited Liability Company"</span>
            </p>
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
          </div>

          {/* Name Fields - Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact Fields - Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                name="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="your@email.com"
                type="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="(555) 123-4567"
                type="tel"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
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
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold order-1 sm:order-2"
        >
          Continue to Services
        </button>
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
            <span>Registered Agent Available</span>
          </div>
        </div>
        <p className="text-xs">
          © 2025 Fabiel.net - Professional Business Formation Services
        </p>
      </div>
    </div>
  );
};

export default BasicInfoStep;