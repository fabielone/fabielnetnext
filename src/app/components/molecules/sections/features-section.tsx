'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface FeaturesSectionProps {
  translationKey: string;
  icons?: ReactNode[];
  className?: string;
}

export default function FeaturesSection({ 
  translationKey,
  icons = [],
  className = ''
}: FeaturesSectionProps) {
  const t = useTranslations(translationKey);
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

  const features = t.raw('features.items') as FeatureItem[] || [];

  return (
    <section className={`py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
          >
            {t('features.title')}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div 
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:shadow-gray-800/50"
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  {icons[index] ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                      {icons[index]}
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" />
                  )}
                </div>

                {/* Content */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  initial={false}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
