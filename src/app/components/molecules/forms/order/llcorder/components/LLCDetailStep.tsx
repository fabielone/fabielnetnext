import { LLCFormData, UpdateFormData, StateFee } from '../types';
import { useState, useEffect } from 'react';

interface LLCDetailStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
}

// All 50 US States
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

// Validation helper function
const validateZipCode = (zip: string): boolean => {
  // US ZIP codes: 5 digits or 5+4 format (12345 or 12345-6789)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

const LLCDetailStep = ({ formData, updateFormData, onNext, onPrev }: LLCDetailStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stateFees, setStateFees] = useState<StateFee[]>([]);
  const [selectedStateFee, setSelectedStateFee] = useState<StateFee | null>(null);

  // Fetch state fees on mount
  useEffect(() => {
    const fetchStateFees = async () => {
      try {
        const response = await fetch('/api/state-fees');
        const result = await response.json();
        if (result.success) {
          setStateFees(result.data);
        }
      } catch (error) {
        console.error('Error fetching state fees:', error);
      }
    };
    fetchStateFees();
  }, []);

  // Update selected state fee when formation state changes
  useEffect(() => {
    if (formData.formationState && stateFees.length > 0) {
      const fee = stateFees.find(f => f.stateCode === formData.formationState);
      setSelectedStateFee(fee || null);
    }
  }, [formData.formationState, stateFees]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
    if (!formData.businessCity) newErrors.businessCity = 'City is required';
    
    // ZIP code validation
    if (!formData.businessZip) {
      newErrors.businessZip = 'ZIP code is required';
    } else if (!validateZipCode(formData.businessZip)) {
      newErrors.businessZip = 'Please enter a valid US ZIP code (12345 or 12345-6789)';
    }
    
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 4 of 6: LLC Formation Details
        </div>
        <p className="text-gray-600">
          Complete information required for your {formData.formationState ? US_STATES.find(s => s.code === formData.formationState)?.name : ''} LLC filing
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Formation State Display (Read-only) */}
          <div className="bg-amber-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-amber-900">Formation State</h4>
                <p className="text-sm text-amber-700">
                  {formData.formationState 
                    ? `${US_STATES.find(s => s.code === formData.formationState)?.name} - $${selectedStateFee?.filingFee?.toFixed(2) || '0.00'} state filing fee`
                    : 'No state selected'
                  }
                </p>
              </div>
              <div className="text-xs text-amber-600">
                Selected in Step 1
              </div>
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
                    value={formData.formationState ? US_STATES.find(s => s.code === formData.formationState)?.name : 'Select a state'}
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
                    <strong>Next Steps:</strong> After checkout, you&apos;ll receive a questionnaire to complete before we begin filing. This will gather additional details needed for services like EIN application and Operating Agreement customization through your client dashboard.
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
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
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
      </div>
    </div>
  );
};

export default LLCDetailStep;