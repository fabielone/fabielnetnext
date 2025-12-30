'use client'
import { useOrderForm } from './hooks/useOrderForm';
import ProgressSteps from './components/ProgressSteps';
import { LLCFormData, Step } from './types';
import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { UserIcon, BuildingOfficeIcon, ShieldCheckIcon, GlobeAltIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../../../atoms/LoadingSpinner';
import { useAuth } from '@/app/components/providers/AuthProvider';

// Dynamic imports for step components
const BasicInfoStep = lazy(() => import('./components/BasicInfoStep'));
const ServicesStep = lazy(() => import('./components/ServicesStep'));
const AccountStep = lazy(() => import('./components/AccountStep'));
const LLCDetailStep = lazy(() => import('./components/LLCDetailStep'));
const PaymentStep = lazy(() => import('./components/PaymentStep'));
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'));

// With this updated version:
const initialFormState: LLCFormData = {
  companyName: '',
  llcSuffix: 'LLC',  // Default to LLC
  alternateNames: [],
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
  blogPro: false,
  phone: '',
  address: '',
  
  // Formation state
  formationState: '',  // Must select a state
  rushProcessing: false,
  
  // Service selections - all selected by default
  needLLCFormation: true,  // Required service, always true
  needEIN: true,
  needOperatingAgreement: true,
  needBankLetter: true,
};

const calculateOrderTotal = (formData: LLCFormData): number => {
  let total = 124.99; // Base price
  if (formData.registeredAgent) total += 149;
  if (formData.compliance) total += 99;
  
  // Website tier pricing
  if (formData.website === 'essential') total += 29.99;
  if (formData.website === 'professional') total += 49.99;
  
  // Blog Pro pricing (independent add-on)
  if (formData.blogPro) total += 49.99;
  
  return total;
};

const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const handleOrderSubmit = (formData: LLCFormData): void => {
  try {
    console.log('Order submitted:', formData);
  } catch (error) {
    console.error('Failed to submit order:', error);
  }
};

const LLCOrderForm = () => {
  const { user } = useAuth();
  const { formData, updateFormData } = useOrderForm(initialFormState);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Set email from verified user (Google/account) - supersedes form email
  useEffect(() => {
    if (user?.email && formData.email !== user.email) {
      updateFormData('email', user.email);
    }
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get initial step from URL or default to 1
  const getInitialStep = () => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (step >= 1 && step <= 6) return step;
    }
    return 1;
  };
  
  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    // If starting from a later step (e.g., returning from login), mark previous steps as completed
    const initialStep = getInitialStep();
    if (initialStep > 1) {
      return Array.from({ length: initialStep - 1 }, (_, i) => i + 1);
    }
    return [];
  });
  const formRef = useRef<HTMLDivElement>(null);

  // Update URL when step changes
  useEffect(() => {
    const newUrl = `${pathname}?step=${currentStep}`;
    router.replace(newUrl, { scroll: false });
  }, [currentStep, pathname, router]);

  const steps: Step[] = [
    { id: 1, name: 'Basic Info', icon: UserIcon },
    { id: 2, name: 'Services', icon: BuildingOfficeIcon },
    { id: 3, name: 'Account', icon: ShieldCheckIcon },
    { id: 4, name: 'LLC Details', icon: GlobeAltIcon },
    { id: 5, name: 'Payment', icon: CreditCardIcon },
    { id: 6, name: 'Confirmation', icon: CheckCircleIcon }
  ];

  // Preload next step component for smooth navigation
  useEffect(() => {
    const preloadNextStep = () => {
      switch(currentStep) {
        case 1:
          // Preload ServicesStep
          import('./components/ServicesStep');
          break;
        case 2:
          // Preload AccountStep
          import('./components/AccountStep');
          break;
        case 3:
          // Preload LLCDetailStep
          import('./components/LLCDetailStep');
          break;
        case 4:
          // Preload PaymentStep
          import('./components/PaymentStep');
          break;
        case 5:
          // Preload OrderConfirmation
          import('./components/OrderConfirmation');
          break;
      }
    };

    // Preload with a small delay to not block current step rendering
    const timeoutId = setTimeout(preloadNextStep, 500);
    return () => clearTimeout(timeoutId);
  }, [currentStep]);

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

    const StepLoadingFallback = () => (
      <div className="py-8">
        <LoadingSpinner 
          size="medium" 
          color="text-blue-600" 
          message="Loading step..." 
        />
      </div>
    );

    switch(currentStep) {
      case 1: 
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <BasicInfoStep 
              {...commonProps}
              onNext={() => handleNextStep(1)}
              onPrev={() => handlePrevStep(1)}
            />
          </Suspense>
        );
      case 2: 
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <ServicesStep 
              {...commonProps}
              onNext={() => handleNextStep(2)}
              onPrev={() => handlePrevStep(2)}
            />
          </Suspense>
        );
      case 3: 
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <AccountStep 
              {...commonProps}
              scrollToError={scrollToError}
              onNext={() => handleNextStep(3)}
              onPrev={() => handlePrevStep(3)}
            />
          </Suspense>
        );
      case 4: 
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <LLCDetailStep 
              {...commonProps}
              onNext={() => handleNextStep(4)}
              onPrev={() => handlePrevStep(4)}
            />
          </Suspense>
        );
      case 5: 
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <PaymentStep 
              {...commonProps}
              orderTotal={calculateOrderTotal(formData)}
              onNext={() => handleNextStep(5)}
              onPrev={() => handlePrevStep(5)}
            />
          </Suspense>
        );
      case 6: 
        return (
          <Suspense fallback={<StepLoadingFallback />}>
            <OrderConfirmation 
              {...commonProps}
              orderTotal={calculateOrderTotal(formData)}
              orderId={generateOrderId()}
              onSubmit={() => handleOrderSubmit(formData)}
              onPrev={() => handlePrevStep(6)}
            />
          </Suspense>
        );
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
              LLC Formation
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