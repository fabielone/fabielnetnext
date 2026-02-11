'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheck, FaRocket, FaMobile, FaSearch, FaShoppingCart, FaChartLine, FaLock, FaCode, FaPen, FaArrowRight } from 'react-icons/fa';
import { WEB_DEVELOPMENT_TIERS, BLOG_SERVICE_TIERS, ServiceTier } from '../../components/types/services';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../components/utils/performance-monitor'), {
  ssr: false
});

export default function WebDevelopmentPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'web' | 'blog'>('web');
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });

  const handleGetStarted = (tier: ServiceTier) => {
    window.location.href = `/${locale}/checkout/web?product=${activeTab}&tier=${tier}`;
  };

  const currentTiers = activeTab === 'web' ? WEB_DEVELOPMENT_TIERS : BLOG_SERVICE_TIERS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gray-950 pt-20 pb-32 lg:pt-28 lg:pb-40">
        {/* Background gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px]" />
        </div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400">
                  <FaCode className="h-3.5 w-3.5" /> Web Development
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400">
                  <FaPen className="h-3.5 w-3.5" /> Blog Services
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Build a Website That{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Actually Converts
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-xl">
                Professional, scalable web development and blog solutions for businesses of all sizes.
                Mobile-first, SEO-optimized, and built for speed.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30"
                >
                  View Plans <FaArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.href = `/${locale}/contact`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-white"
                >
                  Book a Call
                </motion.button>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaRocket className="h-4 w-4 text-blue-400" />
                  <span>Fast Deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMobile className="h-4 w-4 text-purple-400" />
                  <span>Mobile-First</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLock className="h-4 w-4 text-emerald-400" />
                  <span>SSL Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-amber-400" />
                  <span>SEO Ready</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Browser mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl shadow-blue-900/20 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-gray-800 text-xs text-gray-400 font-mono">
                      yourbusiness.com
                    </div>
                  </div>
                </div>
                {/* Content preview */}
                <div className="p-6 space-y-4 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
                  {/* Nav mockup */}
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-4 rounded bg-blue-500/30" />
                    <div className="flex gap-3">
                      <div className="w-12 h-3 rounded bg-gray-700" />
                      <div className="w-12 h-3 rounded bg-gray-700" />
                      <div className="w-16 h-3 rounded bg-gray-700" />
                      <div className="w-16 h-7 rounded-md bg-blue-600/60" />
                    </div>
                  </div>
                  {/* Hero area mockup */}
                  <div className="mt-6 space-y-3">
                    <div className="w-3/4 h-6 rounded bg-white/10" />
                    <div className="w-1/2 h-6 rounded bg-white/5" />
                    <div className="w-2/3 h-3 rounded bg-gray-700 mt-4" />
                    <div className="w-1/2 h-3 rounded bg-gray-700" />
                    <div className="flex gap-3 mt-4">
                      <div className="w-28 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600" />
                      <div className="w-28 h-9 rounded-lg border border-gray-700" />
                    </div>
                  </div>
                  {/* Cards mockup */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg bg-gray-800/80 border border-gray-700/50 p-3 space-y-2">
                        <div className="w-8 h-8 rounded-md bg-blue-500/20" />
                        <div className="w-full h-2.5 rounded bg-gray-700" />
                        <div className="w-3/4 h-2 rounded bg-gray-700/60" />
                        <div className="w-1/2 h-2 rounded bg-gray-700/40" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-40" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-30" />
            </motion.div>
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
      <section id="pricing" className="py-16 lg:py-24">
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
            {currentTiers.map((tier) => (
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
