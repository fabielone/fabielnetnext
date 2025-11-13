'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../components/molecules/hero/software-hero';
import CTASection from '../../components/molecules/sections/cta-section';
import { useTranslations, useLocale } from 'next-intl';
import { FaBuilding, FaShieldAlt, FaClipboardCheck, FaUsers } from 'react-icons/fa';
import { useNavigationLoading } from '../../components/hooks/useNavigationLoading';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../components/utils/performance-monitor'), {
  ssr: false
});

export default function BusinessPage() {
  useTranslations('business');
  const locale = useLocale();
  const { isNavigating, navigateWithLoading } = useNavigationLoading();

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="business"
        backgroundGradient="from-emerald-600 via-teal-600 to-cyan-600"
        ctaLink="/checkout/businessformation"
        consultationLink="/checkout/businessformation"
      />

      {/* Main Service Overview - Business Formation */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Complete Business Formation Package
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Everything you need to start and maintain your LLC - all in one package
            </p>
          </div>

          {/* Package Includes */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-12">
            {[
              {
                title: 'LLC Formation & Filing',
                description: 'Complete LLC registration with the state, including all necessary documents and filing fees.',
                features: [
                  'Articles of Organization filing',
                  'EIN Tax ID Number application',
                  'Operating Agreement template',
                  'Bank Resolution Letter',
                  'Compliance Calendar'
                ],
                icon: <FaBuilding className="h-12 w-12 text-emerald-600" />
              },
              {
                title: 'Registered Agent Service',
                description: 'Professional registered agent service to receive legal documents on behalf of your business.',
                features: [
                  'First year included FREE',
                  'Privacy protection',
                  'Immediate document forwarding',
                  'Online document access',
                  'Compliance reminders'
                ],
                icon: <FaShieldAlt className="h-12 w-12 text-emerald-600" />
              },
              {
                title: 'Ongoing Compliance Support',
                description: 'Keep your business in good standing with ongoing compliance monitoring and reminders.',
                features: [
                  'Annual report reminders',
                  'Compliance deadline tracking',
                  'Document management',
                  'State requirement updates',
                  'Email & dashboard alerts'
                ],
                icon: <FaClipboardCheck className="h-12 w-12 text-emerald-600" />
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                      <span className="text-emerald-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Single CTA for entire package */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Complete Package: $299 + State Fees
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Get your LLC formed with registered agent service and ongoing compliance support - everything you need in one package
              </p>
              <button
                onClick={() => navigateWithLoading(`/${locale}/checkout/businessformation`)}
                disabled={isNavigating}
                className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Loading...' : 'Start Your LLC Today'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Why Choose Our Business Formation Services?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Expert guidance to start and maintain your business properly
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Expert Guidance',
                description: 'Our team of business formation experts guides you through every step of the process.',
                icon: <FaUsers className="h-12 w-12 text-emerald-600" />
              },
              {
                title: 'Fast & Efficient',
                description: 'Quick processing and filing to get your business up and running as soon as possible.',
                icon: <FaClipboardCheck className="h-12 w-12 text-emerald-600" />
              },
              {
                title: 'Complete Compliance',
                description: 'Ensure your business meets all legal requirements and stays compliant over time.',
                icon: <FaShieldAlt className="h-12 w-12 text-emerald-600" />
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Formation Timeline */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Business Formation Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Simple steps to get your business legally established
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Choose Business Structure',
                description: 'Select the right business entity type (LLC, Corporation, etc.) for your needs.'
              },
              {
                step: '02',
                title: 'Prepare Documentation',
                description: 'Gather required information and prepare all necessary formation documents.'
              },
              {
                step: '03',
                title: 'File With State',
                description: 'Submit your formation documents and fees to the appropriate state agency.'
              },
              {
                step: '04',
                title: 'Ongoing Compliance',
                description: 'Maintain your business in good standing with ongoing compliance support.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-lg font-bold">
                    {step.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection translationKey="business" />
    </div>
  );
}
