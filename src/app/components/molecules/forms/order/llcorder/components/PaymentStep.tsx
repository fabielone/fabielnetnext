// components/PaymentStep.tsx
'use client'
import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentForm } from './StripePaymentForm';
import { LLCFormData , UpdateFormData } from '../types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  orderTotal: number;
  onNext: () => void;
  onPrev: () => void;
}

const PaymentStep = ({ formData, updateFormData, orderTotal, onNext, onPrev }: PaymentStepProps) => {
  const [processing, setProcessing] = useState(false);

  // Calculate order breakdown - ONLY main service charged today
  const getOrderBreakdown = () => {
    const todayItems = [
      { name: 'LLC Formation Package', price: 124.99 }
    ];

    const todayTotal = todayItems.reduce((sum, item) => sum + item.price, 0);
    
    // Future billing items
    const futureItems: Array<{
      name: string;
      price: number;
      frequency: 'monthly' | 'yearly';
      note: string;
    }> = [];
    
    if (formData.registeredAgent) {
      futureItems.push({ 
        name: 'Registered Agent Service', 
        price: 149.00,
        frequency: 'yearly',
        note: 'Billed after LLC approval'
      });
    }
    
    if (formData.compliance) {
      futureItems.push({ 
        name: 'Compliance Service', 
        price: 99.00,
        frequency: 'yearly',
        note: 'Billed after LLC approval'
      });
    }
    
    if (formData.website === 'basic') {
      futureItems.push({ 
        name: 'Basic Website', 
        price: 9.99,
        frequency: 'monthly',
        note: 'Billed after LLC approval'
      });
    } else if (formData.website === 'pro') {
      futureItems.push({ 
        name: 'Pro Website', 
        price: 49.99,
        frequency: 'monthly',
        note: 'Billed after LLC approval'
      });
    } else if (formData.website === 'ecommerce') {
      futureItems.push({ 
        name: 'E-commerce Website', 
        price: 49.99,
        frequency: 'monthly',
        note: 'Billed after LLC approval'
      });
    }

    return { todayItems, todayTotal, futureItems };
  };

  const { todayItems, todayTotal, futureItems } = getOrderBreakdown();

  const handlePaymentSuccess = async (paymentId: string) => {
    setProcessing(true);
    try {
      // Update form data with payment info
      updateFormData('paymentTransactionId', paymentId);
      updateFormData('paymentProvider', 'stripe');
      
      onNext();
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          Step 5 of 6: Payment
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Order</h2>
        <p className="text-gray-600">Hybrid billing: Pay LLC formation today, subscriptions charged later</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hybrid Billing Summary</h3>
          
          {/* Today's charges */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-700 border-b border-amber-200 pb-2">
              💳 Charged Today
            </h4>
            {todayItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold border-t border-amber-200 pt-2">
              <span>Total Due Today</span>
              <span className="text-amber-900">${todayTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Future billing */}
          {futureItems.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-gray-700 border-b border-amber-200 pb-2">
                📅 Future Billing (After LLC Approval)
              </h4>
              {futureItems.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">${item.price.toFixed(2)}/{item.frequency.slice(0, -2)}</span>
                  </div>
                  <div className="text-xs text-amber-600 mt-1">{item.note}</div>
                </div>
              ))}
            </div>
          )}

          {/* Hybrid billing notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <strong>How Hybrid Billing Works:</strong> Pay only for LLC formation today. 
                Your payment method will be securely saved and additional services will be 
                charged separately after your LLC is approved. You'll receive individual 
                confirmations for each service.
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>
          
          <Elements
            stripe={stripePromise}
            options={{
              mode: 'payment',
              amount: Math.round(todayTotal * 100),
              currency: 'usd',
              paymentMethodTypes: ['card', 'paypal'], // Enable PayPal
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#f59e0b',
                  colorBackground: '#fffbeb',
                  colorText: '#374151',
                  colorDanger: '#ef4444',
                  borderRadius: '8px',
                }
              }
            }}
          >
            <StripePaymentForm
              amount={todayTotal}
              formData={formData}
              onSuccess={handlePaymentSuccess}
              processing={processing}
              setProcessing={setProcessing}
              futureItems={futureItems.map(item => ({
                name: item.name,
                price: item.price,
                frequency: item.frequency
              }))}
            />
          </Elements>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <button
          onClick={onPrev}
          disabled={processing}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1 disabled:opacity-50"
        >
          Back
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Money Back Guarantee</span>
          </div>
        </div>
        <p className="text-xs">
          © 2025 Fabiel.net - Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentStep;