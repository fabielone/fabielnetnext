'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import SoftwareHero from '../../../components/molecules/hero/software-hero';
import FeaturesSection from '../../../components/molecules/sections/features-section';
import CTASection from '../../../components/molecules/sections/cta-section';
import { FaFileAlt, FaDatabase, FaTasks, FaSync } from 'react-icons/fa';

const PerformanceMonitor = dynamic(() => import('../../../components/utils/performance-monitor'), { ssr: false });

export default function BackOfficeBPOPage() {
  const featureIcons = [
    <FaTasks key="tasks" className="h-8 w-8" />,
    <FaFileAlt key="docs" className="h-8 w-8" />,
    <FaDatabase key="data" className="h-8 w-8" />,
    <FaSync key="sync" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      <SoftwareHero
        translationKey="backofficeBpo"
        backgroundGradient="from-teal-600 via-emerald-600 to-green-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      <FeaturesSection translationKey="backofficeBpo" icons={featureIcons} />

      {/* Packages */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Packages</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Operational support tiers for scaling teams and workflows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ops Lite',
                price: '$300',
                unit: 'per month',
                highlight: true,
                description: '20 hrs/mo task execution',
                points: ['Data entry & cleanup', 'Document processing', 'Basic reporting', 'Email follow-ups']
              },
              {
                name: 'Ops Plus',
                price: '$580',
                unit: 'per month',
                description: '45 hrs/mo + workflow optimization',
                points: ['SOP creation', 'Dashboard updates', 'Inventory or CRM sync', 'Light automation triggers']
              },
              {
                name: 'Ops Dedicated',
                price: '$1,100',
                unit: 'per month',
                description: 'Shared full-time resource',
                points: ['Daily standups', 'Advanced data structuring', 'Process QA & refinement', 'Custom integrations']
              }
            ].map((pkg, i) => (
              <div key={i} className={`relative p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${pkg.highlight ? 'ring-2 ring-emerald-600' : ''}`}>
                {pkg.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Best Value</span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{pkg.description}</p>
                <div className="mt-6 flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-emerald-600">{pkg.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{pkg.unit}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {pkg.points.map((p, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <FaTasks className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/contact" className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors">Get Started</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection translationKey="backofficeBpo" />
    </div>
  );
}
