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
    <div className="flex flex-col items-center py-16 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="flex flex-col w-full">
          {services.map((service, index) => {
            const serviceData = t.raw(`items.${service.key}`);
            const routes = getServiceRoutes(service.key);
            return (
              <div
                key={index}
                className="relative"
              >
                {/* Separator between services */}
                {index > 0 && (
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-8"></div>
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
                  reverse={index % 2 === 1}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyServices;