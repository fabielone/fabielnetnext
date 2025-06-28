"use client"
import { useOrderForm } from './hooks/useOrderForm';
import ProgressSteps from './components/ProgressSteps';
import BasicInfoStep from './components/BasicInfoStep';
import { LLCFormData, Step } from './types';
import { useState, useEffect, useRef } from 'react';
import { UserIcon, BuildingOfficeIcon, ShieldCheckIcon, GlobeAltIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ServicesStep from './components/ServicesStep';
import AccountStep from './components/AccountStep';
import LLCDetailStep from './components/LLCDetailStep';
import PaymentStep from './components/PaymentStep';
import OrderConfirmation from './components/OrderConfirmation';

const initialFormState: LLCFormData = {
  companyName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessAddress: '',
  businessCity: '',
  businessZip: '',
  businessPurpose: '',
  registeredAgent: false,
  compliance: false,
  paymentMethod: 'stripe',
  website: null,
  phone: '',
  address: '',
};

const calculateOrderTotal = (formData: LLCFormData): number => {
  let total = 124.99; // Base price
  if (formData.registeredAgent) total += 149;
  if (formData.compliance) total += 99;
  if (formData.website) total += 299;
  return total;
};

const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const handleOrderSubmit = async (formData: LLCFormData) => {
  try {
    console.log('Order submitted:', formData);
  } catch (error) {
    console.error('Failed to submit order:', error);
  }
};

const LLCOrderForm = () => {
  const { formData, updateFormData } = useOrderForm(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    { id: 1, name: 'Basic Info', icon: UserIcon },
    { id: 2, name: 'Services', icon: BuildingOfficeIcon },
    { id: 3, name: 'Account', icon: ShieldCheckIcon },
    { id: 4, name: 'LLC Details', icon: GlobeAltIcon },
    { id: 5, name: 'Payment', icon: CreditCardIcon },
    { id: 6, name: 'Confirmation', icon: CheckCircleIcon }
  ];

  // Scroll to top when step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [currentStep]);

  const handleStepNavigation = (targetStep: number) => {
    // Allow navigation to completed steps or current step
    if (completedSteps.includes(targetStep) || targetStep <= currentStep) {
      setCurrentStep(targetStep);
    }
  };

  const handleNextStep = (stepNumber: number) => {
    // Mark current step as completed
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps(prev => [...prev, stepNumber]);
    }
    setCurrentStep(stepNumber + 1);
  };

  const handlePrevStep = (stepNumber: number) => {
    setCurrentStep(stepNumber - 1);
  };

  // Function to scroll to error field
  const scrollToError = (fieldName: string) => {
    setTimeout(() => {
      const errorElement = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
      if (errorElement) {
        errorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        (errorElement as HTMLElement).focus?.();
      }
    }, 100);
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      updateFormData,
      scrollToError
    };

    switch(currentStep) {
      case 1: 
        return <BasicInfoStep 
          {...commonProps}
          onNext={() => handleNextStep(1)}
          onPrev={() => handlePrevStep(1)}
        />;
      case 2: 
        return <ServicesStep 
          {...commonProps}
          onNext={() => handleNextStep(2)}
          onPrev={() => handlePrevStep(2)}
        />;
      case 3: 
        return <AccountStep 
          {...commonProps}
          scrollToError={scrollToError}
          onNext={() => handleNextStep(3)}
          onPrev={() => handlePrevStep(3)}
        />;
      case 4: 
        return <LLCDetailStep 
          {...commonProps}
          onNext={() => handleNextStep(4)}
          onPrev={() => handlePrevStep(4)}
        />;
      case 5: 
        return <PaymentStep 
          {...commonProps}
          orderTotal={calculateOrderTotal(formData)}
          onNext={() => handleNextStep(5)}
          onPrev={() => handlePrevStep(5)}
        />;
      case 6: 
        return <OrderConfirmation 
          {...commonProps}
          orderTotal={calculateOrderTotal(formData)}
          orderId={generateOrderId()}
          onSubmit={() => handleOrderSubmit(formData)}
          onPrev={() => handlePrevStep(6)}
        />;
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              California LLC Formation
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Professional business formation services by <span className="font-semibold text-amber-600">Fabiel.net</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div ref={formRef}>
            <ProgressSteps 
              steps={steps} 
              currentStep={currentStep} 
              completedSteps={completedSteps}
              setCurrentStep={handleStepNavigation}
            />
            
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-amber-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-gray-500">
          <p>© 2025 Fabiel.net - Professional Business Formation Services</p>
        </div>
      </div>
    </div>
  );
};

export default LLCOrderForm;