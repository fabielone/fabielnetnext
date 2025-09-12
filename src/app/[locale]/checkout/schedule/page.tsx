'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import ConsultationForm from '../../../components/molecules/forms/ScheduleForm';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner 
        size="large" 
        color="text-amber-600" 
        message="Loading Consultation..." 
      />
      <div className="mt-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Preparing Your Consultation
        </h2>
        <p className="text-gray-600">
          Setting up your personalized consultation form...
        </p>
      </div>
    </div>
  </div>
);

function ScheduleContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service') || '';
  const t = useTranslations('services');

  const getServiceDetails = (serviceId: string) => {
    const serviceMap = {
      software: {
        title: 'Software Development Consultation',
        description: 'Discuss your web development and software needs',
        gradient: 'from-purple-50 to-pink-100',
        emoji: '💻'
      },
      marketing: {
        title: 'Digital Marketing Consultation',
        description: 'Plan your digital marketing strategy',
        gradient: 'from-emerald-50 to-teal-100',
        emoji: '📈'
      },
      bpo: {
        title: 'BPO Services Consultation',
        description: 'Explore our business process outsourcing solutions',
        gradient: 'from-amber-50 to-orange-100',
        emoji: '📞'
      },
      formation: {
        title: 'Business Formation Consultation',
        description: 'Get guidance on establishing your business',
        gradient: 'from-blue-50 to-indigo-100',
        emoji: '🏢'
      }
    };
    return serviceMap[serviceId as keyof typeof serviceMap] || {
      title: 'Free Business Consultation',
      description: 'Schedule a consultation to discuss your business needs',
      gradient: 'from-amber-50 to-orange-100',
      emoji: '💬'
    };
  };

  const serviceDetails = getServiceDetails(service);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${serviceDetails.gradient} py-12`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{serviceDetails.emoji}</div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {serviceDetails.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {serviceDetails.description}
          </p>
        </div>

        {/* Consultation Form */}
        <div className="max-w-4xl mx-auto">
          <ConsultationForm defaultService={service} />
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <ScheduleContent />
    </Suspense>
  );
}