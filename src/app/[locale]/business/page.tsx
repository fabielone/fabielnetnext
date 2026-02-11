'use client';

import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaBuilding,
  FaShieldAlt,
  FaClipboardCheck,
  FaUsers,
  FaCheck,
  FaFileAlt,
  FaIdCard,
  FaArrowRight,
  FaRegClock,
  FaHeadset,
} from 'react-icons/fa';
import { useNavigationLoading } from '../../components/hooks/useNavigationLoading';

const PerformanceMonitor = dynamic(
  () => import('../../components/utils/performance-monitor'),
  { ssr: false }
);

export default function BusinessPage() {
  const locale = useLocale();
  const { isNavigating, navigateWithLoading } = useNavigationLoading();
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: servicesRef, inView: servicesInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden bg-gray-950 pt-20 pb-32 lg:pt-28 lg:pb-40">
        {/* Background blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-400">
                  <FaBuilding className="h-3.5 w-3.5" /> LLC Formation
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-sm font-medium text-teal-400">
                  <FaShieldAlt className="h-3.5 w-3.5" /> Registered Agent
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Launch Your LLC{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  The Right Way
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-xl">
                Complete business formation, registered agent service, and ongoing compliance
                support — everything you need to legally establish and protect your business.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateWithLoading(`/${locale}/checkout/businessformation`)}
                  disabled={isNavigating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl hover:shadow-emerald-600/30 disabled:opacity-50"
                >
                  {isNavigating ? 'Loading...' : 'Start My LLC'} {!isNavigating && <FaArrowRight className="h-4 w-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateWithLoading(`/${locale}/contact`)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-white"
                >
                  Free Consultation
                </motion.button>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaRegClock className="h-4 w-4 text-emerald-400" />
                  <span>7-10 Business Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="h-4 w-4 text-teal-400" />
                  <span>RA Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeadset className="h-4 w-4 text-cyan-400" />
                  <span>Expert Support</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl shadow-emerald-900/20 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-gray-800 text-xs text-gray-400 font-mono">
                      fabiel.net/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard mockup content */}
                <div className="p-6 space-y-4 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
                  {/* Status header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <FaBuilding className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="w-32 h-4 rounded bg-white/15" />
                        <div className="w-20 h-2.5 rounded bg-gray-700 mt-1.5" />
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xs font-medium text-emerald-400">Active</span>
                    </div>
                  </div>

                  {/* Progress tracker */}
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400 font-medium">Formation Progress</span>
                      <span className="text-xs text-emerald-400 font-medium">75%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-700">
                      <div className="w-3/4 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                    <div className="mt-3 space-y-2">
                      {['Articles Filed', 'EIN Obtained', 'Operating Agreement'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center">
                            <FaCheck className="h-2 w-2 text-emerald-400" />
                          </div>
                          <span className="text-xs text-gray-400">{item}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                        <span className="text-xs text-gray-500">Compliance Setup</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Documents', value: '12' },
                      { label: 'Filings', value: '3' },
                      { label: 'Alerts', value: '0' },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-lg bg-gray-800/60 border border-gray-700/50 p-3 text-center">
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating accents */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl blur-2xl opacity-40" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl blur-2xl opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section ref={servicesRef} className="py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Complete Business Formation{' '}
              <span className="text-emerald-600 dark:text-emerald-400">Package</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Everything you need to start and maintain your LLC — all in one package
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {[
              {
                title: 'LLC Formation & Filing',
                description: 'Complete LLC registration with the state, including all necessary documents and filing fees.',
                features: [
                  'Articles of Organization filing',
                  'EIN Tax ID Number application',
                  'Operating Agreement template',
                  'Bank Resolution Letter',
                  'Compliance Calendar',
                ],
                icon: <FaBuilding className="h-7 w-7" />,
              },
              {
                title: 'Registered Agent Service',
                description: 'Professional registered agent service to receive legal documents on behalf of your business.',
                features: [
                  'First year included FREE',
                  'Privacy protection',
                  'Immediate document forwarding',
                  'Online document access',
                  'Compliance reminders',
                ],
                icon: <FaShieldAlt className="h-7 w-7" />,
              },
              {
                title: 'Ongoing Compliance',
                description: 'Keep your business in good standing with ongoing compliance monitoring and reminders.',
                features: [
                  'Annual report reminders',
                  'Compliance deadline tracking',
                  'Document management',
                  'State requirement updates',
                  'Email & dashboard alerts',
                ],
                icon: <FaClipboardCheck className="h-7 w-7" />,
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0 mb-4 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FaCheck className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Pricing CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="relative bg-gray-950 rounded-2xl p-8 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/10" />
              <div className="relative">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">$299</span>
                  <span className="text-gray-400">+ state fees</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">LLC Formation Package</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Get your LLC formed with registered agent service and ongoing compliance support.
                </p>
                <button
                  onClick={() => navigateWithLoading(`/${locale}/checkout/businessformation`)}
                  disabled={isNavigating}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                >
                  {isNavigating ? 'Loading...' : 'Start Your LLC Today'}
                  {!isNavigating && <FaArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="relative bg-gray-950 rounded-2xl p-8 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/10" />
              <div className="relative">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">$199</span>
                  <span className="text-gray-400">/year + state fees</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Already Have an LLC?</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Annual compliance + registered agent + BOIR filing — all in one package.
                </p>
                <button
                  onClick={() => navigateWithLoading(`/${locale}/compliance`)}
                  disabled={isNavigating}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                >
                  {isNavigating ? 'Loading...' : 'View Compliance Package'}
                  {!isNavigating && <FaArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Our Services?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Expert guidance to start and maintain your business properly
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Expert Guidance',
                description: 'Our team of business formation experts guides you through every step of the process.',
                icon: <FaUsers className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
              },
              {
                title: 'Fast & Efficient',
                description: 'Quick processing and filing to get your business up and running as soon as possible.',
                icon: <FaRegClock className="h-10 w-10 text-teal-600 dark:text-teal-400" />,
              },
              {
                title: 'Complete Compliance',
                description: 'Ensure your business meets all legal requirements and stays compliant over time.',
                icon: <FaShieldAlt className="h-10 w-10 text-cyan-600 dark:text-cyan-400" />,
              },
            ].map((benefit, i) => (
              <div key={i} className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-5">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Timeline ── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Simple steps to get your business legally established
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Choose Your State', description: 'Select the state where you want to form your LLC and pick your company name.' },
              { step: '02', title: 'We Prepare Everything', description: 'We prepare Articles of Organization, EIN application, and all required documents.' },
              { step: '03', title: 'Filed & Approved', description: 'Documents are filed with the state. You receive your approved formation paperwork.' },
              { step: '04', title: 'Stay Compliant', description: 'Ongoing compliance monitoring, annual reports, and registered agent coverage.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold shadow-lg">
                  {s.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gray-950 rounded-3xl p-12 text-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Business?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of entrepreneurs who have formed their LLC with Fabiel.net.
                Get started today and we&apos;ll handle the paperwork.
              </p>
              <button
                onClick={() => navigateWithLoading(`/${locale}/checkout/businessformation`)}
                disabled={isNavigating}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                {isNavigating ? 'Loading...' : 'Form My LLC — $299 + State Fees'}
                {!isNavigating && <FaArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
