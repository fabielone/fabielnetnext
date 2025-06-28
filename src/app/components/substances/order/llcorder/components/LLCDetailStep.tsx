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
    if (!formData.managementStructure) newErrors.managementStructure = 'Management structure is required';
    if (!formData.numberOfMembers) newErrors.numberOfMembers = 'Number of members is required';
    if (!formData.principalActivity) newErrors.principalActivity = 'Principal business activity is required';
    if (!formData.businessStartDate) newErrors.businessStartDate = 'Business start date is required';
    if (!formData.responsiblePartySSN) newErrors.responsiblePartySSN = 'Responsible party SSN is required';

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
      // Using California Secretary of State business search
      // You can also use services like:
      // - Namechk API: https://namechk.com/
      // - ClearBit Company API
      // - Custom web scraping solution
      
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
    } catch (error) {
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                    errors.businessPurpose ? 'border-red-500' : 'border-gray-200'
                  }`}
                  rows={3}
                  placeholder="Describe your business activities (e.g., 'General business purposes' or specific activities)"
                />
                {errors.businessPurpose && <p className="text-red-500 text-sm mt-1">{errors.businessPurpose}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Management Structure *
                  </label>
                  <select
                    name="managementStructure"
                    id="managementStructure"
                    value={formData.managementStructure || ''}
                    onChange={(e) => handleChange('managementStructure', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.managementStructure ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select management type</option>
                    <option value="member-managed">Member-managed</option>
                    <option value="manager-managed">Manager-managed</option>
                  </select>
                  {errors.managementStructure && <p className="text-red-500 text-sm mt-1">{errors.managementStructure}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Members *
                  </label>
                  <select
                    name="numberOfMembers"
                    id="numberOfMembers"
                    value={formData.numberOfMembers || ''}
                    onChange={(e) => handleChange('numberOfMembers', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.numberOfMembers ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select number</option>
                    <option value="1">Single Member</option>
                    <option value="2">Two Members</option>
                    <option value="3">Three Members</option>
                    <option value="4+">Four or More Members</option>
                  </select>
                  {errors.numberOfMembers && <p className="text-red-500 text-sm mt-1">{errors.numberOfMembers}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* EIN Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">EIN (Federal Tax ID) Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Business Activity *
                  </label>
                  <input
                    name="principalActivity"
                    id="principalActivity"
                    value={formData.principalActivity || ''}
                    onChange={(e) => handleChange('principalActivity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.principalActivity ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Consulting, Retail, Manufacturing"
                  />
                  {errors.principalActivity && <p className="text-red-500 text-sm mt-1">{errors.principalActivity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Business Start Date *
                  </label>
                  <input
                    name="businessStartDate"
                    id="businessStartDate"
                    type="date"
                    value={formData.businessStartDate || ''}
                    onChange={(e) => handleChange('businessStartDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.businessStartDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.businessStartDate && <p className="text-red-500 text-sm mt-1">{errors.businessStartDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsible Party SSN *
                  </label>
                  <input
                    name="responsiblePartySSN"
                    id="responsiblePartySSN"
                    type="password"
                    value={formData.responsiblePartySSN || ''}
                    onChange={(e) => handleChange('responsiblePartySSN', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm ${
                      errors.responsiblePartySSN ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for EIN application. Kept secure and confidential.</p>
                  {errors.responsiblePartySSN && <p className="text-red-500 text-sm mt-1">{errors.responsiblePartySSN}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Number of Employees
                  </label>
                  <select
                    name="expectedEmployees"
                    id="expectedEmployees"
                    value={formData.expectedEmployees || '0'}
                    onChange={(e) => handleChange('expectedEmployees', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm"
                  >
                    <option value="0">0 (Just owners)</option>
                    <option value="1-5">1-5 employees</option>
                    <option value="6-10">6-10 employees</option>
                    <option value="11-25">11-25 employees</option>
                    <option value="25+">25+ employees</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Agreement Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Agreement Preferences</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profit Distribution Method
                  </label>
                  <select
                    value={formData.profitDistribution || 'equal'}
                    onChange={(e) => handleChange('profitDistribution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm"
                  >
                    <option value="equal">Equal among all members</option>
                    <option value="percentage">Based on ownership percentage</option>
                    <option value="contribution">Based on capital contribution</option>
                    <option value="custom">Custom arrangement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voting Rights
                  </label>
                  <select
                    value={formData.votingRights || 'equal'}
                    onChange={(e) => handleChange('votingRights', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-sm"
                  >
                    <option value="equal">Equal voting rights</option>
                    <option value="percentage">Voting by ownership percentage</option>
                    <option value="majority">Majority rules</option>
                    <option value="unanimous">Unanimous decisions required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.allowMemberTransfer || false}
                    onChange={(e) => handleChange('allowMemberTransfer', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Allow members to transfer ownership interests</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.requireMeetings || false}
                    onChange={(e) => handleChange('requireMeetings', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Require annual member meetings</span>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Assistance</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.needEIN || true}
                    onChange={(e) => handleChange('needEIN', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">I need assistance obtaining an EIN (Federal Tax ID)</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.needOperatingAgreement || true}
                    onChange={(e) => handleChange('needOperatingAgreement', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">I want a customized Operating Agreement based on my preferences</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.needBankLetter || true}
                    onChange={(e) => handleChange('needBankLetter', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">I need a bank resolution letter for opening business accounts</span>
                </label>
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