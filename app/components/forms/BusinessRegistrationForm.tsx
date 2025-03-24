// components/forms/BusinessRegistrationForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaUserTie, FaShieldAlt, FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import Pills from '../atoms/pills/pills';

interface FormData {
  businessName: string;
  businessType: string;
  businessPurpose: string;
  state: string;
  registeredAgent: string;
  compliancePackage: string;
  email: string;
  phone: string;
}

const states = [
  { code: 'DE', name: 'Delaware', price: 89 },
  { code: 'WY', name: 'Wyoming', price: 99 },
  { code: 'NV', name: 'Nevada', price: 109 },
  { code: 'FL', name: 'Florida', price: 119 },
  { code: 'TX', name: 'Texas', price: 129 },
  { code: 'CA', name: 'California', price: 149 },
];

const registeredAgents = [
  { id: 'basic', name: 'Basic Agent Service', price: 99, features: ['Mail forwarding', 'Compliance alerts'] },
  { id: 'premium', name: 'Premium Agent Service', price: 199, features: ['All basic features', 'Document scanning', 'Dedicated support'] },
  { id: 'enterprise', name: 'Enterprise Agent Service', price: 299, features: ['All premium features', '24/7 phone support', 'Legal consultation'] },
];

const compliancePackages = [
  { id: 'essential', name: 'Essential Compliance', price: 149, features: ['Annual report filing', 'Basic record keeping'] },
  { id: 'standard', name: 'Standard Compliance', price: 299, features: ['All essential features', 'Tax filing assistance', 'Registered agent service'] },
  { id: 'premium', name: 'Premium Compliance', price: 499, features: ['All standard features', 'Full legal compliance', 'Business license management'] },
];

export default function BusinessRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: 'LLC',
    businessPurpose: '',
    state: '',
    registeredAgent: '',
    compliancePackage: '',
    email: '',
    phone: '',
  });

  const [selectedAgentFeatures, setSelectedAgentFeatures] = useState<string[]>([]);
  const [selectedPackageFeatures, setSelectedPackageFeatures] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const selectAgent = (agentId: string) => {
    const agent = registeredAgents.find(a => a.id === agentId);
    setFormData(prev => ({ ...prev, registeredAgent: agentId }));
    setSelectedAgentFeatures(agent?.features || []);
  };

  const selectPackage = (packageId: string) => {
    const pkg = compliancePackages.find(p => p.id === packageId);
    setFormData(prev => ({ ...prev, compliancePackage: packageId }));
    setSelectedPackageFeatures(pkg?.features || []);
  };

  const calculateTotal = () => {
    const statePrice = states.find(s => s.code === formData.state)?.price || 0;
    const agentPrice = registeredAgents.find(a => a.id === formData.registeredAgent)?.price || 0;
    const packagePrice = compliancePackages.find(p => p.id === formData.compliancePackage)?.price || 0;
    return statePrice + agentPrice + packagePrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    nextStep();
  };

  const getStepIcon = (stepNumber: number, currentStep: number) => {
    if (stepNumber < currentStep) {
      return <IoIosCheckmarkCircle className="text-green-500 w-6 h-6" />;
    }
    const icons = [FaBuilding, FaMapMarkerAlt, FaUserTie, FaShieldAlt, FaCheckCircle];
    const Icon = icons[stepNumber - 1];
    return <Icon className={`w-5 h-5 ${stepNumber === currentStep ? 'text-amber-500' : 'text-gray-400'}`} />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stepNumber < step ? 'bg-green-100' : stepNumber === step ? 'bg-amber-100' : 'bg-gray-100'}`}>
                {getStepIcon(stepNumber, step)}
              </div>
              <span className={`text-xs mt-2 ${stepNumber <= step ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                {['Business', 'State', 'Agent', 'Package', 'Review'][stepNumber - 1]}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(step - 1) * 25}%` }}
          ></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step > 5 ? 0 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step > 5 ? 0 : -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Business Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="LLC">LLC (Limited Liability Company)</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Nonprofit">Nonprofit</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="businessPurpose" className="block text-sm font-medium text-gray-700 mb-1">Business Purpose</label>
                  <textarea
                    id="businessPurpose"
                    name="businessPurpose"
                    value={formData.businessPurpose}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Brief description of your business activities"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                  disabled={!formData.businessName}
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: State Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Select Your State</h2>
              <p className="text-gray-600">Choose the state where you want to register your business</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {states.map((state) => (
                  <motion.div
                    key={state.code}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, state: state.code }));
                        nextStep();
                      }}
                      className={`w-full p-4 border rounded-xl text-left transition-all ${formData.state === state.code ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{state.name}</h3>
                          <p className="text-sm text-gray-600">Filing fee: ${state.price}</p>
                        </div>
                        {formData.state === state.code && (
                          <IoIosCheckmarkCircle className="text-green-500 w-5 h-5" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Registered Agent */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Registered Agent Service</h2>
              <p className="text-gray-600">All businesses must have a registered agent in the state of formation</p>

              <div className="space-y-4">
                {registeredAgents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 border rounded-xl transition-all ${formData.registeredAgent === agent.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                  >
                    <button
                      type="button"
                      onClick={() => selectAgent(agent.id)}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                          <p className="text-lg font-bold text-amber-600">${agent.price}/year</p>
                        </div>
                        {formData.registeredAgent === agent.id ? (
                          <IoIosCheckmarkCircle className="text-green-500 w-6 h-6" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>

                      {formData.registeredAgent === agent.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-2"
                        >
                          <h4 className="text-sm font-medium text-gray-700">Includes:</h4>
                          <ul className="space-y-2">
                            {agent.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <IoIosCheckmarkCircle className="text-green-500 w-5 h-5 mr-2 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                  disabled={!formData.registeredAgent}
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Compliance Package */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Compliance Package</h2>
              <p className="text-gray-600">Keep your business in good standing with the state</p>

              <div className="space-y-4">
                {compliancePackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 border rounded-xl transition-all ${formData.compliancePackage === pkg.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                  >
                    <button
                      type="button"
                      onClick={() => selectPackage(pkg.id)}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
                          <p className="text-lg font-bold text-amber-600">${pkg.price}/year</p>
                        </div>
                        {formData.compliancePackage === pkg.id ? (
                          <IoIosCheckmarkCircle className="text-green-500 w-6 h-6" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>

                      {formData.compliancePackage === pkg.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-2"
                        >
                          <h4 className="text-sm font-medium text-gray-700">Includes:</h4>
                          <ul className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <IoIosCheckmarkCircle className="text-green-500 w-5 h-5 mr-2 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                  disabled={!formData.compliancePackage}
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review and Contact Info */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
              <p className="text-gray-600">Please review your information and provide your contact details</p>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium">{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Purpose:</span>
                      <span className="font-medium">{formData.businessPurpose || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Services</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">State of Formation:</span>
                        <span className="ml-2 text-gray-600">
                          {states.find(s => s.code === formData.state)?.name || 'Not selected'}
                        </span>
                      </div>
                      <span className="font-medium">
                        ${states.find(s => s.code === formData.state)?.price || 0}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">Registered Agent:</span>
                        <span className="ml-2 text-gray-600">
                          {registeredAgents.find(a => a.id === formData.registeredAgent)?.name || 'Not selected'}
                        </span>
                      </div>
                      <span className="font-medium">
                        ${registeredAgents.find(a => a.id === formData.registeredAgent)?.price || 0}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">Compliance Package:</span>
                        <span className="ml-2 text-gray-600">
                          {compliancePackages.find(p => p.id === formData.compliancePackage)?.name || 'Not selected'}
                        </span>
                      </div>
                      <span className="font-medium">
                        ${compliancePackages.find(p => p.id === formData.compliancePackage)?.price || 0}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-amber-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  disabled={!formData.email || !formData.phone}
                >
                  Place Order <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Thank you for your order. We'll process your business registration and contact you shortly.</p>
              
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-medium">{formData.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-bold text-amber-600">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href="/dashboard"
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Go to Dashboard
                </a>
                <a
                  href="/"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}