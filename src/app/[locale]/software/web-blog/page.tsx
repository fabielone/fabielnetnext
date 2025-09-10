'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaDesktop, FaSearch, FaRocket, FaEdit } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function WebBlogPage() {
  const featureIcons = [
    <FaDesktop key="desktop" className="h-8 w-8" />,
    <FaSearch key="search" className="h-8 w-8" />,
    <FaRocket key="rocket" className="h-8 w-8" />,
    <FaEdit key="edit" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="webBlog"
        backgroundGradient="from-green-600 via-blue-600 to-purple-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Features Section */}
      <FeaturesSection
        translationKey="webBlog"
        icons={featureIcons}
      />

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Development Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              From concept to launch, we ensure your website exceeds expectations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Discovery & Planning',
                description: 'We analyze your needs, target audience, and business goals to create the perfect website strategy.'
              },
              {
                step: '02', 
                title: 'Design & Prototyping',
                description: 'Create stunning visual designs and interactive prototypes that reflect your brand identity.'
              },
              {
                step: '03',
                title: 'Development & Testing',
                description: 'Build your website using modern technologies with thorough testing across all devices.'
              },
              {
                step: '04',
                title: 'Launch & Support',
                description: 'Deploy your website and provide ongoing maintenance, updates, and optimization support.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-white text-xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Website Examples
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              See the quality and variety of websites we create for our clients
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Business Website',
                description: 'Professional corporate website with modern design and clear messaging',
                image: '/web.jpeg',
                features: ['Responsive Design', 'Contact Forms', 'SEO Optimized']
              },
              {
                title: 'Blog Platform',
                description: 'Content-rich blog with easy management and social sharing features',
                image: '/marketing.jpeg', 
                features: ['Content Management', 'Social Integration', 'Fast Loading']
              },
              {
                title: 'Portfolio Site',
                description: 'Creative portfolio showcasing work with interactive galleries',
                image: '/formacion.jpeg',
                features: ['Image Galleries', 'Contact Integration', 'Mobile Optimized']
              }
            ].map((example, index) => (
              <div key={index} className="group">
                <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl">
                  <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                    <img 
                      src={example.image} 
                      alt={example.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {example.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {example.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {example.features.map((feature, featureIndex) => (
                        <span 
                          key={featureIndex}
                          className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        translationKey="webBlog"
        primaryLink="/contact"
        secondaryLink="/contact"
        backgroundGradient="from-green-600 via-blue-600 to-purple-600"
      />
    </div>
  );
}
