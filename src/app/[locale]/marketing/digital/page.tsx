'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaBullhorn, FaChartLine, FaSearch, FaEnvelope, FaShareAlt, FaUsers } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function DigitalMarketingPage() {
  const featureIcons = [
    <FaSearch key="search" className="h-8 w-8" />,
    <FaUsers key="users" className="h-8 w-8" />,
    <FaEnvelope key="envelope" className="h-8 w-8" />,
    <FaChartLine key="chart" className="h-8 w-8" />
  ];
  const digitalMarketingFeatures = [
    {
      title: 'Search Engine Optimization (SEO)',
      description: 'Improve your website ranking and organic visibility on search engines',
      icon: <FaSearch className="w-6 h-6" />
    },
    {
      title: 'Pay-Per-Click Advertising (PPC)',
      description: 'Strategic paid advertising campaigns for immediate results and ROI',
      icon: <FaBullhorn className="w-6 h-6" />
    },
    {
      title: 'Content Marketing',
      description: 'Engaging content that attracts, educates, and converts your audience',
      icon: <FaShareAlt className="w-6 h-6" />
    },
    {
      title: 'Email Marketing',
      description: 'Personalized email campaigns that nurture leads and drive conversions',
      icon: <FaEnvelope className="w-6 h-6" />
    },
    {
      title: 'Analytics & Reporting',
      description: 'Comprehensive tracking and reporting to measure campaign performance',
      icon: <FaChartLine className="w-6 h-6" />
    },
    {
      title: 'Audience Targeting',
      description: 'Advanced targeting strategies to reach your ideal customers',
      icon: <FaUsers className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="digitalMarketing"
        backgroundGradient="from-blue-600 via-purple-600 to-pink-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="digitalMarketing"
        icons={featureIcons}
      />      {/* Marketing Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Digital Marketing Process
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              A strategic approach to maximize your online presence and ROI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Strategy & Planning',
                description: 'Analyze your business, competitors, and target audience to create a comprehensive marketing strategy.'
              },
              {
                step: '02',
                title: 'Campaign Setup',
                description: 'Design and implement marketing campaigns across multiple channels and platforms.'
              },
              {
                step: '03',
                title: 'Optimization',
                description: 'Continuously monitor and optimize campaigns for better performance and higher ROI.'
              },
              {
                step: '04',
                title: 'Reporting',
                description: 'Provide detailed analytics and insights to track progress and inform future strategies.'
              }
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xl font-bold mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {process.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Digital Marketing Success Metrics
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Track the metrics that matter for your business growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: 'Traffic Increase', percentage: '250%', description: 'Average organic traffic growth' },
              { metric: 'Lead Generation', percentage: '180%', description: 'Increase in qualified leads' },
              { metric: 'Conversion Rate', percentage: '120%', description: 'Improvement in conversions' },
              { metric: 'ROI', percentage: '300%', description: 'Return on marketing investment' }
            ].map((metric, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{metric.percentage}</div>
                <div className="text-lg font-semibold text-blue-100 mb-1">{metric.metric}</div>
                <div className="text-blue-200 text-sm">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection 
        translationKey="digitalMarketing"
      />
    </div>
  );
}
