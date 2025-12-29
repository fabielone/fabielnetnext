'use client';

import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface MissingField {
  sectionId: string;
  sectionTitle: string;
  questionId: string;
  questionLabel: string;
}

interface QuestionnaireNavigationProps {
  currentIndex: number;
  totalSections: number;
  isFirstSection: boolean;
  isLastSection: boolean;
  saving: boolean;
  submitting: boolean;
  canSubmit: boolean;
  missingFields?: MissingField[];
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
  onClear?: () => void;
  onGoToSection?: (sectionId: string) => void;
}

export default function QuestionnaireNavigation({
  currentIndex,
  totalSections,
  isFirstSection,
  isLastSection,
  saving,
  submitting,
  canSubmit,
  missingFields = [],
  onPrevious,
  onNext,
  onSave,
  onSubmit,
  onClear,
  onGoToSection
}: QuestionnaireNavigationProps) {
  const [showMissing, setShowMissing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Group missing fields by section
  const missingBySection = missingFields.reduce((acc, field) => {
    if (!acc[field.sectionId]) {
      acc[field.sectionId] = { title: field.sectionTitle, fields: [] };
    }
    acc[field.sectionId].fields.push(field);
    return acc;
  }, {} as Record<string, { title: string; fields: MissingField[] }>);

  return (
    <div className="pt-6 border-t border-gray-200 mt-8">
      {/* Missing fields display */}
      {!canSubmit && isLastSection && missingFields.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowMissing(!showMissing)}
            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
          >
            <ExclamationCircleIcon className="w-5 h-5" />
            {missingFields.length} required field{missingFields.length !== 1 ? 's' : ''} missing
            <span className="text-xs">({showMissing ? 'hide' : 'show'})</span>
          </button>
          
          {showMissing && (
            <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Please complete these fields:</h4>
              {Object.entries(missingBySection).map(([sectionId, { title, fields }]) => (
                <div key={sectionId} className="mb-3 last:mb-0">
                  <button
                    type="button"
                    onClick={() => onGoToSection?.(sectionId)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline"
                  >
                    {title}
                  </button>
                  <ul className="mt-1 ml-4 text-sm text-amber-600">
                    {fields.map(field => (
                      <li key={field.questionId} className="list-disc">
                        {field.questionLabel}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clear confirmation dialog */}
      {showClearConfirm && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 mb-3">Are you sure you want to clear all responses? This cannot be undone.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onClear?.();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
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

      {/* Center - Save and Clear buttons */}
      <div className="flex items-center gap-2">
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
        
        {onClear && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear all responses"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

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
    </div>
  );
}
