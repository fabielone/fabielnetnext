'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { 
  RiArrowLeftLine,
  RiRefreshLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseLine,
  RiAlertLine,
  RiCalendarLine
} from 'react-icons/ri';

interface Subscription {
  id: string;
  name: string;
  description: string | null;
  status: string;
  amount: number;
  interval: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAST_DUE: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PAUSED: 'bg-gray-100 text-gray-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  ACTIVE: <RiCheckboxCircleLine className="w-4 h-4" />,
  PAST_DUE: <RiTimeLine className="w-4 h-4" />,
  CANCELLED: <RiCloseLine className="w-4 h-4" />,
  PAUSED: <RiTimeLine className="w-4 h-4" />,
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const locale = useLocale();

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

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancelling(subscriptionId);
    try {
      const res = await fetch(`/api/dashboard/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchSubscriptions();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription');
    } finally {
      setCancelling(null);
      setShowCancelModal(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatInterval = (interval: string) => {
    switch (interval) {
      case 'month': return 'Monthly';
      case 'year': return 'Yearly';
      case 'week': return 'Weekly';
      default: return interval;
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
            <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
            <p className="text-gray-600 mt-1">Manage your active subscriptions and billing</p>
          </div>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <RiRefreshLine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscriptions</h2>
            <p className="text-gray-500 mb-6">You don&apos;t have any active subscriptions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[subscription.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusIcons[subscription.status]}
                        {subscription.status}
                      </span>
                    </div>
                    
                    {subscription.description && (
                      <p className="text-sm text-gray-600 mb-3">{subscription.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Amount: <span className="font-medium">${Number(subscription.amount).toFixed(2)}/{subscription.interval}</span></span>
                      <span>Billing: <span className="font-medium">{formatInterval(subscription.interval)}</span></span>
                      {subscription.currentPeriodEnd && subscription.status === 'ACTIVE' && (
                        <span className="flex items-center gap-1">
                          <RiCalendarLine className="w-4 h-4" />
                          Next billing: <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                        </span>
                      )}
                      {subscription.cancelledAt && (
                        <span className="text-red-600">Cancelled on: <span className="font-medium">{formatDate(subscription.cancelledAt)}</span></span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {subscription.status === 'ACTIVE' && (
                      <button
                        onClick={() => setShowCancelModal(subscription.id)}
                        className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <RiAlertLine className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this subscription? You will continue to have access until the end of your current billing period.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={() => handleCancelSubscription(showCancelModal)}
                  disabled={cancelling === showCancelModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling === showCancelModal ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
