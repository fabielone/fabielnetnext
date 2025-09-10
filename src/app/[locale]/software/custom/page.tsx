'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaCode, FaDatabase, FaCloud, FaMobile, FaPlug, FaCogs } from 'react-icons/fa';

// Dynamically import performance monitor for better loading
const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), {
  ssr: false
});

export default function CustomSoftwarePage() {
  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      
      {/* Hero Section */}
      <SoftwareHero 
        translationKey="customSoftware"
        backgroundGradient="from-indigo-600 via-purple-600 to-pink-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      {/* Solutions Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Custom Solutions We Build
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Tailored software development for your unique business requirements
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Web Applications',
                description: 'Custom web apps with advanced functionality and user management systems',
                icon: <FaCode className="h-8 w-8" />,
                features: ['User Authentication', 'Real-time Features', 'Custom Dashboards', 'API Integration']
              },
              {
                title: 'API Development',
                description: 'RESTful APIs and integrations with third-party services and platforms',
                icon: <FaPlug className="h-8 w-8" />,
                features: ['REST & GraphQL APIs', 'Third-party Integrations', 'Real-time Sync', 'Documentation']
              },
              {
                title: 'Database Solutions',
                description: 'Custom database design and optimization for your specific data needs',
                icon: <FaDatabase className="h-8 w-8" />,
                features: ['Database Design', 'Performance Optimization', 'Data Migration', 'Backup Systems']
              },
              {
                title: 'Cloud Applications',
                description: 'Scalable cloud-based solutions with modern architecture and DevOps',
                icon: <FaCloud className="h-8 w-8" />,
                features: ['Cloud Deployment', 'Auto Scaling', 'Monitoring', 'Security']
              },
              {
                title: 'Mobile Apps',
                description: 'Cross-platform mobile applications for iOS and Android devices',
                icon: <FaMobile className="h-8 w-8" />,
                features: ['Cross-platform', 'Native Performance', 'App Store Deployment', 'Push Notifications']
              },
              {
                title: 'System Integration',
                description: 'Connect your existing systems and streamline business workflows',
                icon: <FaCogs className="h-8 w-8" />,
                features: ['Legacy System Integration', 'Workflow Automation', 'Data Synchronization', 'Process Optimization']
              }
            ].map((solution, index) => (
              <div key={index} className="group">
                <div className="h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                      {solution.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="mr-3 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Our Development Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Agile methodology ensuring quality and timely delivery
            </p>
          </div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {[
                {
                  number: '01',
                  title: 'Requirements Analysis',
                  description: 'Deep dive into your business needs, technical requirements, and project goals to create a comprehensive roadmap.'
                },
                {
                  number: '02',
                  title: 'Architecture Design',
                  description: 'Plan the technical architecture, select optimal technologies, and design scalable system components.'
                },
                {
                  number: '03',
                  title: 'Agile Development',
                  description: 'Iterative development with regular feedback, sprint reviews, and continuous integration practices.'
                },
                {
                  number: '04',
                  title: 'Testing & Deployment',
                  description: 'Comprehensive testing, quality assurance, and smooth deployment with ongoing support and maintenance.'
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Stack */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Technologies & Frameworks
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              We use industry-leading technologies to build robust, scalable solutions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {[
              'React', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'MongoDB',
              'AWS', 'Docker', 'GraphQL', 'Next.js', 'Express', 'FastAPI'
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-3">
                  {tech.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        translationKey="customSoftware"
        primaryLink="/contact"
        secondaryLink="/contact"
        backgroundGradient="from-indigo-600 via-purple-600 to-pink-600"
      />
    </div>
  );
}
