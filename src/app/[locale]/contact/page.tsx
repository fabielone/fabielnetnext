'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { SocialIcons } from '../../components/molecules/socials/socialicons';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - Compact */}
      <section className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t('title')}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> {t('titleHighlight')}</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Sales Team */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('salesTeam.title')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('salesTeam.subtitle')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  {t('salesTeam.available')}
                </span>
              </div>

              <div className="space-y-4">
                <a href="mailto:sales@fabiel.net" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">sales@fabiel.net</span>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('salesTeam.hours')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('salesTeam.liveChat')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('salesTeam.followUs')}</p>
                <SocialIcons />
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('support.title')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('support.subtitle')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {t('support.availability')}
                </span>
              </div>

              <div className="space-y-4">
                <a href="mailto:support@fabiel.net" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">support@fabiel.net</span>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('support.phoneComing')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{t('support.priorityChat')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('support.followUs')}</p>
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Contact Options */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('additional.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('additional.liveChat.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('additional.liveChat.description')}
                </p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <UserGroupIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('additional.socialMedia.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('additional.socialMedia.description')}
                </p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <EnvelopeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('additional.email.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('additional.email.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {t('quickLinks.title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('quickLinks.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/ourprocess"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              {t('quickLinks.faq')}
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <BookOpenIcon className="w-5 h-5" />
              {t('quickLinks.resources')}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}