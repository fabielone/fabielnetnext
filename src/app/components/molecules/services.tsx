'use client';

import Header from './cards/servicecard';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const MyServices = () => {
  const t = useTranslations('services');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const services = [
    {
      key: 'businessFormation',
      imageUrl: './formacion.jpeg',
      imagePosition: 'right' as const,
    },
    {
      key: 'webDevelopment',
      imageUrl: './web.jpeg',
      imagePosition: 'left' as const,
    },
    {
      key: 'digitalMarketing',
      imageUrl: './marketing.jpeg',
      imagePosition: 'right' as const,
    }
  ];

  return (
    <div ref={ref} className="flex flex-col items-center p-6 bg-white dark:bg-gray-900">
      <motion.h2 
        className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {t('title')}
      </motion.h2>
      <motion.span 
        className="text-xl font-semibold text-center mb-8 text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('subtitle')}
      </motion.span>
      <div className="flex flex-col space-y-12 w-full max-w-6xl">
        {services.map((service, index) => {
          const serviceData = t.raw(`items.${service.key}`);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Header
                pill={serviceData.pill}
                title={serviceData.title}
                subtitle={serviceData.subtitle}
                description={serviceData.description}
                buttonText={t('buttonText')}
                buttonLink="#"
                learnMoreLink="#"
                imageUrl={service.imageUrl}
                items={serviceData.features.map((text, i) => ({
                  icon: ['📈', '📆', '📝', '📱', '💻', '⚡'][i],
                  text
                }))}
                imagePosition={service.imagePosition}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyServices;