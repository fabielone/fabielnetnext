'use client'
import { LLCFormData, UpdateFormData, StateFee } from '../types'; 
import { useState, useEffect } from 'react';
import { InformationCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
  scrollToError?: (field: string) => void;
}

interface ServiceInfo {
  key: keyof LLCFormData;
  label: string;
  description: string;
  required?: boolean;
}

const includedServices: ServiceInfo[] = [
  {
    key: 'needLLCFormation',
    label: 'LLC Formation',
    description: 'Articles of Organization filing with your selected state',
    required: true
  },
  {
    key: 'needEIN',
    label: 'EIN (Federal Tax ID)',
    description: 'Employer Identification Number application with the IRS'
  },
  {
    key: 'needOperatingAgreement',
    label: 'Operating Agreement Template',
    description: 'Customizable legal document for ownership structure and procedures'
  },
  {
    key: 'needBankLetter',
    label: 'Bank Resolution Letter',
    description: 'Official document required by banks to open business accounts'
  }
];

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

// Validation helper functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  // Check if we have 10 digits (standard US phone)
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

// Format phone number as user types: (555) 123-4567
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// Get unformatted phone number (digits only) for saving
const unformatPhoneNumber = (formattedPhone: string): string => {
  return formattedPhone.replace(/\D/g, '');
};

const BasicInfoStep = ({ formData, updateFormData, onNext, onPrev, scrollToError }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [displayPhone, setDisplayPhone] = useState(formatPhoneNumber(formData.phone || ''));
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [stateFees, setStateFees] = useState<StateFee[]>([]);
  const [selectedStateFee, setSelectedStateFee] = useState<StateFee | null>(null);
  const [loadingFees, setLoadingFees] = useState(true);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [hasBusinessName, setHasBusinessName] = useState(true);

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
      } finally {
        setLoadingFees(false);
      }
    };
    fetchStateFees();
  }, []);

  // Update selected state fee when formation state changes
  useEffect(() => {
    if (formData.formationState && stateFees.length > 0) {
      const fee = stateFees.find(f => f.stateCode === formData.formationState);
      setSelectedStateFee(fee || null);
    } else {
      setSelectedStateFee(null);
    }
  }, [formData.formationState, stateFees]);

  // Filter states based on search
  const filteredStates = US_STATES.filter(state => 
    state.name.toLowerCase().includes(stateSearchQuery.toLowerCase()) ||
    state.code.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  const handleStateSelect = (stateCode: string) => {
    updateFormData('formationState', stateCode);
    setStateDropdownOpen(false);
    setStateSearchQuery('');
    if (errors.formationState) {
      setErrors(prev => ({ ...prev, formationState: '' }));
    }
  };

  const calculateTotal = () => {
    const basePrice = 99.99;
    const stateFee = selectedStateFee?.filingFee || 0;
    return basePrice + stateFee;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.formationState) newErrors.formationState = 'Please select a state for your LLC formation';
    
    // Business name is optional if user chooses "I don't have a name yet"
    if (hasBusinessName && !formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid US phone number';
    }

    setErrors(newErrors);
    
    // Scroll to first error if exists
    if (Object.keys(newErrors).length > 0 && scrollToError) {
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToError(firstErrorField);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleChange = (field: keyof LLCFormData, value: string) => {
    updateFormData(field, value);
    
    // Instant validation as user types
    const newErrors = { ...errors };
    
    if (field === 'email') {
      if (value && !validateEmail(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (value && digits.length > 0 && digits.length < 10) {
        newErrors.phone = 'Please enter a 10-digit phone number';
      } else if (value && digits.length === 10) {
        delete newErrors.phone;
      } else {
        delete newErrors.phone;
      }
    }
    
    if (field === 'companyName' && hasBusinessName && !value) {
      newErrors.companyName = 'Company name is required';
    } else if (field === 'companyName') {
      delete newErrors.companyName;
    }
    
    if (field === 'firstName' && !value) {
      newErrors.firstName = 'First name is required';
    } else if (field === 'firstName') {
      delete newErrors.firstName;
    }
    
    if (field === 'lastName' && !value) {
      newErrors.lastName = 'Last name is required';
    } else if (field === 'lastName') {
      delete newErrors.lastName;
    }
    
    setErrors(newErrors);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setDisplayPhone(formatted);
    // Save unformatted (digits only) to form data
    updateFormData('phone', unformatPhoneNumber(formatted));
    
    // Instant validation
    const digits = formatted.replace(/\D/g, '');
    const newErrors = { ...errors };
    if (digits.length > 0 && digits.length < 10) {
      newErrors.phone = 'Please enter a 10-digit phone number';
    } else {
      delete newErrors.phone;
    }
    setErrors(newErrors);
  };

  const handleServiceToggle = (serviceKey: keyof LLCFormData) => {
    // Don't allow toggling required services
    if (serviceKey === 'needLLCFormation') return;
    
    const currentValue = formData[serviceKey] as boolean;
    updateFormData(serviceKey, !currentValue);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        {/* Step Pill */}
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 1 of 6: Basic Information
        </div>
        
        <p className="text-gray-600 mb-6">Select your formation state and enter your contact information</p>
      </div>

      {/* Formation State Selector - FIRST */}
      <div className="bg-amber-50 rounded-lg p-4 text-left max-w-lg mx-auto">
        <h3 className="font-semibold text-amber-900 mb-2 text-center">Select Formation State *</h3>
        <p className="text-xs text-amber-700 mb-4 text-center">
          Choose the state where you want to form your LLC. Each state has different filing fees and processing times.
        </p>
        
        <div className="relative">
          <button
            type="button"
            id="formationState"
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-left flex items-center justify-between ${
              errors.formationState ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <span className={formData.formationState ? 'text-gray-900' : 'text-gray-500'}>
              {formData.formationState 
                ? US_STATES.find(s => s.code === formData.formationState)?.name || 'Select a state'
                : 'Select a state for your LLC'
              }
            </span>
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {stateDropdownOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                  placeholder="Search states..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto max-h-48">
                {loadingFees ? (
                  <div className="p-4 text-center text-gray-500">Loading state fees...</div>
                ) : filteredStates.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No states found</div>
                ) : (
                  filteredStates.map((state) => {
                    const fee = stateFees.find(f => f.stateCode === state.code);
                    return (
                      <button
                        key={state.code}
                        type="button"
                        onClick={() => handleStateSelect(state.code)}
                        className={`w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors flex items-center justify-between ${
                          formData.formationState === state.code ? 'bg-amber-100' : ''
                        }`}
                      >
                        <span className="font-medium text-gray-900">{state.name}</span>
                        <span className="text-sm text-amber-600">
                          {fee ? `+$${fee.filingFee.toFixed(2)}` : 'Loading...'}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        {errors.formationState && <p className="text-red-500 text-sm mt-1">{errors.formationState}</p>}
      </div>

      {/* Pricing - AFTER State Selection */}
      <div className="bg-amber-50 rounded-lg p-4 max-w-lg mx-auto">
        <div className="text-center">
          <div className="text-amber-700 text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span>Service Fee:</span>
              <span className="font-semibold text-amber-900">$99.99</span>
            </div>
            <div className="flex justify-between items-center">
              <span>State Filing Fee:</span>
              {selectedStateFee ? (
                <span className="font-semibold text-amber-900">${selectedStateFee.filingFee.toFixed(2)}</span>
              ) : (
                <span className="text-amber-600 italic">Select state above</span>
              )}
            </div>
          </div>
          {selectedStateFee && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <div className="text-xs text-amber-600">
                Processing time: {selectedStateFee.standardDays} business days
                {selectedStateFee.rushAvailable && selectedStateFee.rushFee && (
                  <span> (Rush available: {selectedStateFee.rushDays} day for +${selectedStateFee.rushFee.toFixed(2)})</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Selection */}
      <div className="bg-amber-50 rounded-lg p-4 text-left max-w-lg mx-auto">
        <h3 className="font-semibold text-amber-900 mb-2 text-center">Select Your Services</h3>
        <p className="text-xs text-amber-700 mb-4 text-center">
          Keep all or remove services you don't need - all for the same price, whether it's one or all services.
        </p>
        
        <div className="space-y-3">
          {includedServices.map((service) => (
            <div 
              key={service.key} 
              className={`bg-white rounded-lg p-3 border transition-all duration-200 ${
                formData[service.key] === true
                  ? 'border-amber-300 bg-amber-50 shadow-sm' 
                  : 'border-amber-200 hover:border-amber-300 hover:bg-amber-25'
              } ${service.required ? 'opacity-75 cursor-default' : 'cursor-pointer'}`}
              onClick={() => !service.required && handleServiceToggle(service.key)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center mt-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={service.key}
                      checked={formData[service.key] === true}
                      onChange={() => handleServiceToggle(service.key)}
                      disabled={service.required}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      formData[service.key] === true
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData[service.key] === true && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <label 
                      htmlFor={service.key} 
                      className={`text-sm font-medium ${service.required ? 'text-gray-500' : 'text-gray-900 cursor-pointer'}`}
                    >
                      {service.label}
                      {service.required && <span className="text-amber-600 ml-1">(Required)</span>}
                    </label>
                    
                    <div className="relative">
                      <InformationCircleIcon 
                        className="h-4 w-4 text-amber-500 cursor-help"
                        onMouseEnter={() => setHoveredService(service.key)}
                        onMouseLeave={() => setHoveredService(null)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      {/* Tooltip */}
                      {hoveredService === service.key && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          <div className="text-center">{service.description}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        <h3 className="text-lg font-semibold text-amber-900 mb-6 text-center">
          Contact Information
        </h3>
        
        <div className="max-w-lg mx-auto space-y-4">
          {/* Company Name - Full Width */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Desired LLC Name {hasBusinessName && '*'}
              </label>
              <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!hasBusinessName}
                  onChange={(e) => {
                    setHasBusinessName(!e.target.checked);
                    if (e.target.checked) {
                      updateFormData('companyName', '');
                    }
                  }}
                  className="mr-1.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                I don&apos;t have a name yet
              </label>
            </div>
            
            {hasBusinessName ? (
              <>
                <input
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 text-sm ${
                    errors.companyName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your desired LLC name"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-amber-600">
                    <span className="font-medium">Do not include "LLC" or "Limited Liability Company"</span>
                  </p>
                  <a 
                    href="/blog/how-to-check-llc-name-availability"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    How to check name availability →
                  </a>
                </div>
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium">No problem!</p>
                <p className="text-xs mt-1">You can provide your business name later in the questionnaire after checkout. We recommend checking name availability in your state first.</p>
                <a 
                  href="/blog/how-to-check-llc-name-availability"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-2 inline-block"
                >
                  Learn how to check name availability →
                </a>
              </div>
            )}
          </div>

          {/* Name Fields - Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full text-gray-800 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full text-gray-800 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact Fields - Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                name="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full text-gray-800 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="your@email.com"
                type="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                name="phone"
                id="phone"
                value={displayPhone}
                onChange={handlePhoneChange}
                className={`w-full  text-gray-800 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="(555) 123-4567"
                type="tel"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <button
          onClick={onPrev}
          disabled={true} // Disabled for first step
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed transition-colors order-2 sm:order-1"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold order-1 sm:order-2"
        >
          Continue to Services
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
            <span>Money Back Guarantee</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
            </svg>
            <span>Registered Agent Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;