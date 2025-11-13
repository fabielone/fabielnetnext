'use client';

import { useState } from 'react';
import { motion} from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';


export default function HeroRight() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const t = useTranslations('HeroRight');
  const locale = useLocale();
  const { isNavigating, navigateWithLoading } = useNavigationLoading();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="pt-2 sm:pt-4 flex w-full"
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col items-center h-full">
          <motion.div 
            className="bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-900 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col h-full w-full max-w-sm sm:max-w-lg border border-white/20 dark:border-gray-700/50"
            whileHover={{ 
              boxShadow: '0 15px 30px -8px rgba(245, 158, 11, 0.15)',
              scale: 1.003
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {/* Video Section */}
            <motion.div 
              className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700"
              onHoverStart={() => setIsVideoHovered(true)}
              onHoverEnd={() => setIsVideoHovered(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: isVideoHovered ? 1.05 : 1,
                    boxShadow: isVideoHovered ? '0 0 15px rgba(34, 197, 94, 0.4)' : '0 0 0px rgba(34, 197, 94, 0)'
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 dark:bg-gray-100/95 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className="text-amber-600 dark:text-amber-700 w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                </motion.div>
              </div>
              
              {/* Video Label */}
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20">
                <motion.div 
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2 py-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t('videoLabel')}</span>
                </motion.div>
              </div>
              
              <video
                className="w-full h-full object-cover"
                poster="https://img.youtube.com/vi/SABZN5JfGAQ/maxresdefault.jpg"
                preload="none"
                playsInline
                muted
              >
                <source
                  src="https://www.youtube.com/watch?v=SABZN5JfGAQ"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </motion.div>

            {/* Content Section */}
            <div className="p-4 sm:p-5 flex-grow bg-gradient-to-b from-white/90 via-blue-50/20 to-white/80 dark:from-gray-800/90 dark:via-gray-800/95 dark:to-gray-900/90">
      
              {/* Pricing Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30 mb-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {t('pricing.price')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {t('pricing.stateFees')}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span>{t('pricing.benefits.fastProcessing')}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span>{t('pricing.benefits.clientCount')}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span>{t('pricing.benefits.expertSupport')}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span>{t('pricing.benefits.moneyBack')}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-emerald-200 dark:border-emerald-800/30">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {t('pricing.footnote')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div 
                className="text-lg flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateWithLoading(`/${locale}/checkout/businessformation`)}
                  disabled={isNavigating}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 rounded-lg border border-amber-500 hover:border-amber-600 shadow-md hover:shadow-lg transition-all duration-300 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center">
                    <span>{isNavigating ? 'Loading...' : t('cta')}</span>
                    {!isNavigating && (
                      <motion.span
                        className="ml-3"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                      >
                        <FaPlay className="h-4 w-4" />
                      </motion.span>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}