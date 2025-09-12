'use client';

import Header from './cards/servicecard';
import { useTranslations, useLocale } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const MyServices = () => {
  const t = useTranslations('services');
  const locale = useLocale();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Service routing mapping
  const getServiceRoutes = (serviceKey: string) => {
    const routes = {
      businessFormation: {
        main: `/${locale}/business`,
        checkout: `/${locale}/checkout/businessformation`
      },
      webDevelopment: {
        main: `/${locale}/software`,
        checkout: `/${locale}/checkout/schedule?service=software`
      },
      digitalMarketing: {
        main: `/${locale}/marketing`,
        checkout: `/${locale}/checkout/schedule?service=marketing`
      },
      bpo: {
        main: `/${locale}/bpo`,
        checkout: `/${locale}/checkout/schedule?service=bpo`
      }
    };
    return routes[serviceKey as keyof typeof routes] || { main: '#', checkout: '#' };
  };

  const services = [
    {
      key: 'businessFormation',
      imageUrl: './formacion.jpeg',
    },
    {
      key: 'webDevelopment',
      imageUrl: './web.jpeg',
    },
    {
      key: 'digitalMarketing',
      imageUrl: './marketing.jpeg',
    },
    {
      key: 'bpo',
      imageUrl: './marketing.jpeg',
    }
  ];

  return (
    <div ref={ref} className="flex flex-col items-center p-6 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
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
      <div className="flex flex-col w-full max-w-8xl relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/20 to-transparent dark:via-gray-800/20 pointer-events-none"></div>
        
        {services.map((service, index) => {
          const serviceData = t.raw(`items.${service.key}`);
          const routes = getServiceRoutes(service.key);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative"
            >
              {/* Soft separator between services */}
              {index > 0 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent dark:via-gray-700/50"></div>
              )}
              
              <Header
                serviceKey={service.key}
                pill={serviceData.pill}
                title={serviceData.title}
                subtitle={serviceData.subtitle}
                description={serviceData.description}
                buttonText={t('buttonText')}
                buttonLink={routes.checkout}
                learnMoreLink={routes.main}
                imageUrl={service.imageUrl}
                items={serviceData.features.map((text: string, i: number) => ({
                  icon: ['📈', '📆', '📝', '📱', '💻', '⚡'][i],
                  text
                }))}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyServices;