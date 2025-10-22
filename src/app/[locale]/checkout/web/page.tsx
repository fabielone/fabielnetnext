'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { FaCheck, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { 
  getServiceTierByName, 
  ServiceTier, 
  ServiceType,
  ServicePricing 
} from '../../../components/types/services';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const _locale = useLocale();
  
  const [selectedService, setSelectedService] = useState<ServiceType>('web');
  const [selectedTier, setSelectedTier] = useState<ServiceTier>('pro');
  const [serviceData, setServiceData] = useState<ServicePricing | undefined>();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    additionalNotes: ''
  });

  // Preselect product based on URL parameters
  useEffect(() => {
    const product = searchParams.get('product') as ServiceType;
    const tier = searchParams.get('tier') as ServiceTier;
    
    if (product && (product === 'web' || product === 'blog')) {
      setSelectedService(product);
    }
    
    if (tier && (tier === 'basics' || tier === 'pro' || tier === 'high-traffic')) {
      setSelectedTier(tier);
    }
  }, [searchParams]);

  // Update service data when selection changes
  useEffect(() => {
    const data = getServiceTierByName(selectedService, selectedTier);
    setServiceData(data);
  }, [selectedService, selectedTier]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement payment processing
    console.log('Checkout data:', {
      service: selectedService,
      tier: selectedTier,
      ...formData
    });

    alert('Checkout functionality coming soon! This will integrate with Stripe payment processing.');
  };

  if (!serviceData) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Service Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedService('web')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedService === 'web'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">Web Development</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedService('blog')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedService === 'blog'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">Blog Services</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tier Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan
                </label>
                <div className="space-y-3">
                  {(['basics', 'pro', 'high-traffic'] as ServiceTier[]).map((tier) => {
                    const tierData = getServiceTierByName(selectedService, tier);
                    if (!tierData) return null;
                    
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTier === tier
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {tierData.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {tierData.description.substring(0, 50)}...
                            </div>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {tierData.priceDisplay}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Details */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {serviceData.name} - Includes:
                </h3>
                <ul className="space-y-2">
                  {serviceData.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <FaCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {serviceData.features.length > 5 && (
                    <li className="text-sm text-gray-600 dark:text-gray-400 italic">
                      +{serviceData.features.length - 5} more features...
                    </li>
                  )}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Monthly subscription</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {serviceData.priceDisplay}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <span className="text-gray-900 dark:text-white">Total due today</span>
                  <span className="text-blue-600">{serviceData.priceDisplay}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Billed monthly. Cancel anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Payment Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                {/* Payment Section Placeholder */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FaCreditCard className="mr-2" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
                    <FaShieldAlt className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Secure payment processing with Stripe
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment integration coming soon
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center"
                >
                  <FaCreditCard className="mr-2" />
                  Complete Purchase - {serviceData.priceDisplay}/month
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WebCheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
