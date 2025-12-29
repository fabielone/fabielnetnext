'use client';

import { QuestionnaireSection as SectionType, Question } from '@/lib/questionnaire/types';
import { getVisibleQuestions } from '@/lib/questionnaire/schema';
import QuestionField from './QuestionField';

interface QuestionnaireSectionProps {
  section: SectionType;
  responses: Record<string, any>;
  products: string[];
  onResponseChange: (questionId: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function QuestionnaireSection({
  section,
  responses,
  products,
  onResponseChange,
  errors = {}
}: QuestionnaireSectionProps) {
  const visibleQuestions = getVisibleQuestions(section, products, responses);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
        {section.description && (
          <p className="mt-2 text-gray-600">{section.description}</p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {visibleQuestions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            value={responses[question.id]}
            onChange={(value) => onResponseChange(question.id, value)}
            error={errors[question.id]}
            allResponses={responses}
          />
        ))}
      </div>

      {/* Empty State */}
      {visibleQuestions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No questions in this section based on your selections.</p>
        </div>
      )}
    </div>
  );
}
