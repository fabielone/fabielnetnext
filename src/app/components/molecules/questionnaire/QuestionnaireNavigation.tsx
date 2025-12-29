'use client';

import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

interface QuestionnaireNavigationProps {
  currentIndex: number;
  totalSections: number;
  isFirstSection: boolean;
  isLastSection: boolean;
  saving: boolean;
  submitting: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
}

export default function QuestionnaireNavigation({
  currentIndex,
  totalSections,
  isFirstSection,
  isLastSection,
  saving,
  submitting,
  canSubmit,
  onPrevious,
  onNext,
  onSave,
  onSubmit
}: QuestionnaireNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
      {/* Left side - Previous button */}
      <div>
        {!isFirstSection && (
          <button
            type="button"
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </button>
        )}
      </div>

      {/* Center - Save button */}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </span>
        ) : (
          'Save Progress'
        )}
      </button>

      {/* Right side - Next or Submit button */}
      <div>
        {isLastSection ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Submit Questionnaire
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
