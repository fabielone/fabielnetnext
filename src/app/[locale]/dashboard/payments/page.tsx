'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { 
  RiArrowLeftLine,
  RiBankCardLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseLine,
  RiRefundLine,
  RiExternalLinkLine
} from 'react-icons/ri';

interface Payment {
  id: string;
  orderId: string | null;
  subscriptionId: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  description: string | null;
  receiptUrl: string | null;
  createdAt: string;
  order?: {
    orderId: string;
    companyName: string;
  };
  subscription?: {
    name: string;
  };
}

const statusColors: Record<string, string> = {
  SUCCEEDED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-700',
  PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  SUCCEEDED: <RiCheckboxCircleLine className="w-4 h-4" />,
  PENDING: <RiTimeLine className="w-4 h-4" />,
  FAILED: <RiCloseLine className="w-4 h-4" />,
  REFUNDED: <RiRefundLine className="w-4 h-4" />,
  PARTIALLY_REFUNDED: <RiRefundLine className="w-4 h-4" />,
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'orders' | 'subscriptions'>('all');
  const locale = useLocale();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/dashboard/payments', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'orders') return payment.orderId !== null;
    if (filter === 'subscriptions') return payment.subscriptionId !== null;
    return true;
  });

  const totalAmount = filteredPayments
    .filter(p => p.status === 'SUCCEEDED')
    .reduce((sum, p) => sum + p.amount, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="text-gray-600 mt-1">View all your payments and transactions</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount, 'usd')}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <RiBankCardLine className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'orders', 'subscriptions'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All Payments' : f === 'orders' ? 'Order Payments' : 'Subscription Payments'}
            </button>
          ))}
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <RiBankCardLine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Payments Found</h2>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You haven't made any payments yet." 
                : `No ${filter === 'orders' ? 'order' : 'subscription'} payments found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusIcons[payment.status]}
                        {payment.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(payment.createdAt)}</span>
                    </div>
                    
                    <div className="mb-2">
                      {payment.order ? (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Order:</span> {payment.order.companyName} LLC ({payment.order.orderId})
                        </p>
                      ) : payment.subscription ? (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Subscription:</span> {payment.subscription.name}
                        </p>
                      ) : payment.description ? (
                        <p className="text-sm text-gray-900">{payment.description}</p>
                      ) : (
                        <p className="text-sm text-gray-500">Payment</p>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      {payment.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    {payment.receiptUrl && (
                      <a
                        href={payment.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 mt-1"
                      >
                        View Receipt <RiExternalLinkLine className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
