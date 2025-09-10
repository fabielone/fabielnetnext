'use client';

import { motion, Variants } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import { useInView } from 'react-intersection-observer';

interface SoftwareHeroProps {
  translationKey: string;
  backgroundGradient?: string;
  ctaLink?: string;
  consultationLink?: string;
}

export default function SoftwareHero({ 
  translationKey, 
  backgroundGradient = 'from-blue-600 via-purple-600 to-green-600',
  ctaLink = '/contact',
  consultationLink = '/contact'
}: SoftwareHeroProps) {
  const t = useTranslations(translationKey);
  const { isNavigating, navigateWithLoading } = useNavigationLoading();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={`relative overflow-hidden bg-gradient-to-br ${backgroundGradient} py-16 lg:py-24`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            <span className="block">{t('hero.heading')}</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-6 max-w-3xl text-xl text-blue-100 sm:text-2xl"
          >
            {t('hero.subtitle')}
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-4 max-w-2xl text-lg text-blue-200"
          >
            {t('hero.description')}
          </motion.p>

          {/* Feature Pills */}
          {(() => {
            try {
              const features = t.raw('hero.features');
              return Array.isArray(features) && features.length > 0 ? (
                <motion.div 
                  variants={itemVariants}
                  className="mt-8 flex flex-wrap justify-center gap-3"
                >
                  {features.map((feature: string, index: number) => (
                    <motion.span
                      key={index}
                      className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </motion.div>
              ) : null;
            } catch (e) {
              return null;
            }
          })()}

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateWithLoading(ctaLink)}
              disabled={isNavigating}
              className="flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-80"
            >
              {isNavigating ? (
                <LoadingSpinner size="small" color="text-gray-900" message="" />
              ) : (
                <>
                  {t('hero.cta')}
                  <HiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateWithLoading(consultationLink)}
              disabled={isNavigating}
              className="flex items-center justify-center rounded-xl border-2 border-white/50 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70"
            >
              {t('hero.consultationCta')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
