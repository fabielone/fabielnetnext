'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import { HiArrowRight } from 'react-icons/hi';

interface CTASectionProps {
  translationKey: string;
  primaryLink?: string;
  secondaryLink?: string;
  backgroundGradient?: string;
  className?: string;
}

export default function CTASection({ 
  translationKey,
  primaryLink = '/contact',
  secondaryLink = '/contact',
  backgroundGradient = 'from-blue-600 via-purple-600 to-indigo-600',
  className = ''
}: CTASectionProps) {
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
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
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
    <section className={`relative overflow-hidden py-16 lg:py-24 ${className}`}>
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/10" />
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
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
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
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

      <motion.div 
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {t('cta.title')}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-xl text-blue-100"
          >
            {t('cta.subtitle')}
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateWithLoading(primaryLink)}
              disabled={isNavigating}
              className="flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-80"
            >
              {t('cta.button')}
              <HiArrowRight className="ml-2 h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateWithLoading(secondaryLink)}
              disabled={isNavigating}
              className="flex items-center justify-center rounded-xl border-2 border-white/50 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70"
            >
              {t('cta.consultation')}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
