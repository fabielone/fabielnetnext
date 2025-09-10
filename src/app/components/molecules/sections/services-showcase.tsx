'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { useNavigationLoading } from '../../hooks/useNavigationLoading';
import { HiArrowRight } from 'react-icons/hi';
import { ReactNode } from 'react';

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  link?: string;
  icon?: ReactNode;
}

interface ServicesShowcaseProps {
  translationKey: string;
  services: ServiceItem[];
  icons?: ReactNode[];
  className?: string;
}

export default function ServicesShowcase({ 
  translationKey,
  services,
  icons = [],
  className = ''
}: ServicesShowcaseProps) {
  const t = useTranslations(translationKey);
  const { navigateWithLoading } = useNavigationLoading();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 20
      }
    }
  };

  return (
    <section className={`py-16 lg:py-24 bg-white dark:bg-gray-800 ${className}`}>
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
            {t('services.title')}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div 
                className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
                whileHover={{ 
                  y: -8,
                  scale: 1.02
                }}
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative z-10">
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

                  {/* Service Title */}
                  <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="mb-8 space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="mr-3 h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {service.link && (
                    <motion.button
                      onClick={() => navigateWithLoading(service.link!)}
                      className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                      <HiArrowRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
