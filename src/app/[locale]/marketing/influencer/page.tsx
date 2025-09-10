'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaUserFriends, FaHandshake, FaVideo, FaChartLine } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function InfluencerMarketingPage() {
  const featureIcons = [
    <FaUserFriends key="users" className="h-8 w-8" />,
    <FaHandshake key="handshake" className="h-8 w-8" />,
    <FaVideo key="video" className="h-8 w-8" />,
    <FaChartLine key="chart" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="influencerMarketing"
        backgroundGradient="from-orange-600 via-red-600 to-pink-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="influencerMarketing"
        icons={featureIcons}
      />

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Influencer Marketing Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Strategic partnerships that drive authentic engagement
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Influencer Discovery',
                description: 'Identify and vet influencers who align with your brand values and target audience.'
              },
              {
                step: '02',
                title: 'Campaign Strategy',
                description: 'Develop comprehensive campaign strategies that maximize reach and engagement.'
              },
              {
                step: '03',
                title: 'Content Collaboration',
                description: 'Work with influencers to create authentic, high-quality content for your brand.'
              },
              {
                step: '04',
                title: 'Performance Tracking',
                description: 'Monitor campaign performance and optimize for better results and ROI.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-pink-600 text-white text-lg font-bold">
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

      {/* Influencer Types Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Types of Influencers We Work With
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              From micro to macro influencers, we find the perfect match for your brand
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                type: 'Nano Influencers',
                followers: '1K - 10K',
                description: 'High engagement rates with niche, dedicated audiences',
                color: 'from-green-400 to-blue-500'
              },
              {
                type: 'Micro Influencers',
                followers: '10K - 100K',
                description: 'Perfect balance of reach and authentic engagement',
                color: 'from-blue-400 to-purple-500'
              },
              {
                type: 'Mid-Tier Influencers',
                followers: '100K - 1M',
                description: 'Broader reach while maintaining personal connection',
                color: 'from-purple-400 to-pink-500'
              },
              {
                type: 'Macro Influencers',
                followers: '1M+',
                description: 'Maximum reach and brand awareness potential',
                color: 'from-pink-400 to-red-500'
              }
            ].map((influencer, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${influencer.color} mb-4 flex items-center justify-center`}>
                  <FaUserFriends className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {influencer.type}
                </h3>
                <p className="text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
                  {influencer.followers} followers
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {influencer.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection translationKey="influencerMarketing" />
    </div>
  );
}
