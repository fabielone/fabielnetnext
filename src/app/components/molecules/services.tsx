'use client';

import Header from './cards/servicecard';
import { useTranslations, useLocale } from 'next-intl';

const MyServices = () => {
  const t = useTranslations('services');
  const locale = useLocale();

  // Service routing mapping
  const getServiceRoutes = (serviceKey: string) => {
    const routes = {
      businessFormation: {
        main: `/${locale}/business`,
        checkout: `/${locale}/checkout/businessformation`
      },
      webDevelopment: {
        main: `/${locale}/webdevelopment`,
        checkout: `/${locale}/checkout/web`
      }
    };
    return routes[serviceKey as keyof typeof routes] || { main: '#', checkout: '#' };
  };

  // Locale-specific images
  const getServiceImages = (locale: string) => {
    const images = {
      en: {
        businessFormation: 'https://res.cloudinary.com/superbigone/image/upload/f_auto,q_auto,w_500/v1759091373/fabiel.net/formation_en_siajuj.png',
        webDevelopment: 'https://res.cloudinary.com/superbigone/image/upload/f_auto,q_auto,w_500/v1759091614/fabiel.net/web_en_iyhmje.png'
      },
      es: {
        businessFormation: 'https://res.cloudinary.com/superbigone/image/upload/f_auto,q_auto,w_500/v1759092666/fabiel.net/formation_es_lc5q56.png',
        webDevelopment: 'https://res.cloudinary.com/superbigone/image/upload/f_auto,q_auto,w_500/v1759091616/fabiel.net/web_es_bnseeo.png'
      }
    };
    return images[locale as keyof typeof images] || images.en;
  };

  const serviceImages = getServiceImages(locale);

  const services = [
    {
      key: 'businessFormation',
      imageUrl: serviceImages.businessFormation,
    },
    {
      key: 'webDevelopment',
      imageUrl: serviceImages.webDevelopment,
    }
  ];

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        {t('title')}
      </h2>
      <span className="text-xl font-semibold text-center mb-8 text-gray-600 dark:text-gray-300">
        {t('subtitle')}
      </span>
      <div className="flex flex-col w-full max-w-8xl relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/20 to-transparent dark:via-gray-800/20 pointer-events-none"></div>
        
        {services.map((service, index) => {
          const serviceData = t.raw(`items.${service.key}`);
          const routes = getServiceRoutes(service.key);
          return (
            <div
              key={index}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyServices;