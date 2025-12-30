'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function HeroLeft() {
  const t = useTranslations('Hero');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const packageItems = [
    { title: t('services.llcFormation.title'), desc: t('services.llcFormation.description') },
    { title: t('services.einFormation.title'), desc: t('services.einFormation.description') },
    { title: t('services.operatingAgreement.title'), desc: t('services.operatingAgreement.description') },
    { title: t('services.bankResolution.title'), desc: t('services.bankResolution.description') },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="relative font-serif px-0 md:px-4 pt-2 md:pt-4 mx-auto overflow-hidden bg-white dark:bg-gray-900"
    >
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        
        {/* 50 States Card */}
        <motion.div
          variants={itemVariants}
          className="mx-2 sm:mx-0"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6 sm:p-8">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-white/90">Now Available Nationwide</span>
              </motion.div>
              
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                Start Your LLC in{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Any of the 50 States
                </span>
              </h1>
              
              <p className="text-sm text-white/70 max-w-md mx-auto">
                From California to New York, we handle LLC formation in every state with fast processing and expert support.
              </p>
              
              {/* State icons row */}
              <div className="flex justify-center items-center gap-3 mt-5">
                <div className="flex -space-x-2">
                  {['CA', 'TX', 'NY', 'FL', 'WA'].map((state, i) => (
                    <motion.div
                      key={state}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      {state}
                    </motion.div>
                  ))}
                </div>
                <span className="text-white/50 text-sm">+ 45 more</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Package Includes Card */}
        <motion.div
          variants={itemVariants}
          className="mx-2 sm:mx-0"
        >
          <div className="bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-gray-800 dark:via-emerald-900/10 dark:to-gray-800 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-800/30 p-6">
            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('packageTitle')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Everything you need to launch your business
              </p>
            </div>

            {/* Package Items */}
            <div className="space-y-3 mb-5">
              {packageItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bundle Discount */}
            <motion.div 
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('bundleText')}
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {t('bundleDiscount')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  When bundled with Web Services
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}