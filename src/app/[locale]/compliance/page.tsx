'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { useNavigationLoading } from '../../components/hooks/useNavigationLoading';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaShieldAlt,
  FaFileAlt,
  FaCalendarCheck,
  FaCheck,
  FaBuilding,
  FaBalanceScale,
  FaClipboardList,
  FaUserTie,
  FaArrowRight,
  FaBell,
  FaLock,
} from 'react-icons/fa';

const PerformanceMonitor = dynamic(
  () => import('../../components/utils/performance-monitor'),
  { ssr: false }
);

interface StateFee {
  stateCode: string;
  stateName: string;
  filingFee: number;
  annualReportFee: number | null;
  franchiseTaxFee: number | null;
}

export default function CompliancePage() {
  const locale = useLocale();
  const { isNavigating, navigateWithLoading } = useNavigationLoading();
  const [stateFees, setStateFees] = useState<StateFee[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: servicesRef, inView: servicesInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: pricingRef, inView: pricingInView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchStateFees = async () => {
      try {
        const response = await fetch('/api/state-fees');
        const data = await response.json();
        if (data.success) {
          setStateFees(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch state fees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStateFees();
  }, []);

  const selectedFee = stateFees.find((f) => f.stateCode === selectedState);

  const SERVICE_PRICE = 199;
  const RA_ANNUAL = 149;

  const packageServices = [
    {
      icon: <FaFileAlt className="h-7 w-7" />,
      title: 'Annual Report Filing',
      description:
        'We prepare and file your annual report (or biennial statement) with the state so your LLC stays in good standing.',
    },
    {
      icon: <FaUserTie className="h-7 w-7" />,
      title: 'Registered Agent Service',
      description:
        'A professional registered agent in your formation state to receive legal and government correspondence on your behalf.',
    },
    {
      icon: <FaClipboardList className="h-7 w-7" />,
      title: 'BOI Report (BOIR) Filing',
      description:
        'We file your Beneficial Ownership Information Report with FinCEN as required by the Corporate Transparency Act.',
    },
    {
      icon: <FaCalendarCheck className="h-7 w-7" />,
      title: 'Compliance Calendar & Alerts',
      description:
        'Automated deadline tracking and email/dashboard alerts so you never miss a filing deadline or tax due date.',
    },
    {
      icon: <FaBalanceScale className="h-7 w-7" />,
      title: 'Operating Agreement Review',
      description:
        'Annual review of your operating agreement to ensure it reflects your current business structure and state requirements.',
    },
    {
      icon: <FaBuilding className="h-7 w-7" />,
      title: 'Good Standing Certificate',
      description:
        'We obtain your Certificate of Good Standing from the state when you need it for banking, contracts, or expansions.',
    },
  ];

  return (
    <div className="min-h-screen">
      <PerformanceMonitor />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden bg-gray-950 pt-20 pb-32 lg:pt-28 lg:pb-40">
        {/* Background blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[80px]" />
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
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400">
                  <FaShieldAlt className="h-3.5 w-3.5" /> Compliance
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-400">
                  <FaUserTie className="h-3.5 w-3.5" /> Registered Agent
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Stay Compliant.{' '}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Stay Protected.
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-xl">
                Annual compliance filings, registered agent service, and BOIR filing — all bundled
                in one affordable package so your LLC never falls out of good standing.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateWithLoading(`/${locale}/checkout/compliance`)}
                  disabled={isNavigating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-purple-600/25 transition-all hover:shadow-xl hover:shadow-purple-600/30 disabled:opacity-50"
                >
                  {isNavigating ? 'Loading...' : 'Get Started'} {!isNavigating && <FaArrowRight className="h-4 w-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-white"
                >
                  View Pricing
                </motion.button>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaBell className="h-4 w-4 text-purple-400" />
                  <span>Deadline Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="h-4 w-4 text-indigo-400" />
                  <span>RA Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLock className="h-4 w-4 text-violet-400" />
                  <span>BOIR Filed</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Compliance dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl shadow-purple-900/20 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-gray-800 text-xs text-gray-400 font-mono">
                      fabiel.net/dashboard/compliance
                    </div>
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="p-6 space-y-4 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
                  {/* Status bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <FaShieldAlt className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="w-36 h-4 rounded bg-white/15" />
                        <div className="w-24 h-2.5 rounded bg-gray-700 mt-1.5" />
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xs font-medium text-emerald-400">Good Standing</span>
                    </div>
                  </div>

                  {/* Upcoming deadlines */}
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                    <span className="text-xs text-gray-400 font-medium">Upcoming Deadlines</span>
                    <div className="mt-3 space-y-2.5">
                      {[
                        { label: 'Annual Report — CA', date: 'Apr 15, 2026', status: 'upcoming' },
                        { label: 'BOIR Update', date: 'Jun 30, 2026', status: 'upcoming' },
                        { label: 'Franchise Tax', date: 'Mar 15, 2026', status: 'filed' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.status === 'filed' ? (
                              <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center">
                                <FaCheck className="h-2 w-2 text-emerald-400" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-purple-500/50" />
                            )}
                            <span className="text-xs text-gray-300">{item.label}</span>
                          </div>
                          <span className={`text-[10px] font-medium ${item.status === 'filed' ? 'text-emerald-400' : 'text-purple-400'}`}>
                            {item.status === 'filed' ? '✓ Filed' : item.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Filings', value: '6' },
                      { label: 'Documents', value: '14' },
                      { label: 'Alerts', value: '0' },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-lg bg-gray-800/60 border border-gray-700/50 p-3 text-center">
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* RA badge */}
                  <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                    <FaUserTie className="h-5 w-5 text-purple-400" />
                    <div>
                      <span className="text-xs font-medium text-white block">Registered Agent Active</span>
                      <span className="text-[10px] text-gray-400">Coverage in all 50 states</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accents */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl blur-2xl opacity-40" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl blur-2xl opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section ref={servicesRef} className="py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything in the{' '}
              <span className="text-purple-600 dark:text-purple-400">Compliance Package</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              One annual subscription covers all the filings and services your LLC needs to stay legally compliant.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packageServices.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <FaCheck className="h-3 w-3" /> Included
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" ref={pricingRef} className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Our service fee + state fees — no hidden charges.
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-center">
                <h3 className="text-2xl font-bold text-white">
                  Compliance + Registered Agent Bundle
                </h3>
                <p className="mt-1 text-purple-100 text-sm">
                  Annual subscription • Includes BOIR filing
                </p>
              </div>

              <div className="px-8 py-8">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      ${SERVICE_PRICE}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-lg">/year</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Our service fee (Includes RA at ${RA_ANNUAL}/yr value)
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    + State filing fees at checkout
                  </p>
                </div>

                {/* State Fee Lookup */}
                <div className="mb-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaShieldAlt className="inline h-4 w-4 mr-1.5 text-purple-500" />
                    Look up your state fees
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select your state</option>
                    {stateFees.map((s) => (
                      <option key={s.stateCode} value={s.stateCode}>
                        {s.stateName}
                      </option>
                    ))}
                  </select>

                  {selectedFee && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Annual Report Fee</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selectedFee.annualReportFee
                            ? `$${selectedFee.annualReportFee}`
                            : 'No fee / varies'}
                        </span>
                      </div>
                      {selectedFee.franchiseTaxFee && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Franchise Tax</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${selectedFee.franchiseTaxFee}
                          </span>
                        </div>
                      )}
                      <hr className="border-gray-200 dark:border-gray-600" />
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-900 dark:text-white">Estimated Annual Total</span>
                        <span className="text-purple-600 dark:text-purple-400">
                          $
                          {(
                            SERVICE_PRICE +
                            (selectedFee.annualReportFee || 0) +
                            (selectedFee.franchiseTaxFee || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature list */}
                <ul className="space-y-3 mb-8">
                  {[
                    'Annual / Biennial Report Filing',
                    'Registered Agent (all 50 states)',
                    'BOI Report (BOIR) Filing',
                    'Compliance Calendar & Email Alerts',
                    'Operating Agreement Review',
                    'Good Standing Certificate (on request)',
                    'Dashboard & Document Storage',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigateWithLoading(`/${locale}/checkout/compliance`)}
                  disabled={isNavigating}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isNavigating ? 'Loading...' : 'Enroll Now'}
                  {!isNavigating && <FaArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Three simple steps to year-round peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Enroll & Provide Details',
                description:
                  'Sign up, select your state, and provide your LLC details. We handle the rest.',
              },
              {
                step: '02',
                title: 'We File Everything',
                description:
                  'Annual report, BOIR, and any required state filings are submitted on your behalf.',
              },
              {
                step: '03',
                title: 'Stay Compliant Year-Round',
                description:
                  'Receive alerts before deadlines, access documents in your dashboard, and renew easily each year.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-20 lg:py-28 bg-gray-950 overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Don&apos;t Risk Losing Your LLC
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Missing compliance deadlines can lead to penalties, late fees, or even involuntary dissolution.
            Let us keep your business protected.
          </p>
          <button
            onClick={() => navigateWithLoading(`/${locale}/checkout/compliance`)}
            disabled={isNavigating}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
          >
            {isNavigating ? 'Loading...' : 'Enroll in Compliance Package'}
            {!isNavigating && <FaArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </section>
    </div>
  );
}
