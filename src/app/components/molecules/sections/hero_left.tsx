'use client';

import { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaStar } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';

export default function HeroLeft() {
  const t = useTranslations('Hero');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  useNavigationLoading();
  
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  const services = [
    {
      title: t('services.llcFormation.title'),
      description: t('services.llcFormation.description'),
    },
    {
      title: t('services.operatingAgreement.title'),
      description: t('services.operatingAgreement.description'),
    },
    {
      title: t('services.einFormation.title'),
      description: t('services.einFormation.description'),
    },
    {
      title: t('services.bankResolution.title'),
      description: t('services.bankResolution.description'),
    },
  ];

  // Simplified animation variants for better performance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced stagger for faster loading
        delayChildren: 0.1 // Reduced delay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 }, // Reduced movement
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200, // Increased stiffness for snappier animation
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          {/* Heading Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-6"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              <motion.span className="text-gray-600 dark:text-gray-300">
                {t('Heading')}
              </motion.span>
            </motion.h1>
            <motion.p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mt-3 font-medium">
              {t('subtitle')}
            </motion.p>
          </motion.div>
          <motion.div 
            className="flex justify-center items-center space-x-3 mt-3 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-2 shadow-lg border border-amber-100 dark:border-amber-800/30"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <FaStar className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">5.0</span>
            </motion.div>
          </motion.div>
          {/* Infinite Scrolling Pills - Temporarily Hidden
          <motion.div
            className="flex overflow-hidden whitespace-nowrap mb-8"
          >
            <motion.div
              className="flex space-x-4"
              variants={pillContainerVariants}
              animate="animate"
            >
              {[...pills, ...pills].map((pill, index) => (
                <motion.span
                  key={`pill-${index}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Pills text={pill.text} color={pill.color} bgColor={pill.bgColor} />
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          */}

          {/* Services Overview - Simplified (Pricing and Button moved to right) */}
          <motion.div 
            className="text-gray-800 dark:text-gray-200 my-6 p-6 mx-4 sm:mx-6 md:mx-8 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-blue-900/10 dark:to-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800/30"
            variants={itemVariants}
          >
            <motion.h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {t('packageTitle')}
            </motion.h3>
            
            {/* Services List - Accordion */}
            <div className="space-y-2 mb-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                      className="mt-2 flex-shrink-0 focus:outline-none"
                      aria-label={openAccordion === index ? 'Collapse' : 'Expand'}
                    >
                      <motion.div
                        animate={{ rotate: openAccordion === index ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-amber-500"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </button>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base">{service.title}</h4>
                      <AnimatePresence initial={false}>
                        {openAccordion === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1">{service.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bundle Discount Section */}
            <motion.div 
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {t('bundleText')}
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {t('bundleDiscount')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-2">
                  * Applies to Web Services + Business Formation packages
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* 50 States Section */}
          <motion.div
            className="mt-8 mx-4 sm:mx-6 md:mx-8"
            variants={itemVariants}
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
                  transition={{ delay: 0.6 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-medium text-white/90">Now Available Nationwide</span>
                </motion.div>
                
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  Start Your LLC in{' '}
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Any of the 50 States
                  </span>
                </h3>
                
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
                        transition={{ delay: 0.7 + i * 0.1 }}
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
        </div>
      </div>
    </motion.div>
  );
}