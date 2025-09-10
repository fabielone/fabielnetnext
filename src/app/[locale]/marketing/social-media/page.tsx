'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaUsers, FaHeart, FaBullhorn, FaChartBar } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function SocialMediaMarketingPage() {
  const featureIcons = [
    <FaUsers key="users" className="h-8 w-8" />,
    <FaHeart key="heart" className="h-8 w-8" />,
    <FaBullhorn key="bullhorn" className="h-8 w-8" />,
    <FaChartBar key="chart" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="socialMedia"
        backgroundGradient="from-pink-600 via-purple-600 to-blue-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="socialMedia"
        icons={featureIcons}
      />

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Social Media Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Strategic approach to building your social media presence
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Social Audit & Strategy',
                description: 'Analyze your current presence and create a comprehensive social media strategy.'
              },
              {
                step: '02',
                title: 'Content Creation',
                description: 'Develop engaging content that resonates with your audience and builds your brand.'
              },
              {
                step: '03',
                title: 'Community Management',
                description: 'Actively engage with your audience to build relationships and foster loyalty.'
              },
              {
                step: '04',
                title: 'Analytics & Optimization',
                description: 'Track performance and continuously optimize your social media strategy.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-lg font-bold">
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

      {/* Platforms Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Platforms We Manage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              We help you succeed on all major social media platforms
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'Facebook', color: 'bg-blue-600' },
              { name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-600' },
              { name: 'Twitter/X', color: 'bg-black' },
              { name: 'LinkedIn', color: 'bg-blue-700' },
              { name: 'TikTok', color: 'bg-black' },
              { name: 'YouTube', color: 'bg-red-600' },
              { name: 'Pinterest', color: 'bg-red-500' },
              { name: 'Snapchat', color: 'bg-yellow-400' }
            ].map((platform, index) => (
              <div 
                key={index}
                className="flex items-center justify-center h-20 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ background: platform.color }}
              >
                {platform.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection translationKey="socialMedia" />
    </div>
  );
}
