'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaShieldAlt, FaEye, FaClipboardList, FaFileAlt } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function RegisteredAgentPage() {
  const featureIcons = [
    <FaShieldAlt key="shield" className="h-8 w-8" />,
    <FaEye key="eye" className="h-8 w-8" />,
    <FaClipboardList key="clipboard" className="h-8 w-8" />,
    <FaFileAlt key="file" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="registeredAgent"
        backgroundGradient="from-blue-600 via-indigo-600 to-purple-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="registeredAgent"
        icons={featureIcons}
      />

      {/* Why You Need Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Why Every Business Needs a Registered Agent
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Legal requirement with important benefits for your business
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Legal Requirements</h3>
              <ul className="space-y-4">
                {[
                  'Required by law in all 50 states for LLCs and Corporations',
                  'Must have a physical address (not PO Box) in state of formation',
                  'Must be available during normal business hours',
                  'Failure to maintain can result in business dissolution'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaShieldAlt className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Business Benefits</h3>
              <ul className="space-y-4">
                {[
                  'Privacy protection - keep your home address private',
                  'Professional appearance with business address',
                  'Never miss important legal documents',
                  'Compliance monitoring and deadline reminders'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaEye className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Professional vs DIY Registered Agent
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Compare your options for registered agent service
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">DIY (Self-Service)</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Act as your own registered agent</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Drawbacks:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Your personal address becomes public record</li>
                    <li>• Must be available during business hours</li>
                    <li>• Risk missing important deadlines</li>
                    <li>• Legal documents served at inconvenient times</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Service</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Let experts handle it for you</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Benefits:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Privacy protection for your address</li>
                    <li>• Professional business address</li>
                    <li>• Never miss important documents</li>
                    <li>• Compliance monitoring included</li>
                    <li>• Digital document management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* States Coverage */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Available in All 50 States
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Professional registered agent service wherever your business is formed
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[
              'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
              'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
              'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
              'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
              'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
              'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
              'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
              'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
              'Wisconsin', 'Wyoming'
            ].map((state, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection translationKey="registeredAgent" />
    </div>
  );
}
