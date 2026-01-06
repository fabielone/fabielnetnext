'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { 
  RiArrowLeftLine,
  RiRefreshLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseLine,
  RiAlertLine,
  RiCalendarLine,
  RiBuilding2Line,
  RiLoader4Line
} from 'react-icons/ri';
import CancellationFlow from './CancellationFlow';

interface Subscription {
  id: string;
  name: string;
  description: string | null;
  status: string;
  amount: number;
  interval: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  businessId: string | null;
  businessName: string | null;
  orderId: string | null;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAST_DUE: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PAUSED: 'bg-gray-100 text-gray-700',
  PENDING_CANCELLATION: 'bg-orange-100 text-orange-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  ACTIVE: <RiCheckboxCircleLine className="w-4 h-4" />,
  PAST_DUE: <RiTimeLine className="w-4 h-4" />,
  CANCELLED: <RiCloseLine className="w-4 h-4" />,
  PAUSED: <RiTimeLine className="w-4 h-4" />,
  PENDING_CANCELLATION: <RiAlertLine className="w-4 h-4" />,
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactivating, setReactivating] = useState<string | null>(null);
  const [showCancellationFlow, setShowCancellationFlow] = useState<Subscription | null>(null);
  const locale = useLocale();
  const t = useTranslations('subscriptions');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/dashboard/subscriptions', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async (subscriptionId: string) => {
    setReactivating(subscriptionId);
    try {
      const res = await fetch(`/api/dashboard/subscriptions/${subscriptionId}/cancel`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchSubscriptions();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      alert('Failed to reactivate subscription');
    } finally {
      setReactivating(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatInterval = (interval: string) => {
    switch (interval) {
      case 'month': return t('monthly');
      case 'year': return t('yearly');
      case 'week': return t('weekly');
      default: return interval;
    }
  };

  // Helper to determine display status
  const getDisplayStatus = (subscription: Subscription) => {
    if (subscription.cancelAtPeriodEnd && subscription.status === 'ACTIVE') {
      return 'PENDING_CANCELLATION';
    }
    return subscription.status;
  };

  const getStatusLabel = (subscription: Subscription) => {
    const displayStatus = getDisplayStatus(subscription);
    switch (displayStatus) {
      case 'PENDING_CANCELLATION':
        return t('pendingCancellation');
      case 'ACTIVE':
        return t('active');
      case 'CANCELLED':
        return t('cancelled');
      case 'PAUSED':
        return t('paused');
      case 'PAST_DUE':
        return t('pastDue');
      default:
        return displayStatus;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${locale}/dashboard`}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RiArrowLeftLine className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <RiRefreshLine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('noSubscriptions')}</h2>
            <p className="text-gray-500 mb-6">{t('noSubscriptionsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const displayStatus = getDisplayStatus(subscription);
              
              return (
                <div
                  key={subscription.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {subscription.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[displayStatus] || 'bg-gray-100 text-gray-700'}`}>
                          {statusIcons[displayStatus]}
                          {getStatusLabel(subscription)}
                        </span>
                      </div>
                      
                      {/* Business Name */}
                      {subscription.businessName && (
                        <div className="inline-flex items-center gap-2 mb-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                          <RiBuilding2Line className="w-4 h-4" />
                          <span className="font-medium">{subscription.businessName}</span>
                        </div>
                      )}
                      
                      {subscription.description && (
                        <p className="text-sm text-gray-600 mb-3">{subscription.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>{t('amount')}: <span className="font-medium">${Number(subscription.amount).toFixed(2)}/{subscription.interval}</span></span>
                        <span>{t('billing')}: <span className="font-medium">{formatInterval(subscription.interval)}</span></span>
                        
                        {/* Next billing date or cancellation date */}
                        {displayStatus === 'PENDING_CANCELLATION' ? (
                          <span className="flex items-center gap-1 text-orange-600">
                            <RiCalendarLine className="w-4 h-4" />
                            {t('endsOn')}: <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                          </span>
                        ) : subscription.trialEndsAt && new Date(subscription.trialEndsAt) > new Date() ? (
                          <span className="flex items-center gap-1">
                            <RiCalendarLine className="w-4 h-4" />
                            {t('nextBilling')}: <span className="font-medium">{formatDate(subscription.trialEndsAt)}</span>
                          </span>
                        ) : subscription.currentPeriodEnd && subscription.status === 'ACTIVE' && (
                          <span className="flex items-center gap-1">
                            <RiCalendarLine className="w-4 h-4" />
                            {t('nextBilling')}: <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                          </span>
                        )}
                        
                        {subscription.status === 'CANCELLED' && subscription.cancelledAt && (
                          <span className="text-red-600">{t('cancelledOn')}: <span className="font-medium">{formatDate(subscription.cancelledAt)}</span></span>
                        )}
                      </div>

                      {/* Pending cancellation notice */}
                      {displayStatus === 'PENDING_CANCELLATION' && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm text-orange-800">
                            <RiAlertLine className="w-4 h-4 inline-block mr-1" />
                            {t('pendingCancellationNotice', { date: formatDate(subscription.currentPeriodEnd) })}
                          </p>
                        </div>
                      )}
                    </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {displayStatus === 'ACTIVE' && (
                      <button
                        onClick={() => setShowCancellationFlow(subscription)}
                        className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {t('cancelSubscription')}
                      </button>
                    )}
                    {displayStatus === 'PENDING_CANCELLATION' && (
                      <button
                        onClick={() => handleReactivateSubscription(subscription.id)}
                        disabled={reactivating === subscription.id}
                        className="px-4 py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {reactivating === subscription.id ? (
                          <>
                            <RiLoader4Line className="w-4 h-4 animate-spin" />
                            {t('reactivating')}
                          </>
                        ) : (
                          t('reactivate')
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Flow Modal */}
        {showCancellationFlow && (
          <CancellationFlow
            subscription={showCancellationFlow}
            onCancel={() => setShowCancellationFlow(null)}
            onComplete={() => {
              setShowCancellationFlow(null);
              fetchSubscriptions();
            }}
          />
        )}
      </div>
    </div>
  );
}
