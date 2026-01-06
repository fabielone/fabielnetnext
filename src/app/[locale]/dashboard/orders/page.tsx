'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { 
  RiFileList3Line,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseLine,
  RiAlertLine,
  RiEyeLine
} from 'react-icons/ri';
import OrderCancellationFlow from './OrderCancellationFlow';

interface Order {
  id: string;
  orderId: string;
  companyName: string;
  formationState: string | null;
  businessState: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING_PROCESSING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING_PROCESSING: <RiTimeLine className="w-4 h-4" />,
  PROCESSING: <RiTimeLine className="w-4 h-4 animate-pulse" />,
  COMPLETED: <RiCheckboxCircleLine className="w-4 h-4" />,
  CANCELLED: <RiCloseLine className="w-4 h-4" />,
  REFUNDED: <RiCloseLine className="w-4 h-4" />,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancellationFlow, setShowCancellationFlow] = useState<Order | null>(null);
  const locale = useLocale();
  const t = useTranslations('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if order can be cancelled (PENDING_PROCESSING or PROCESSING)
  const canCancelOrder = (order: Order) => {
    return ['PENDING_PROCESSING', 'PROCESSING'].includes(order.status);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING_PROCESSING':
        return t('pendingProcessing');
      case 'PROCESSING':
        return t('processing');
      case 'COMPLETED':
        return t('completed');
      case 'CANCELLED':
        return t('cancelled');
      case 'REFUNDED':
        return t('refunded');
      default:
        return status.replace(/_/g, ' ');
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

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <RiFileList3Line className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('noOrders')}</h2>
            <p className="text-gray-500 mb-6">{t('noOrdersDesc')}</p>
            <Link
              href={`/${locale}/checkout/businessformation`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              {t('startFormation')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const state = order.formationState || order.businessState || 'Unknown';
              
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.companyName} LLC
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {statusIcons[order.status]}
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span>{t('order')}: <span className="font-medium">{order.orderId}</span></span>
                        <span>{t('state')}: <span className="font-medium">{state}</span></span>
                        <span>{t('total')}: <span className="font-medium">${Number(order.totalAmount).toFixed(2)}</span></span>
                        <span>{t('date')}: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/${locale}/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <RiEyeLine className="w-4 h-4" />
                        {t('viewOrder')}
                      </Link>
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => setShowCancellationFlow(order)}
                          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          {t('cancelOrder')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Cancellation Flow Modal */}
        {showCancellationFlow && (
          <OrderCancellationFlow
            order={showCancellationFlow}
            onCancel={() => setShowCancellationFlow(null)}
            onComplete={() => {
              setShowCancellationFlow(null);
              fetchOrders();
            }}
          />
        )}
      </div>
    </div>
  );
}
