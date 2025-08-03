'use client';

import Header from './cards/servicecard';
import { useTranslations } from 'next-intl';

const MyServices = () => {
  const t = useTranslations('services');

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
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        {t('title')}
      </h2>
      <span className="text-xl font-semibold text-center mb-8 text-gray-600 dark:text-gray-300">
        {t('subtitle')}
      </span>
      <div className="flex flex-col space-y-12 w-full max-w-6xl">
        {services.map((service, index) => {
          const serviceData = t.raw(`items.${service.key}`);
          return (
            <Header
              key={index}
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
          );
        })}
      </div>
    </div>
  );
};

export default MyServices;