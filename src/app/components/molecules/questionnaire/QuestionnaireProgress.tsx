'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface QuestionnaireProgressProps {
  sections: { id: string; title: string; order: number }[];
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
  progress: number;
}

export default function QuestionnaireProgress({
  sections,
  currentSectionIndex,
  onSectionClick,
  progress
}: QuestionnaireProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section steps */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section, index) => {
          const isCompleted = index < currentSectionIndex;
          const isCurrent = index === currentSectionIndex;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(index)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${isCurrent 
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-1' 
                  : isCompleted 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {isCompleted ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <span className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}
                `}>
                  {index + 1}
                </span>
              )}
              <span className="hidden sm:inline">{section.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
