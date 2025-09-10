'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../components/molecules/hero/software-hero';
import ServicesShowcase from '../../components/molecules/sections/services-showcase';
import CTASection from '../../components/molecules/sections/cta-section';
import { FaBullhorn, FaChartLine, FaUsers, FaBullseye, FaInstagram, FaFacebook } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../components/utils/performance-monitor'), {
  ssr: false
});

export default function MarketingPage() {
  const marketingServices = [
    {
      title: 'Digital Marketing',
      description: 'Comprehensive online marketing strategies to grow your business',
      features: ['SEO Optimization', 'Content Marketing', 'Social Media Management', 'Email Campaigns'],
      icon: <FaBullhorn className="w-8 h-8" />,
      href: '/marketing/digital'
    },
    {
      title: 'Social Media Management',
      description: 'Professional social media presence and engagement strategies',
      features: ['Content Creation', 'Community Management', 'Analytics Reporting', 'Brand Building'],
      icon: <FaInstagram className="w-8 h-8" />,
      href: '/marketing/social-media'
    },
    {
      title: 'Influencer Marketing',
      description: 'Connect with influencers to amplify your brand reach',
      features: ['Influencer Outreach', 'Campaign Management', 'Performance Tracking', 'ROI Optimization'],
      icon: <FaUsers className="w-8 h-8" />,
      href: '/marketing/influencer'
    }
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="marketing"
        backgroundGradient="from-pink-600 via-purple-600 to-indigo-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Services Overview */}
      <ServicesShowcase 
              services={marketingServices} translationKey={''}      />

      {/* Technology Stack Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Marketing Platforms & Tools
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              We use industry-leading platforms and tools to maximize your marketing ROI
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'Google Ads', icon: <FaChartLine className="w-12 h-12 text-blue-600" /> },
              { name: 'Facebook Ads', icon: <FaFacebook className="w-12 h-12 text-blue-700" /> },
              { name: 'Instagram', icon: <FaInstagram className="w-12 h-12 text-pink-600" /> },
              { name: 'SEO Tools', icon: <FaBullhorn className="w-12 h-12 text-green-600" /> },
              { name: 'Analytics', icon: <FaChartLine className="w-12 h-12 text-purple-600" /> },
              { name: 'Content Creation', icon: <FaBullseye className="w-12 h-12 text-orange-600" /> }
            ].map((tool, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-300">
                {tool.icon}
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white text-center">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Marketing Results That Matter
            </h2>
            <p className="mt-4 text-lg text-pink-100">
              Our proven marketing strategies deliver measurable results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '300%', label: 'Average ROI Increase', description: 'Return on marketing investment' },
              { number: '150+', label: 'Successful Campaigns', description: 'Across various industries' },
              { number: '50K+', label: 'Leads Generated', description: 'For our clients annually' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-pink-100 mb-1">{stat.label}</div>
                <div className="text-pink-200 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection 
        translationKey="marketing"
      />
    </div>
  );
}
