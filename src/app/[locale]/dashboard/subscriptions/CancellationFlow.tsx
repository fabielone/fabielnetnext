'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  RiAlertLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiUserLine,
  RiFileTextLine,
  RiCalendarLine,
  RiShieldLine,
  RiExternalLinkLine,
  RiInformationLine
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
  trialEndsAt: string | null;
  cancelledAt: string | null;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  businessId: string | null;
  businessName: string | null;
  orderId: string | null;
}

interface CancellationFlowProps {
  subscription: Subscription;
  onCancel: () => void;
  onComplete: () => void;
}

type CancellationStep = 'impact' | 'survey' | 'confirm' | 'success';

const CANCELLATION_REASONS = [
  { id: 'too_expensive', labelKey: 'tooExpensive' },
  { id: 'not_using', labelKey: 'notUsing' },
  { id: 'switching_provider', labelKey: 'switchingProvider' },
  { id: 'closing_business', labelKey: 'closingBusiness' },
  { id: 'poor_service', labelKey: 'poorService' },
  { id: 'other', labelKey: 'other' }
];

export default function CancellationFlow({ subscription, onCancel, onComplete }: CancellationFlowProps) {
  const t = useTranslations('cancellation');
  const [step, setStep] = useState<CancellationStep>('impact');
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [willAppointNewAgent, setWillAppointNewAgent] = useState(false);
  const [acknowledgedConsequences, setAcknowledgedConsequences] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceEndDate, setServiceEndDate] = useState<string | null>(null);

  // Determine service type for specific warnings
  const isRegisteredAgent = subscription.name.toLowerCase().includes('registered agent') ||
                            subscription.name.toLowerCase().includes('agente registrado');
  const isCompliancePackage = subscription.name.toLowerCase().includes('compliance') ||
                               subscription.name.toLowerCase().includes('cumplimiento');
  const isWebsite = subscription.name.toLowerCase().includes('website') ||
                    subscription.name.toLowerCase().includes('sitio web') ||
                    subscription.name.toLowerCase().includes('blog');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitCancellation = async () => {
    if (!acknowledgedConsequences) {
      setError(t('mustAcknowledge'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          reason,
          feedback,
          willAppointNewAgent,
          acknowledgedConsequences
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      setServiceEndDate(data.serviceEndDate);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/subscriptions/${subscription.id}/cancel`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reactivate subscription');
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Impact Summary
  const renderImpactStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
          <RiAlertLine className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('beforeYouGo')}</h2>
        <p className="text-gray-600 mt-2">{t('impactSummaryDesc')}</p>
      </div>

      {/* Service-specific warnings */}
      <div className="space-y-4">
        {isRegisteredAgent && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <RiShieldLine className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">{t('registeredAgent.title')}</h3>
                <p className="text-red-700 text-sm mt-1">{t('registeredAgent.warning')}</p>
                <div className="mt-3 p-3 bg-red-100 rounded-md">
                  <p className="text-red-800 text-sm font-medium">{t('registeredAgent.important')}</p>
                  <p className="text-red-700 text-xs mt-1">{t('registeredAgent.penalty')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCompliancePackage && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <RiFileTextLine className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">{t('compliance.title')}</h3>
                <p className="text-amber-700 text-sm mt-1">{t('compliance.warning')}</p>
                <ul className="mt-2 space-y-1">
                  <li className="text-amber-700 text-sm flex items-center gap-2">
                    <RiCalendarLine className="w-4 h-4" />
                    {t('compliance.statementOfInfo')}
                  </li>
                  <li className="text-amber-700 text-sm flex items-center gap-2">
                    <RiCalendarLine className="w-4 h-4" />
                    {t('compliance.franchiseTax')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {isWebsite && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <RiUserLine className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800">{t('website.title')}</h3>
                <p className="text-blue-700 text-sm mt-1">{t('website.warning')}</p>
                <p className="text-blue-600 text-xs mt-2">{t('website.dataRetention')}</p>
              </div>
            </div>
          </div>
        )}

        {/* General info about billing */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex gap-3">
            <RiInformationLine className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-800">{t('billing.title')}</h3>
              <p className="text-gray-700 text-sm mt-1">
                {t('billing.serviceUntil', { date: formatDate(subscription.currentPeriodEnd) })}
              </p>
              <p className="text-gray-600 text-xs mt-2">{t('billing.noRefund')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {t('keepSubscription')}
        </button>
        <button
          onClick={() => setStep('survey')}
          className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          {t('continue')}
          <RiArrowRightLine className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Step 2: Feedback Survey
  const renderSurveyStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{t('survey.title')}</h2>
        <p className="text-gray-600 mt-2">{t('survey.description')}</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{t('survey.reasonLabel')}</label>
        {CANCELLATION_REASONS.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
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
            <span className="text-gray-700">{t(`survey.reasons.${item.labelKey}`)}</span>
          </label>
        ))}
      </div>

      {reason === 'other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('survey.feedbackLabel')}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
            placeholder={t('survey.feedbackPlaceholder')}
          />
        </div>
      )}

      {isRegisteredAgent && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={willAppointNewAgent}
              onChange={(e) => setWillAppointNewAgent(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-amber-500 focus:ring-amber-500 rounded"
            />
            <div>
              <span className="text-amber-800 font-medium">{t('survey.appointNewAgent')}</span>
              <p className="text-amber-700 text-sm mt-1">{t('survey.appointNewAgentDesc')}</p>
            </div>
          </label>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={() => setStep('impact')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          {t('back')}
        </button>
        <button
          onClick={() => setStep('confirm')}
          className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          {t('continue')}
          <RiArrowRightLine className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Step 3: Final Confirmation
  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <RiAlertLine className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('confirm.title')}</h2>
        <p className="text-gray-600 mt-2">{t('confirm.description')}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('confirm.service')}</span>
          <span className="font-medium text-gray-900">{subscription.name}</span>
        </div>
        {subscription.businessName && (
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirm.business')}</span>
            <span className="font-medium text-gray-900">{subscription.businessName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">{t('confirm.amount')}</span>
          <span className="font-medium text-gray-900">
            ${Number(subscription.amount).toFixed(2)}/{subscription.interval}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">{t('confirm.activeUntil')}</span>
          <span className="font-medium text-gray-900">{formatDate(subscription.currentPeriodEnd)}</span>
        </div>
      </div>

      {/* Acknowledgment checkbox */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledgedConsequences}
            onChange={(e) => setAcknowledgedConsequences(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-red-500 focus:ring-red-500 rounded"
          />
          <div>
            <span className="text-red-800 font-medium">{t('confirm.acknowledge')}</span>
            <p className="text-red-700 text-sm mt-1">
              {isRegisteredAgent 
                ? t('confirm.acknowledgeRegisteredAgent')
                : t('confirm.acknowledgeGeneral')}
            </p>
          </div>
        </label>
      </div>

      {/* Terms link */}
      <p className="text-center text-sm text-gray-500">
        {t('confirm.termsPrefix')}{' '}
        <a href="/en/terms" target="_blank" className="text-amber-600 hover:underline inline-flex items-center gap-1">
          {t('confirm.termsLink')}
          <RiExternalLinkLine className="w-3 h-3" />
        </a>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={() => setStep('survey')}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          {t('back')}
        </button>
        <button
          onClick={handleSubmitCancellation}
          disabled={isSubmitting || !acknowledgedConsequences}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('confirm.processing') : t('confirm.confirmCancellation')}
        </button>
      </div>
    </div>
  );

  // Step 4: Success/Confirmation
  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <RiCheckboxCircleLine className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('success.title')}</h2>
        <p className="text-gray-600 mt-2">{t('success.description')}</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800">
          {t('success.serviceUntil', { date: formatDate(serviceEndDate) })}
        </p>
        <p className="text-green-700 text-sm mt-2">{t('success.emailSent')}</p>
      </div>

      {isRegisteredAgent && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">{t('success.nextSteps')}</h3>
          <ol className="list-decimal list-inside space-y-2 text-amber-700 text-sm">
            <li>{t('success.step1')}</li>
            <li>{t('success.step2')}</li>
            <li>{t('success.step3')}</li>
          </ol>
          <a
            href="https://bizfileonline.sos.ca.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-amber-600 hover:text-amber-700 font-medium"
          >
            {t('success.sosLink')}
            <RiExternalLinkLine className="w-4 h-4" />
          </a>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">{t('success.changedMind')}</h3>
        <p className="text-blue-700 text-sm mb-3">{t('success.reactivateInfo')}</p>
        <button
          onClick={handleReactivate}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? t('success.reactivating') : t('success.reactivate')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center pt-4 border-t">
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t('success.done')}
        </button>
      </div>
    </div>
  );

  // Progress indicator
  const steps = ['impact', 'survey', 'confirm', 'success'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t('modalTitle')}</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  i <= currentStepIndex ? 'bg-amber-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            {t('step', { current: currentStepIndex + 1, total: steps.length })}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'impact' && renderImpactStep()}
          {step === 'survey' && renderSurveyStep()}
          {step === 'confirm' && renderConfirmStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
}
