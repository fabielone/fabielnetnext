'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

export default function ProcesoPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const processSteps = [
    {
      icon: ShoppingCartIcon,
      title: 'Select Service',
      description: 'Choose from our main services or combine them according to your needs.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Consultation',
      description: 'If needed, speak with a specialist for personalized advice.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CreditCardIcon,
      title: 'Process Order',
      description: 'We confirm details and begin working on your request.',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: PlusCircleIcon,
      title: 'Additional Requirements',
      description: 'If we need more information, we\'ll reach out quickly.',
      color: 'from-teal-500 to-emerald-500',
    },
    {
      icon: CheckCircleIcon,
      title: 'Completed',
      description: 'We finalize the process and deliver the agreed results.',
      color: 'from-emerald-500 to-green-500',
    },
  ];

  const services = [
    {
      id: 'formation',
      name: 'Business Formation',
      description: 'Legal constitution of LLCs, corporations, and other types of business entities.',
      icon: DocumentTextIcon,
      url: '/business',
    },
    {
      id: 'software',
      name: 'Software Development',
      description: 'Custom technology solutions to optimize your operations.',
      icon: ComputerDesktopIcon,
      url: '/webdevelopment',
    },
  ];

  const faqs = [
    {
      question: 'How do I select the right service?',
      answer: 'Our services page details each option. If you have questions, you can request a free consultation with an agent for personalized recommendations.',
    },
    {
      question: 'What information do you need to process my order?',
      answer: 'It depends on the service. For business formation we\'ll need identification documents and business details. For software development, we\'ll analyze your specific requirements.',
    },
    {
      question: 'Can I add additional services later?',
      answer: 'Yes, our system is flexible. You can complement your initial order with other services whenever you need.',
    },
    {
      question: 'What happens if I don\'t respond to requests for additional information?',
      answer: 'We\'ll temporarily pause processing until we receive all necessary information, but we\'ll always communicate clearly about timelines.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - Compact */}
      <section className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Our
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Process</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A clear and transparent process from service selection to final delivery.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Process Steps */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Connector line (hidden on mobile and last item) */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Services */}
        <section className="mb-20">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.id}
                  href={service.url}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                        Learn more
                        <ArrowRightIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-base font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                      openFAQ === index ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Select your service now or speak with an agent for a personalized recommendation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/business"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Services
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Talk to an Agent
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}