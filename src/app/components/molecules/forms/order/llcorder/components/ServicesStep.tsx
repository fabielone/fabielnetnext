import { LLCFormData, UpdateFormData, StateFee, RegisteredAgentPrice } from '../types';
import { useState, useEffect } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ServicesStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  onNext: () => void;
  onPrev: () => void;
}

// All 50 US States (for display purposes)
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

const ServicesStep = ({ formData, updateFormData, onNext, onPrev }: ServicesStepProps) => {
  const [selectedStateFee, setSelectedStateFee] = useState<StateFee | null>(null);
  const [registeredAgentPrice, setRegisteredAgentPrice] = useState<RegisteredAgentPrice | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Fetch pricing on mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const [stateResponse, agentResponse] = await Promise.all([
          fetch('/api/state-fees'),
          fetch(`/api/registered-agent-pricing?stateCode=${formData.formationState || 'ALL'}`)
        ]);
        
        const stateResult = await stateResponse.json();
        const agentResult = await agentResponse.json();
        
        if (stateResult.success && formData.formationState) {
          const fee = stateResult.data.find((f: StateFee) => f.stateCode === formData.formationState);
          setSelectedStateFee(fee || null);
        }
        
        if (agentResult.success) {
          setRegisteredAgentPrice(agentResult.data);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchPricing();
  }, [formData.formationState]);

  const handleWebsiteSelect = (websiteType: string) => {
    updateFormData('website', formData.website === websiteType ? null : websiteType);
  };

  const stateName = formData.formationState 
    ? US_STATES.find(s => s.code === formData.formationState)?.name 
    : 'your state';

  const agentAnnualFee = registeredAgentPrice?.annualFee || 149;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        {/* Step Pill */}
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 2 of 6: Additional Services
        </div>
        <p className="text-gray-600">Enhance your LLC with professional services</p>
        
        {/* Selected State Display */}
        {formData.formationState && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Forming LLC in {stateName}
            {selectedStateFee && ` • $${selectedStateFee.filingFee.toFixed(2)} state fee`}
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-amber-50 rounded-lg p-6 md:p-8">
        {/* Required Services Notice */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Required & Optional Services</h3>
        </div>

        {/* Registered Agent Service */}
        <div className="mb-8">
          <div 
            className={`p-4 md:p-6 border-2 rounded-lg cursor-pointer transition-all ${
              formData.registeredAgent 
                ? 'border-amber-500 bg-amber-100' 
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
            onClick={() => updateFormData('registeredAgent', !formData.registeredAgent)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Registered Agent Service
                </h4>
                <div className="text-xl font-bold text-amber-600 mb-2">
                  {loadingPrices ? '...' : `$${agentAnnualFee.toFixed(2)}/year`}
                </div>
                <p className="text-gray-600 mb-3 text-sm">
                  We'll serve as your official registered agent in {stateName}, receiving legal documents on your behalf and ensuring compliance.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <li>• Legal document reception</li>
                  <li>• Compliance notifications</li>
                  <li>• Privacy protection</li>
                  <li>• Professional address</li>
                  <li>• Same-day email alerts</li>
                  <li>• Annual report reminders</li>
                </ul>
                
                {/* Legal requirement notice - subtle info box */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <span className="font-medium">Good to know:</span> Every LLC is legally required to have a registered agent. 
                    You can serve as your own registered agent if you have a physical address in {stateName} and are available during business hours to receive documents. 
                    Many business owners prefer a professional service for privacy and convenience.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 self-start">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.registeredAgent ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                }`}>
                  {formData.registeredAgent && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rush Processing Option */}
        {selectedStateFee?.rushAvailable && selectedStateFee.rushFee && (
          <div className="mb-8">
            <div 
              className={`p-4 md:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                formData.rushProcessing 
                  ? 'border-amber-500 bg-amber-100' 
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
              onClick={() => updateFormData('rushProcessing', !formData.rushProcessing)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Rush Processing
                    <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {selectedStateFee.rushDays} Day Processing
                    </span>
                  </h4>
                  <div className="text-xl font-bold text-amber-600 mb-2">
                    +${selectedStateFee.rushFee.toFixed(2)}
                  </div>
                  <p className="text-gray-600 mb-3 text-sm">
                    Expedite your LLC formation from {selectedStateFee.standardDays} business days to {selectedStateFee.rushDays} business day{selectedStateFee.rushDays !== 1 ? 's' : ''}.
                  </p>
                </div>
                <div className="flex-shrink-0 self-start">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.rushProcessing ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                  }`}>
                    {formData.rushProcessing && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optional Services */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 text-center">Optional Services</h3>

          {/* Compliance Service */}
          <div 
            className={`p-4 md:p-6 border-2 rounded-lg cursor-pointer transition-all ${
              formData.compliance 
                ? 'border-amber-500 bg-amber-100' 
                : 'border-gray-200 hover:border-amber-300 bg-white'
            }`}
            onClick={() => updateFormData('compliance', !formData.compliance)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Annual Compliance Service
                </h4>
                <div className="text-xl font-bold text-amber-600 mb-2">$99/year</div>
                <p className="text-gray-600 mb-3 text-sm">
                  Stay compliant with annual state filings and requirements automatically.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <li>• Annual report filing</li>
                  <li>• Deadline reminders</li>
                  <li>• Document storage</li>
                  <li>• Compliance monitoring</li>
                </ul>
              </div>
              <div className="flex-shrink-0 self-start">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.compliance ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                }`}>
                  {formData.compliance && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Services */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Professional Website Services</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Basic Website */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.website === 'basic' 
                  ? 'border-amber-500 bg-amber-100' 
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
              onClick={() => handleWebsiteSelect('basic')}
            >
              <div className="text-center">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900">Basic Website</h4>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.website === 'basic' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                  }`}>
                    {formData.website === 'basic' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <div className="text-lg font-bold text-amber-600 mb-3">$9.99/month</div>
                <ul className="text-xs text-gray-600 space-y-1 text-left">
                  <li>• Up to 5 pages</li>
                  <li>• Mobile responsive design</li>
                  <li>• SSL certificate included</li>
                  <li>• Basic SEO setup</li>
                  <li>• Contact form</li>
                  <li>• 1 GB hosting</li>
                </ul>
              </div>
            </div>

            {/* Pro Website */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.website === 'pro' 
                  ? 'border-amber-500 bg-amber-100' 
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
              onClick={() => handleWebsiteSelect('pro')}
            >
              <div className="text-center">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900">Pro Website</h4>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.website === 'pro' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                  }`}>
                    {formData.website === 'pro' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <div className="text-lg font-bold text-amber-600 mb-3">$49.99/month</div>
                <ul className="text-xs text-gray-600 space-y-1 text-left">
                  <li>• Unlimited pages</li>
                  <li>• Advanced SEO optimization</li>
                  <li>• Google Analytics integration</li>
                  <li>• Multiple contact forms</li>
                  <li>• Social media integration</li>
                  <li>• 10 GB hosting</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>

            {/* E-commerce Website */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all md:col-span-2 lg:col-span-1 md:max-w-sm lg:max-w-none md:mx-auto ${
                formData.website === 'ecommerce' 
                  ? 'border-amber-500 bg-amber-100' 
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
              onClick={() => handleWebsiteSelect('ecommerce')}
            >
              <div className="text-center">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900">E-commerce</h4>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.website === 'ecommerce' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                  }`}>
                    {formData.website === 'ecommerce' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <div className="text-lg font-bold text-amber-600 mb-1">$49.99/month</div>
                <div className="text-xs text-amber-700 mb-3">+ transaction fees</div>
                <ul className="text-xs text-gray-600 space-y-1 text-left">
                  <li>• Online store setup</li>
                  <li>• Payment processing</li>
                  <li>• Inventory management</li>
                  <li>• Order tracking</li>
                  <li>• Customer accounts</li>
                  <li>• Shopping cart</li>
                  <li>• Unlimited products</li>
                </ul>
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
          onClick={onNext}
          className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold order-1 sm:order-2"
        >
          Continue to Account
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
            <span>Money Back Guarantee</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
            </svg>
            <span>Registered Agent Available</span>
          </div>
        </div>
        <p className="text-xs">
          © 2025 Fabiel.net - Professional Business Formation Services
        </p>
      </div>
    </div>
  );
};

export default ServicesStep;