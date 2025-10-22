'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { FaCheck, FaRocket, FaMobile, FaSearch, FaShoppingCart, FaChartLine, FaLock } from 'react-icons/fa';
import { WEB_DEVELOPMENT_TIERS, BLOG_SERVICE_TIERS, ServiceTier } from '../../components/types/services';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../components/utils/performance-monitor'), {
  ssr: false
});

export default function WebDevelopmentPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'web' | 'blog'>('web');

  const handleGetStarted = (tier: ServiceTier) => {
    window.location.href = `/${locale}/checkout/web?product=${activeTab}&tier=${tier}`;
  };

  const currentTiers = activeTab === 'web' ? WEB_DEVELOPMENT_TIERS : BLOG_SERVICE_TIERS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Professional Web Development & Blog Services
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/90">
              Powerful, scalable solutions for businesses of all sizes. Choose the perfect plan for your needs.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <FaRocket className="h-8 w-8 text-white/80" />
              <FaMobile className="h-8 w-8 text-white/80" />
              <FaSearch className="h-8 w-8 text-white/80" />
              <FaChartLine className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Type Tabs */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'web'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Web Development
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'blog'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Blog Services
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {activeTab === 'web' ? 'Web Development Plans' : 'Blog Service Plans'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that best fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {currentTiers.map((tier, index) => (
              <div
                key={tier.tier}
                className={`relative rounded-2xl shadow-xl ${
                  tier.recommended
                    ? 'border-4 border-blue-600 scale-105 z-10'
                    : 'border border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800 p-8 transition-transform hover:scale-105`}
              >
                {tier.recommended && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {tier.priceDisplay}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleGetStarted(tier.tier)}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                    tier.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Our {activeTab === 'web' ? 'Web Development' : 'Blog'} Services?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {activeTab === 'web' ? (
              <>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FaMobile className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Mobile-First Design
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All our websites are built with mobile users in mind, ensuring perfect display on any device.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FaSearch className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    SEO Optimized
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Built-in SEO best practices to help your website rank higher in search results.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FaLock className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Secure & Fast
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enterprise-grade security and performance optimization for lightning-fast load times.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FaChartLine className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Content Strategy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Professional content planning and strategy to maximize engagement and reach.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FaSearch className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    SEO for Content
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Every blog post optimized for search engines to drive organic traffic.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <FaShoppingCart className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Marketing Integration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Seamless integration with email marketing and social media platforms.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Choose your plan and launch your project today. No contracts, cancel anytime.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
