'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';
import ConsultationForm from '../../../components/molecules/forms/ScheduleForm';

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner 
        size="large" 
        color="text-purple-600" 
        message="Loading Software Development Services..." 
      />
      <div className="mt-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Preparing Your Software Consultation
        </h2>
        <p className="text-gray-600">
          Setting up your personalized software development consultation...
        </p>
      </div>
    </div>
  </div>
);

export default function SoftwareCheckoutPage() {
  const t = useTranslations('services.items.webDevelopment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
            Software Development
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Design</h3>
            <p className="text-gray-600">Unique, professional designs tailored to your brand</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Performance</h3>
            <p className="text-gray-600">Optimized for speed, SEO, and user experience</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Ready</h3>
            <p className="text-gray-600">Responsive design that works on all devices</p>
          </div>
        </div>

        {/* Consultation Form */}
        <Suspense fallback={<PageLoadingFallback />}>
          <div className="max-w-4xl mx-auto">
            <ConsultationForm defaultService="software" />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
