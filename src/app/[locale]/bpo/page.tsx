'use client';

import dynamic from 'next/dynamic';
import SoftwareHero from '../../components/molecules/hero/software-hero';
import ServicesShowcase from '../../components/molecules/sections/services-showcase';
import CTASection from '../../components/molecules/sections/cta-section';
import { useTranslations } from 'next-intl';
import { FaPhoneAlt, FaUsersCog, FaChartLine } from 'react-icons/fa';

const PerformanceMonitor = dynamic(() => import('../../components/utils/performance-monitor'), { ssr: false });

export default function BPOPage() {
  const t = useTranslations('bpo');

  const services = [
    {
      title: t('services.outbound.title'),
      description: t('services.outbound.description'),
      features: t.raw('services.outbound.features'),
      link: '/bpo/outbound'
    },
    {
      title: t('services.backoffice.title'),
      description: t('services.backoffice.description'),
      features: t.raw('services.backoffice.features'),
      link: '/bpo/backoffice'
    }
  ];

  const serviceIcons = [
    <FaPhoneAlt key="outbound" className="h-8 w-8" />, 
    <FaUsersCog key="backoffice" className="h-8 w-8" />
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />
      <SoftwareHero 
        translationKey="bpo"
        backgroundGradient="from-cyan-600 via-sky-600 to-blue-600"
        ctaLink="/contact"
        consultationLink="/contact"
      />

      <ServicesShowcase
        translationKey="bpo"
        services={services}
        icons={serviceIcons}
      />

      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Why Outsource with Us?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300">Scalable, data-driven BPO operations aligned with your growth goals.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Specialized Talent',
                desc: 'Trained bilingual agents optimized for conversion and retention.'
              },
              {
                title: 'Data Transparency',
                desc: 'Daily metrics, QA scoring, call outcomes and CRM sync.'
              },
              {
                title: 'Process Integration',
                desc: 'We plug into your workflows, playbooks, and tooling stack.'
              }
            ].map((b, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{b.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Core Metrics Tracked</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">Every BPO engagement includes performance dashboards.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { kpi: 'Connect Rate', value: '42%' },
              { kpi: 'Appointments/Day', value: '8' },
              { kpi: 'QA Score', value: '94%' },
              { kpi: 'Show Rate', value: '78%' }
            ].map((m,i) => (
              <div key={i} className="rounded-lg bg-white dark:bg-gray-800 p-6 text-center shadow">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">{m.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{m.kpi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection translationKey="bpo" />
    </div>
  );
}
