'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuestionnaire } from '@/app/components/hooks/useQuestionnaire';
import {
  QuestionnaireProgress,
  QuestionnaireSection,
  QuestionnaireNavigation
} from '@/app/components/molecules/questionnaire';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function LocalizedQuestionnairePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t') || '';

  const {
    loading,
    error,
    questionnaire,
    sections,
    responses,
    currentSectionIndex,
    saving,
    submitting,
    submitted,
    progress,
    missingFields,
    updateResponse,
    saveProgress,
    submitQuestionnaire,
    goToSection,
    nextSection,
    prevSection,
    clearResponses
  } = useQuestionnaire({ token });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Unable to Load Questionnaire</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <ClockIcon className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Access Token Required</h2>
          <p className="mt-2 text-gray-600">
            Please use the link from your order confirmation email to access the questionnaire.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submitted state
  if (submitted || questionnaire?.status === 'COMPLETED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Questionnaire Submitted!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for completing your LLC formation questionnaire. We&apos;ll review your information and begin processing your order.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LLC Formation Questionnaire</h1>
          <p className="mt-2 text-gray-600">
            Complete this questionnaire to help us form your LLC in {questionnaire?.stateCode || 'your state'}.
          </p>
        </div>

        {/* Progress Section */}
        <QuestionnaireProgress
          sections={sections}
          currentSectionIndex={currentSectionIndex}
          onSectionClick={goToSection}
          progress={progress}
        />

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {currentSection ? (
            <>
              <QuestionnaireSection
                section={currentSection}
                responses={responses}
                products={questionnaire?.products || []}
                onResponseChange={updateResponse}
              />

              <QuestionnaireNavigation
                currentIndex={currentSectionIndex}
                totalSections={sections.length}
                isFirstSection={currentSectionIndex === 0}
                isLastSection={currentSectionIndex === sections.length - 1}
                saving={saving}
                submitting={submitting}
                canSubmit={progress === 100}
                missingFields={missingFields}
                onPrevious={prevSection}
                onNext={nextSection}
                onSave={saveProgress}
                onSubmit={submitQuestionnaire}
                onClear={clearResponses}
                onGoToSection={(sectionId) => {
                  const idx = sections.findIndex(s => s.id === sectionId);
                  if (idx >= 0) goToSection(idx);
                }}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No sections available</p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? <Link className="text-blue-600 hover:underline" href="/contact">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

