import { Step } from '../types';

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  setCurrentStep: (step: number) => void;
}

const ProgressSteps = ({ steps, currentStep, completedSteps, setCurrentStep }: ProgressStepsProps) => {
  const isStepClickable = (stepId: number) => {
    return completedSteps.includes(stepId) || stepId <= currentStep;
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId) && stepId !== currentStep) {
      return 'completed';
    }
    if (stepId === currentStep) {
      return 'active';
    }
    return 'inactive';
  };

  return (
    <div className="mb-6 sm:mb-8">
      {/* Desktop Progress Steps */}
      <div className="hidden md:block">
        <nav className="flex items-center justify-center">
          <ol className="flex items-center space-x-4 lg:space-x-8">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const clickable = isStepClickable(step.id);
              
              return (
                <li key={step.id} className="flex items-center">
                  <button
                    onClick={() => clickable && setCurrentStep(step.id)}
                    disabled={!clickable}
                    className={`flex flex-col items-center transition-all ${
                      clickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-600 border-2 border-green-200 hover:bg-green-200'
                          : status === 'active'
                          ? 'bg-amber-100 text-amber-600 border-2 border-amber-300 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {status === 'completed' ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </span>
                    <span
                      className={`mt-2 text-sm font-medium text-center transition-colors ${
                        status === 'active' ? 'text-amber-600' : 
                        status === 'completed' ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <span
                      className={`mx-4 lg:mx-6 h-0.5 w-8 lg:w-12 transition-colors ${
                        completedSteps.includes(step.id) ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile Progress Steps */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
          {/* Current Step Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  getStepStatus(currentStep) === 'active'
                    ? 'bg-amber-100 text-amber-600 border border-amber-300'
                    : 'bg-green-100 text-green-600 border border-green-200'
                }`}
              >
                {completedSteps.includes(currentStep) && currentStep !== steps.length ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{currentStep}</span>
                )}
              </span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {steps[currentStep - 1]?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center text-xs text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>

            {/* Quick Step Access */}
            <div className="flex space-x-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => isStepClickable(step.id) && setCurrentStep(step.id)}
                  disabled={!isStepClickable(step.id)}
                  className={`w-6 h-6 rounded-full text-xs font-medium transition-colors ${
                    step.id === currentStep
                      ? 'bg-amber-600 text-white'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  } ${isStepClickable(step.id) ? 'hover:scale-110' : 'cursor-not-allowed'}`}
                >
                  {completedSteps.includes(step.id) && step.id !== currentStep ? (
                    <svg className="w-3 h-3 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length || !completedSteps.includes(currentStep)}
              className="flex items-center text-xs text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;