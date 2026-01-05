'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  RiAlertLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiShieldLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiExternalLinkLine,
  RiInformationLine,
  RiLoader4Line,
  RiCheckLine,
  RiRefreshLine
} from 'react-icons/ri';

interface Order {
  id: string;
  orderId: string;
  companyName: string;
  status: string;
  totalAmount: number;
  formationState?: string | null;
}

interface RefundBreakdown {
  serviceFeePaid: number;
  stateFilingFeePaid: number;
  rushFeePaid: number;
  processingFeeRetained: number;
  stateFeesRefundable: boolean;
  serviceFeesRefundable: number;
  totalRefund: number;
  stateFeesPaidToState: boolean;
}

interface ProgressEvent {
  eventType: string;
  completedAt: string | null;
}

interface ActiveSubscription {
  id: string;
  name: string;
  status: string;
  amount: number;
  interval: string;
}

interface OrderCancellationFlowProps {
  order: Order;
  onCancel: () => void;
  onComplete: () => void;
}

type CancellationStep = 'loading' | 'impact' | 'survey' | 'confirm' | 'success' | 'blocked';

const CANCELLATION_REASONS = [
  { id: 'changed_mind', labelKey: 'changedMind' },
  { id: 'too_expensive', labelKey: 'tooExpensive' },
  { id: 'found_alternative', labelKey: 'foundAlternative' },
  { id: 'not_ready', labelKey: 'notReady' },
  { id: 'wrong_state', labelKey: 'wrongState' },
  { id: 'other', labelKey: 'other' }
];

export default function OrderCancellationFlow({ order, onCancel, onComplete }: OrderCancellationFlowProps) {
  const t = useTranslations('orderCancellation');
  const [step, setStep] = useState<CancellationStep>('loading');
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [acknowledgedConsequences, setAcknowledgedConsequences] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isCancellable, setIsCancellable] = useState(false);
  const [isSubmittedToState, setIsSubmittedToState] = useState(false);
  const [refundBreakdown, setRefundBreakdown] = useState<RefundBreakdown | null>(null);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  // Fetch cancellation info on mount
  useEffect(() => {
    const fetchCancellationInfo = async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}/cancel`, {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch cancellation info');
        }

        const data = await res.json();
        console.log('Cancellation info:', data); // Debug log
        
        setIsCancellable(data.isCancellable);
        setIsSubmittedToState(data.isSubmittedToState);
        setRefundBreakdown(data.refundBreakdown);
        setProgressEvents(data.progressEvents || []);
        setActiveSubscriptions(data.activeSubscriptions || []);
        
        if (data.debug?.reason) {
          setBlockedReason(data.debug.reason);
        }

        if (!data.isCancellable) {
          setStep('blocked');
        } else {
          setStep('impact');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStep('blocked');
      }
    };

    fetchCancellationInfo();
  }, [order.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const handleSubmitCancellation = async () => {
    if (!acknowledgedConsequences) {
      setError(t('mustAcknowledge'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          reason,
          feedback,
          acknowledgedConsequences
        })
      });

      const data = await res.json();
      console.log('Cancel response:', data); // Debug log

      if (!res.ok) {
        // Show detailed error in development
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : (data.error || 'Failed to cancel order');
        throw new Error(errorMsg);
      }

      setRefundAmount(data.refundAmount || 0);
      setStep('success');
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get completed progress steps for status tracker
  const getProgressStatus = () => {
    const steps = [
      { type: 'ORDER_RECEIVED', label: t('progress.orderReceived') },
      { type: 'LLC_FILED', label: t('progress.llcFiled') },
      { type: 'LLC_APPROVED', label: t('progress.llcApproved') }
    ];

    return steps.map(step => ({
      ...step,
      completed: progressEvents.some(e => e.eventType === step.type && e.completedAt)
    }));
  };

  // Loading state
  if (step === 'loading') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
          <RiLoader4Line className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Blocked state (already submitted to state or invalid status)
  const renderBlockedStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-2">
          <RiAlertLine className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t('blocked.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {blockedReason || t('blocked.description')}
        </p>
      </div>

      {/* Only show progress tracker if blocked due to state submission */}
      {isSubmittedToState && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-xs font-medium text-gray-700 mb-2">{t('blocked.progressTitle')}</h3>
          <div className="space-y-1.5">
            {getProgressStatus().map((step, index) => (
              <div key={step.type} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.completed ? (
                    <RiCheckLine className="w-3 h-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {step.type === 'LLC_FILED' && step.completed && (
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                    {t('blocked.pointOfNoReturn')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-amber-800 text-sm">
          {t('blocked.contactSupport')}
        </p>
        <a
          href="mailto:support@fabiel.net"
          className="inline-flex items-center gap-1 mt-1 text-sm text-amber-700 font-medium hover:text-amber-800"
        >
          {t('blocked.emailSupport')}
          <RiExternalLinkLine className="w-3 h-3" />
        </a>
      </div>

      <div className="flex justify-center pt-3 border-t">
        <button
          onClick={onCancel}
          className="px-5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );

  // Step 1: Impact Summary with Refund Breakdown
  const renderImpactStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-2">
          <RiAlertLine className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t('impact.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('impact.description')}</p>
      </div>

      {/* Refund Breakdown */}
      {refundBreakdown && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <RiMoneyDollarCircleLine className="w-4 h-4 text-green-600" />
            <h3 className="font-semibold text-green-800 text-sm">{t('impact.refundBreakdown')}</h3>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('impact.serviceFee')}</span>
              <span className="text-gray-900">{formatCurrency(refundBreakdown.serviceFeePaid)}</span>
            </div>
            {refundBreakdown.stateFilingFeePaid > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('impact.stateFilingFee')}</span>
                <span className="text-gray-900">{formatCurrency(refundBreakdown.stateFilingFeePaid)}</span>
              </div>
            )}
            {refundBreakdown.rushFeePaid > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('impact.rushFee')}</span>
                <span className="text-gray-900">{formatCurrency(refundBreakdown.rushFeePaid)}</span>
              </div>
            )}
            {refundBreakdown.processingFeeRetained > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>{t('impact.processingFeeRetained')}</span>
                <span>-{formatCurrency(refundBreakdown.processingFeeRetained)}</span>
              </div>
            )}
            <div className="pt-1 mt-1 border-t border-green-200 flex justify-between font-semibold">
              <span className="text-green-800">{t('impact.totalRefund')}</span>
              <span className="text-green-800">{formatCurrency(refundBreakdown.totalRefund)}</span>
            </div>
          </div>
          {refundBreakdown.processingFeeRetained > 0 && (
            <p className="text-xs text-green-700 mt-1">{t('impact.processingFeeNote')}</p>
          )}
        </div>
      )}

      {/* Active Subscriptions Warning */}
      {activeSubscriptions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex gap-2">
            <RiRefreshLine className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-800 text-sm">
                {t('impact.subscriptionWarning.title')}
              </h3>
              <p className="text-purple-700 text-xs mt-0.5">
                {t('impact.subscriptionWarning.description', { count: activeSubscriptions.length })}
              </p>
              <p className="text-purple-700 text-xs mt-1">
                {t('impact.subscriptionWarning.actionRequired')}
              </p>
              <a
                href="/dashboard/subscriptions"
                className="inline-flex items-center gap-1 mt-2 text-xs text-purple-700 font-medium hover:text-purple-800"
              >
                {t('impact.subscriptionWarning.subscriptionsPage')}
                <RiExternalLinkLine className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Legal Warnings - Compact Grid */}
      <div className="grid gap-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex gap-2">
            <RiShieldLine className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 text-sm">{t('impact.noProtection.title')}</h3>
              <p className="text-red-700 text-xs mt-0.5">{t('impact.noProtection.warning')}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex gap-2">
            <RiFileTextLine className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 text-sm">{t('impact.nameNotReserved.title')}</h3>
              <p className="text-amber-700 text-xs mt-0.5">{t('impact.nameNotReserved.warning')}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <RiInformationLine className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 text-sm">{t('impact.documents.title')}</h3>
              <p className="text-blue-700 text-xs mt-0.5">{t('impact.documents.warning')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-3 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {t('keepOrder')}
        </button>
        <button
          onClick={() => setStep('survey')}
          className="flex items-center gap-2 px-5 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          {t('continue')}
          <RiArrowRightLine className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Step 2: Feedback Survey
  const renderSurveyStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900">{t('survey.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('survey.description')}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{t('survey.reasonLabel')}</label>
        {CANCELLATION_REASONS.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${
              reason === item.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="reason"
              value={item.id}
              checked={reason === item.id}
              onChange={(e) => setReason(e.target.value)}
              className="w-4 h-4 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">{t(`survey.reasons.${item.labelKey}`)}</span>
          </label>
        ))}
      </div>

      {reason === 'other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('survey.feedbackLabel')}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={2}
            placeholder={t('survey.feedbackPlaceholder')}
          />
        </div>
      )}

      <div className="flex justify-between pt-3 border-t">
        <button
          onClick={() => setStep('impact')}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          {t('back')}
        </button>
        <button
          onClick={() => setStep('confirm')}
          className="flex items-center gap-2 px-5 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          {t('continue')}
          <RiArrowRightLine className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Step 3: Final Confirmation
  const renderConfirmStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-2">
          <RiAlertLine className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t('confirm.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('confirm.description')}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('confirm.company')}</span>
          <span className="font-medium text-gray-900">{order.companyName} LLC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('confirm.state')}</span>
          <span className="font-medium text-gray-900">{order.formationState || 'CA'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('confirm.orderTotal')}</span>
          <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
        </div>
        {refundBreakdown && (
          <div className="flex justify-between text-green-700 pt-1 border-t border-gray-200">
            <span>{t('confirm.refundAmount')}</span>
            <span className="font-medium">{formatCurrency(refundBreakdown.totalRefund)}</span>
          </div>
        )}
      </div>

      {/* Acknowledgment checkbox */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledgedConsequences}
            onChange={(e) => setAcknowledgedConsequences(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-red-500 focus:ring-red-500 rounded"
          />
          <div>
            <span className="text-red-800 font-medium text-sm">{t('confirm.acknowledge')}</span>
            <p className="text-red-700 text-xs mt-0.5">{t('confirm.acknowledgeDetails')}</p>
          </div>
        </label>
      </div>

      {/* Terms link */}
      <p className="text-center text-xs text-gray-500">
        {t('confirm.termsPrefix')}{' '}
        <a href="/en/terms" target="_blank" className="text-amber-600 hover:underline inline-flex items-center gap-1">
          {t('confirm.termsLink')}
          <RiExternalLinkLine className="w-3 h-3" />
        </a>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-3 border-t">
        <button
          onClick={() => setStep('survey')}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          {t('back')}
        </button>
        <button
          onClick={handleSubmitCancellation}
          disabled={isSubmitting || !acknowledgedConsequences}
          className="px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('confirm.processing') : t('confirm.confirmCancellation')}
        </button>
      </div>
    </div>
  );

  // Step 4: Success/Confirmation
  const renderSuccessStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
          <RiCheckboxCircleLine className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t('success.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('success.description')}</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
        <p className="text-green-800 font-medium text-sm">
          {t('success.refundInfo', { amount: formatCurrency(refundAmount) })}
        </p>
        <p className="text-green-700 text-xs mt-1">{t('success.refundTimeframe')}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="font-semibold text-blue-800 text-sm">{t('success.emailSent')}</h3>
        <p className="text-blue-700 text-xs mt-0.5">{t('success.emailDetails')}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <h3 className="font-semibold text-amber-800 text-sm">{t('success.startAgain')}</h3>
        <p className="text-amber-700 text-xs mt-0.5">{t('success.startAgainDetails')}</p>
        <p className="text-amber-600 text-xs mt-1">{t('success.nameWarning')}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center pt-3 border-t">
        <button
          onClick={onComplete}
          className="px-5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t('success.done')}
        </button>
      </div>
    </div>
  );

  // Progress indicator
  const steps = ['impact', 'survey', 'confirm', 'success'];
  const currentStepIndex = step === 'blocked' ? -1 : steps.indexOf(step);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b px-4 py-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{t('modalTitle')}</h3>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar (not shown for blocked state) */}
        {step !== 'blocked' && (
          <div className="flex-shrink-0 px-4 pt-3">
            <div className="flex justify-between mb-1">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full mx-0.5 ${
                    i <= currentStepIndex ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">
              {t('step', { current: currentStepIndex + 1, total: steps.length })}
            </p>
          </div>
        )}

        {/* Content - scrollable if needed */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'blocked' && renderBlockedStep()}
          {step === 'impact' && renderImpactStep()}
          {step === 'survey' && renderSurveyStep()}
          {step === 'confirm' && renderConfirmStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
}
