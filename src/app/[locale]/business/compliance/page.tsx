'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaClipboardCheck, FaCalculator, FaIdBadge, FaClock } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function CompliancePage() {
  const featureIcons = [
    <FaClipboardCheck key="clipboard" className="h-8 w-8" />,
    <FaCalculator key="calculator" className="h-8 w-8" />,
    <FaIdBadge key="badge" className="h-8 w-8" />,
    <FaClock key="clock" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="compliance"
        backgroundGradient="from-red-600 via-orange-600 to-yellow-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="compliance"
        icons={featureIcons}
      />

      {/* Why Compliance Matters */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Why Business Compliance Matters
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Protect your business from penalties and maintain good standing
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Avoid Penalties',
                description: 'Late or missed filings can result in hefty fines, interest charges, and legal complications.',
                icon: <FaCalculator className="h-12 w-12 text-red-600" />,
                consequences: ['$500+ late fees', 'Administrative dissolution', 'Loss of liability protection']
              },
              {
                title: 'Maintain Good Standing',
                description: 'Stay in good standing with state agencies to maintain your business privileges and protections.',
                icon: <FaIdBadge className="h-12 w-12 text-red-600" />,
                consequences: ['Ability to conduct business', 'Legal protection maintained', 'Professional credibility']
              },
              {
                title: 'Peace of Mind',
                description: 'Let experts handle compliance so you can focus on growing your business.',
                icon: <FaClock className="h-12 w-12 text-red-600" />,
                consequences: ['Never miss deadlines', 'Expert guidance', 'More time for business']
              }
            ].map((item, index) => (
              <div key={index} className="text-center bg-gray-50 dark:bg-gray-900 rounded-xl p-8">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {item.description}
                </p>
                <ul className="space-y-2 text-sm">
                  {item.consequences.map((consequence, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <FaClipboardCheck className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{consequence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Timeline */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Annual Compliance Requirements
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Stay on top of your business obligations throughout the year
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {[
              {
                quarter: 'Q1',
                title: 'Tax Planning',
                tasks: ['Annual report due (varies by state)', 'Review business licenses', 'Update business information']
              },
              {
                quarter: 'Q2',
                title: 'Mid-Year Review',
                tasks: ['Quarterly tax filings', 'License renewals', 'Compliance audit']
              },
              {
                quarter: 'Q3',
                title: 'Preparation',
                tasks: ['Prepare for year-end', 'Update registered agent info', 'Review operating agreements']
              },
              {
                quarter: 'Q4',
                title: 'Year-End',
                tasks: ['Annual tax preparation', 'Final compliance checks', 'Plan for next year']
              }
            ].map((quarter, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg">
                    {quarter.quarter}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                  {quarter.title}
                </h3>
                <ul className="space-y-2">
                  {quarter.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start">
                      <FaClipboardCheck className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State Requirements */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              State-Specific Requirements
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Every state has different compliance requirements and deadlines
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                state: 'Delaware',
                deadline: 'March 1st',
                fee: '$300',
                requirements: ['Annual report', 'Franchise tax', 'Registered agent']
              },
              {
                state: 'California',
                deadline: 'Varies',
                fee: '$800+',
                requirements: ['Statement of Information', 'Franchise tax', 'LLC fee']
              },
              {
                state: 'Texas',
                deadline: 'May 15th',
                fee: '$0',
                requirements: ['Public Information Report', 'No fee required', 'Registered agent']
              },
              {
                state: 'Florida',
                deadline: 'May 1st',
                fee: '$138.75',
                requirements: ['Annual report', 'State filing fee', 'Registered agent']
              },
              {
                state: 'New York',
                deadline: 'Varies',
                fee: '$50',
                requirements: ['Biennial statement', 'State fee', 'Operating agreement']
              },
              {
                state: 'Nevada',
                deadline: 'Last day of anniversary month',
                fee: '$325',
                requirements: ['Annual list', 'License fee', 'Registered agent']
              }
            ].map((info, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{info.state}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline:</span>
                    <p className="text-gray-900 dark:text-white">{info.deadline}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee:</span>
                    <p className="text-gray-900 dark:text-white">{info.fee}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Requirements:</span>
                    <ul className="mt-1 space-y-1">
                      {info.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-sm text-gray-600 dark:text-gray-300">• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection translationKey="compliance" />
    </div>
  );
}
