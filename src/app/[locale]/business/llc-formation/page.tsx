'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaBuilding, FaFileAlt, FaIdCard, FaShieldAlt } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function LLCFormationPage() {
  const featureIcons = [
    <FaBuilding key="building" className="h-8 w-8" />,
    <FaFileAlt key="file" className="h-8 w-8" />,
    <FaIdCard key="id" className="h-8 w-8" />,
    <FaShieldAlt key="shield" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="llcFormation"
        backgroundGradient="from-emerald-600 via-green-600 to-teal-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="llcFormation"
        icons={featureIcons}
      />

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Benefits of Forming an LLC
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Protect your personal assets and enjoy business benefits
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Personal Asset Protection',
                description: 'Separate your personal assets from business liabilities and debts.',
                icon: <FaShieldAlt className="h-12 w-12 text-emerald-600" />
              },
              {
                title: 'Tax Flexibility',
                description: 'Choose how your LLC is taxed - as sole proprietorship, partnership, or corporation.',
                icon: <FaFileAlt className="h-12 w-12 text-emerald-600" />
              },
              {
                title: 'Professional Credibility',
                description: 'Establish credibility with customers, vendors, and financial institutions.',
                icon: <FaBuilding className="h-12 w-12 text-emerald-600" />
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

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              LLC Formation Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Simple steps to get your LLC formed quickly and correctly
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Choose LLC Name',
                description: 'Select a unique name for your LLC and verify availability with the state.'
              },
              {
                step: '02',
                title: 'File Articles of Organization',
                description: 'Submit your Articles of Organization to the state along with the filing fee.'
              },
              {
                step: '03',
                title: 'Create Operating Agreement',
                description: 'Draft an operating agreement to outline ownership and operational procedures.'
              },
              {
                step: '04',
                title: 'Obtain EIN & Permits',
                description: 'Get your Federal Tax ID number and any required business licenses or permits.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold">
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

      {/* Pricing Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              LLC Formation Packages
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Choose the package that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                name: 'Basic',
                price: '$99',
                description: 'Essential LLC formation',
                features: [
                  'Articles of Organization Filing',
                  'State Filing Fees Included',
                  'Registered Agent (1st year)',
                  'Operating Agreement Template'
                ]
              },
              {
                name: 'Professional',
                price: '$199',
                description: 'Complete business setup',
                features: [
                  'Everything in Basic',
                  'Custom Operating Agreement',
                  'Federal EIN Application',
                  'Banking Resolution',
                  'Compliance Calendar'
                ],
                popular: true
              },
              {
                name: 'Premium',
                price: '$299',
                description: 'Full-service formation',
                features: [
                  'Everything in Professional',
                  'Business License Research',
                  'Corporate Kit',
                  'Expedited Processing',
                  'First Year Compliance'
                ]
              }
            ].map((pkg, index) => (
              <div key={index} className={`rounded-2xl p-8 ${pkg.popular ? 'ring-2 ring-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'bg-white dark:bg-gray-800'} shadow-lg`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{pkg.description}</p>
                  <p className="mt-4 text-4xl font-bold text-emerald-600">{pkg.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+ state fees</p>
                </div>
                <ul className="mt-8 space-y-4">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <FaShieldAlt className="h-4 w-4 text-emerald-600 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold ${pkg.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'} transition-colors duration-200`}>
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection translationKey="llcFormation" />
    </div>
  );
}
