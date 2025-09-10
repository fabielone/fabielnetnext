'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaCreditCard, FaBoxes, FaChartLine, FaUsers, FaBullhorn } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function EcommercePage() {
  const featureIcons = [
    <FaCreditCard key="payment" className="h-8 w-8" />,
    <FaBoxes key="inventory" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="ecommerce"
        backgroundGradient="from-purple-600 via-pink-600 to-red-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="ecommerce"
        icons={featureIcons}
      />

      {/* eCommerce Platforms */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              eCommerce Platforms We Work With
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Choose from leading platforms or get a completely custom solution
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Shopify',
                description: 'Complete e-commerce platform with everything you need to start, sell, market and manage',
                features: ['Built-in Payments', 'App Ecosystem', 'Mobile Ready']
              },
              {
                name: 'WooCommerce', 
                description: 'Flexible WordPress e-commerce plugin with extensive customization options',
                features: ['WordPress Integration', 'Highly Customizable', 'SEO Friendly']
              },
              {
                name: 'Magento',
                description: 'Enterprise-level e-commerce platform for complex business requirements',
                features: ['Enterprise Features', 'Multi-store', 'Advanced B2B']
              },
              {
                name: 'Custom Solution',
                description: 'Tailored e-commerce solution built specifically for your business needs',
                features: ['Complete Control', 'Unique Features', 'No Limitations']
              }
            ].map((platform, index) => (
              <div key={index} className="group">
                <div className="h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xl font-bold">
                      {platform.name.charAt(0)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {platform.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {platform.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {platform.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              eCommerce Success Stories
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Real results from real businesses using our e-commerce solutions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                metric: '250%',
                description: 'Average increase in online sales within 6 months',
                icon: <FaChartLine className="h-8 w-8" />
              },
              {
                metric: '98%',
                description: 'Customer satisfaction rate with our e-commerce solutions',
                icon: <FaUsers className="h-8 w-8" />
              },
              {
                metric: '24/7',
                description: 'Ongoing support and maintenance for your online store',
                icon: <FaBullhorn className="h-8 w-8" />
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-6">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.metric}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        translationKey="ecommerce"
        primaryLink="/contact"
        secondaryLink="/contact"
        backgroundGradient="from-purple-600 via-pink-600 to-red-600"
      />
    </div>
  );
}
