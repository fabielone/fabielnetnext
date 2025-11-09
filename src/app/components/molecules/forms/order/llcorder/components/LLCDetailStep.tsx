import { LLCFormData, UpdateFormData } from '../types';
import { useState, useEffect } from 'react';

interface LLCDetailStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
}

const LLCDetailStep = ({ formData, updateFormData, onNext, onPrev }: LLCDetailStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nameAvailability, setNameAvailability] = useState<{
    status: 'checking' | 'available' | 'taken' | 'similar' | 'error' | null;
    message?: string;
    suggestions?: string[];
  }>({ status: null });
  const [isCheckingName, setIsCheckingName] = useState(false);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
    if (!formData.businessCity) newErrors.businessCity = 'City is required';
    if (!formData.businessZip) newErrors.businessZip = 'ZIP code is required';
    if (!formData.businessPurpose) newErrors.businessPurpose = 'Business purpose is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleChange = (field: keyof LLCFormData, value: string | boolean) => {
    updateFormData(field, value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Business name availability check
  const checkNameAvailability = async (name: string) => {
    if (!name.trim()) return;
    
    setIsCheckingName(true);
    setNameAvailability({ status: 'checking' });

    try {
      const response = await fetch('/api/check-business-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name,
          state: 'CA',
          entityType: 'LLC'
        })
      });

      const result = await response.json();

      if (result.available) {
        setNameAvailability({
          status: 'available',
          message: 'Great! This name appears to be available.'
        });
      } else if (result.similar && result.similar.length > 0) {
        setNameAvailability({
          status: 'similar',
          message: 'Similar names found. Consider these alternatives:',
          suggestions: result.suggestions || []
        });
      } else {
        setNameAvailability({
          status: 'taken',
          message: 'This name is already taken or too similar to existing businesses.',
          suggestions: result.suggestions || []
        });
      }
    } catch {
      setNameAvailability({
        status: 'error',
        message: 'Unable to check name availability. Please try again.'
      });
    } finally {
      setIsCheckingName(false);
    }
  };

  // Debounced name check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.companyName && formData.companyName.length > 2) {
        checkNameAvailability(formData.companyName);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.companyName]);

  const selectSuggestedName = (suggestedName: string) => {
    handleChange('companyName', suggestedName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 4 of 6: LLC Formation Details
        </div>
        <p className="text-gray-600">Complete information required for your California LLC filing</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Business Name Verification */}
          <div className="bg-amber-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Name Verification</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LLC Name *
              </label>
              <div className="relative">
                <input
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className={`w-full text-gray-900 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                    errors.companyName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Your Business Name"
                />
                {isCheckingName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                  </div>
                )}
              </div>
              
              {/* Name Availability Status */}
              {nameAvailability.status && !isCheckingName && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  nameAvailability.status === 'available' ? 'bg-green-50 text-green-700 border border-green-200' :
                    nameAvailability.status === 'taken' ? 'bg-red-50 text-red-700 border border-red-200' :
                      nameAvailability.status === 'similar' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {nameAvailability.status === 'available' && (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {(nameAvailability.status === 'taken' || nameAvailability.status === 'similar') && (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">{nameAvailability.message}</span>
                  </div>
                  
                  {/* Name Suggestions */}
                  {nameAvailability.suggestions && nameAvailability.suggestions.length > 0 && (
                    <div>
                      <p className="text-xs mb-2">Suggested alternatives:</p>
                      <div className="flex flex-wrap gap-2">
                        {nameAvailability.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectSuggestedName(suggestion)}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-amber-600 mt-2">
                <span className="font-medium">Note:</span> "LLC" will be automatically added to your business name
              </p>
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>
          </div>

          {/* Business Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  name="businessAddress"
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleChange('businessAddress', e.target.value)}
                  className={`w-full text-gray-900 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                    errors.businessAddress ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="123 Business Street"
                />
                {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    name="businessCity"
                    id="businessCity"
                    value={formData.businessCity}
                    onChange={(e) => handleChange('businessCity', e.target.value)}
                    className={`w-full text-gray-900 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.businessCity ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="City"
                  />
                  {errors.businessCity && <p className="text-red-500 text-sm mt-1">{errors.businessCity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    value="California"
                    disabled
                    className="w-full text-gray-900 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    name="businessZip"
                    id="businessZip"
                    value={formData.businessZip}
                    onChange={(e) => handleChange('businessZip', e.target.value)}
                    className={`w-full text-gray-900 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.businessZip ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="12345"
                  />
                  {errors.businessZip && <p className="text-red-500 text-sm mt-1">{errors.businessZip}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Purpose *
                </label>
                <textarea
                  name="businessPurpose"
                  id="businessPurpose"
                  value={formData.businessPurpose}
                  onChange={(e) => handleChange('businessPurpose', e.target.value)}
                  className={`w-full text-gray-900 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                    errors.businessPurpose ? 'border-red-500' : 'border-gray-200'
                  }`}
                  rows={3}
                  placeholder="Describe your business activities (e.g., 'General business purposes' or specific activities)"
                />
                {errors.businessPurpose && <p className="text-red-500 text-sm mt-1">{errors.businessPurpose}</p>}
              </div>

              {/* Notice about additional details */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <strong>Additional Details:</strong> After your LLC is formed, we'll send you a link to complete additional questionnaires for services like EIN application and Operating Agreement customization through your client dashboard.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold order-1 sm:order-2"
        >
          Continue to Payment
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Information Encrypted</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
            </svg>
            <span>Compliance Guaranteed</span>
          </div>
        </div>
        <p className="text-xs">
          © 2025 Fabiel.net - All information is kept confidential and secure
        </p>
      </div>
    </div>
  );
};

export default LLCDetailStep;