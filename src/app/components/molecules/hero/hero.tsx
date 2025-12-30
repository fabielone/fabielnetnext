'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { FaStar } from 'react-icons/fa';

export default function Hero() {
  const t = useTranslations('Hero');
  const tRight = useTranslations('HeroRight');
  const locale = useLocale();
  const { isNavigating, navigateWithLoading } = useNavigationLoading();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const packageItems = [
    t('services.llcFormation.title'),
    t('services.einFormation.title'),
    t('services.operatingAgreement.title'),
    t('services.bankResolution.title'),
  ];

  const states = ['CA', 'TX', 'NY', 'FL', 'WA', 'IL', 'PA', 'OH'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60 dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Trust Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-slate-900/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-3.5 h-3.5 text-amber-500" />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-white/90">Trusted by 10,000+ businesses</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Launch Your LLC in{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Any State
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-8">
            Professional LLC formation with everything included. Fast, reliable, and backed by experts.
          </p>

          {/* State Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {states.map((state, i) => (
              <motion.div
                key={state}
                className="px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 text-sm font-medium text-slate-700 dark:text-white/80"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                {state}
              </motion.div>
            ))}
            <motion.div
              className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 text-sm font-medium text-amber-600 dark:text-amber-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.6 }}
            >
              + 42 more
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="grid md:grid-cols-2">
              {/* Left - Package Details */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-750">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                    COMPLETE PACKAGE
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('packageTitle')}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                  Everything you need to start your business legally
                </p>

                <div className="space-y-3">
                  {packageItems.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Bundle Offer */}
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/15 dark:to-orange-500/15 rounded-xl border border-amber-200 dark:border-amber-400/40">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-slate-800 dark:text-white font-semibold">{t('bundleOffer')}</span>
                  </div>
                </div>
              </div>

              {/* Right - Pricing & CTA */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-850 flex flex-col justify-center">
                <div className="text-center">
                  <div className="mb-2">
                    <span className="text-white/60 text-sm">Starting at</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl sm:text-6xl font-bold text-white">{tRight('pricing.price')}</span>
                  </div>
                  <p className="text-white/60 text-sm mb-6">{tRight('pricing.stateFees')}</p>

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{tRight('pricing.benefits.fastProcessing')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{tRight('pricing.benefits.expertSupport')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{tRight('pricing.benefits.clientCount')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{tRight('pricing.benefits.moneyBack')}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigateWithLoading(`/${locale}/checkout/businessformation`)}
                    disabled={isNavigating}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isNavigating ? 'Loading...' : tRight('cta')}</span>
                    {!isNavigating && <ArrowRightIcon className="w-5 h-5" />}
                  </motion.button>

                  <p className="text-white/40 text-xs mt-4">
                    {tRight('pricing.footnote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}