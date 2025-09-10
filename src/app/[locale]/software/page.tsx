'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../components/molecules/hero/software-hero';
import ServicesShowcase from '../../components/molecules/sections/services-showcase';
import CTASection from '../../components/molecules/sections/cta-section';
import { useTranslations } from 'next-intl';
import { FaCode, FaShoppingCart, FaCog, FaLaptopCode, FaServer, FaMobile } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../components/utils/performance-monitor'), {
  ssr: false
});

export default function SoftwarePage() {
  const t = useTranslations('software');

  const services = [
    {
      title: t('services.web.title'),
      description: t('services.web.description'),
      features: t.raw('services.web.features'),
      link: '/software/web-blog'
    },
    {
      title: t('services.ecommerce.title'),
      description: t('services.ecommerce.description'),
      features: t.raw('services.ecommerce.features'),
      link: '/software/ecommerce'
    },
    {
      title: t('services.custom.title'),
      description: t('services.custom.description'),
      features: t.raw('services.custom.features'),
      link: '/software/custom'
    }
  ];

  const serviceIcons = [
    <FaLaptopCode key="web" className="h-8 w-8" />,
    <FaShoppingCart key="ecommerce" className="h-8 w-8" />,
    <FaCog key="custom" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="software"
        backgroundGradient="from-blue-600 via-purple-600 to-indigo-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Services Showcase */}
      <ServicesShowcase
        translationKey="software"
        services={services}
        icons={serviceIcons}
      />

      {/* Technologies Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Modern Technologies
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              We use cutting-edge technologies to build scalable, performant solutions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: 'React', icon: <FaCode /> },
              { name: 'Next.js', icon: <FaLaptopCode /> },
              { name: 'Node.js', icon: <FaServer /> },
              { name: 'TypeScript', icon: <FaCode /> },
              { name: 'React Native', icon: <FaMobile /> },
              { name: 'PostgreSQL', icon: <FaServer /> },
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl text-blue-600 dark:text-blue-400 mb-3">
                  {tech.icon}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        translationKey="software"
        primaryLink="/contact"
        secondaryLink="/contact"
        backgroundGradient="from-blue-600 via-purple-600 to-indigo-600"
      />
    </div>
  );
}
