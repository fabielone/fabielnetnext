'use client';

import { useState } from 'react';
import { motion} from 'framer-motion';
import { FaPlay, FaLinkedin } from 'react-icons/fa';
import Newsletter from '../newsletter/subscribe';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import ThemeAwareLogo from '../../atoms/theme-aware-logo';
import { SocialIcons } from '../socials/socialicons';

export default function HeroRight() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const t = useTranslations('HeroRight');
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-4"
              >
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <ThemeAwareLogo
                    width={40}
                    height={25}
                    className="opacity-90"
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent mb-2">
                  {t('title')}
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm sm:text-base leading-relaxed px-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t('description')}
              </motion.p>

              {/* Social Icons */}
              <motion.div 
                className="flex justify-center p-4 space-x-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SocialIcons />
                <motion.a
                  href="https://www.linkedin.com/your-linkedin-page"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </motion.a>
              </motion.div>

              {/* Newsletter Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 rounded-xl p-4 text-white"
              >
                <h3 className="text-base font-bold mb-1 text-center">{t('newsletter.title')}</h3>
                <p className="text-blue-100 dark:text-blue-200 text-center mb-3 text-xs">{t('newsletter.subtitle')}</p>
                
                <Newsletter
                  title={t('newsletter.cta')}
                /> 
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}