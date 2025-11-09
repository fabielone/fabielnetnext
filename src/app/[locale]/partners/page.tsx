import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface PartnerService {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
}

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'partners' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'partners' });

  const partnerServices: PartnerService[] = [
    {
      name: 'Ionos',
      description: t('services.ionos.description'),
      url: 'https://acn.ionos.com/aff_c?offer_id=1&aff_id=10824',
      category: t('categories.hosting'),
      icon: '🌐'
    },
    {
      name: 'iPostal1',
      description: t('services.ipostal1.description'),
      url: 'https://ipostal1.com/?ref=7070',
      category: t('categories.mailbox'),
      icon: '📮'
    },
    {
      name: 'CorpNet',
      description: t('services.corpnet.description'),
      url: 'http://www.corpnet.com/?PID=26466',
      category: t('categories.formation'),
      icon: '🏢'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Partner Services - Linktree Style */}
        <div className="space-y-4 mb-12">
          {partnerServices.map((service) => (
            <a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="p-6 flex items-center">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-2xl mr-4">
                  {service.icon}
                </div>
                
                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 truncate">
                      {service.name}
                    </h3>
                    <span className="flex-shrink-0 ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 ml-4 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Add New Partner Button (for future use) */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl border-2 border-dashed border-gray-300">
            <span className="text-sm font-medium">{t('morePartnersComingSoon')}</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
