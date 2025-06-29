"use client"
import { LLCFormData, UpdateFormData } from '../types';
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import StripePaymentForm from './StripePaymentForm';

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

  // Calculate order breakdown
  const getOrderBreakdown = () => {
    const items = [
      { name: 'LLC Formation Package', price: 124.99 }
    ];

    if (formData.registeredAgent) {
      items.push({ name: 'Registered Agent Service', price: 149.00 });
    }

    if (formData.compliance) {
      items.push({ name: 'Compliance Service', price: 99.00 });
    }

    const oneTimeTotal = items.reduce((sum, item) => sum + item.price, 0);
    
    const monthlyServices: Array<{ name: string; price: number; note?: string }> = [];
    if (formData.website === 'basic') {
      monthlyServices.push({ name: 'Basic Website', price: 9.99 });
    } else if (formData.website === 'pro') {
      monthlyServices.push({ name: 'Pro Website', price: 49.99 });
    } else if (formData.website === 'ecommerce') {
      monthlyServices.push({ name: 'E-commerce Website', price: 49.99, note: '+ transaction fees' });
    }

    return { items, oneTimeTotal, monthlyServices };
  };

  const { items, oneTimeTotal, monthlyServices } = getOrderBreakdown();

  const handlePaymentSuccess = async (paymentId: string) => {
    setProcessing(true);
    try {
      // Here you would save the order to your database
      console.log('Payment successful:', paymentId);
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
        <p className="text-gray-600">Review your order and select payment method</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          {/* One-time charges */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-700 border-b border-amber-200 pb-2">
              One-time Charges
            </h4>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-medium border-t border-amber-200 pt-2">
              <span>Subtotal (One-time)</span>
              <span>${oneTimeTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Monthly services */}
          {monthlyServices.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-gray-700 border-b border-amber-200 pb-2">
                Monthly Services
              </h4>
              {monthlyServices.map((service, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-600">{service.name}</span>
                    {service.note && (
                      <div className="text-xs text-amber-600">{service.note}</div>
                    )}
                  </div>
                  <span className="font-medium">${service.price}/mo</span>
                </div>
              ))}
              <div className="text-xs text-gray-500 bg-amber-100 rounded p-2">
                Monthly services will be billed separately after LLC formation
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-amber-300 pt-4">
            <div className="flex justify-between text-lg font-bold text-amber-900">
              <span>Total Due Today</span>
              <span>${oneTimeTotal.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Includes all one-time formation and setup fees
            </div>
          </div>

          {/* Guarantees */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center text-sm text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>100% Money Back Guarantee</span>
            </div>
            <div className="flex items-center text-sm text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Secure SSL Encryption</span>
            </div>
            <div className="flex items-center text-sm text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Documents within 7-10 business days</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h3>
          
          {/* Payment Method Selection */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => updateFormData('paymentMethod', 'stripe')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.paymentMethod === 'stripe'
                    ? 'border-amber-500 bg-amber-100'
                    : 'border-gray-200 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                    </svg>
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                  <div className="flex space-x-1">
                    <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-4" />
                    <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-4" />
                    <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6ef418a24c7ba8.svg" alt="American Express" className="h-4" />
                    <img src="https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg" alt="Discover" className="h-4" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => updateFormData('paymentMethod', 'paypal')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.paymentMethod === 'paypal'
                    ? 'border-amber-500 bg-amber-100'
                    : 'border-gray-200 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.186a.925.925 0 0 0-.918.797l-1.513 9.589a.641.641 0 0 0 .633.74h4.25c.524 0 .967-.382 1.05-.9l.048-.314 1.026-6.506.066-.430c.082-.518.526-.9 1.05-.9h.661c3.743 0 6.67-1.518 7.52-5.91.355-1.834.174-3.370-.777-4.54z"/>
                  </svg>
                  <span className="font-medium">PayPal</span>
                  <span className="text-xs text-gray-500">Pay with PayPal account</span>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Forms */}
          <div className="min-h-[300px]">
            {formData.paymentMethod === 'stripe' && (
              <Elements 
                stripe={stripePromise}
                options={{
                  mode: 'payment',
                  amount: Math.round(oneTimeTotal * 100),
                  currency: 'usd',
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
                  amount={oneTimeTotal}
                  formData={formData}
                  onSuccess={handlePaymentSuccess}
                  processing={processing}
                  setProcessing={setProcessing}
                />
              </Elements>
            )}

            {formData.paymentMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-blue-800">
                      You'll be redirected to PayPal to complete your payment securely
                    </span>
                  </div>
                </div>
                
                <PayPalScriptProvider 
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: 'USD',
                    intent: 'capture'
                  }}
                >
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                          amount: {
                            value: oneTimeTotal.toFixed(2),
                            currency_code: 'USD'
                          },
                          description: 'California LLC Formation Package'
                        }]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        setProcessing(true);
                        const details = await actions.order!.capture();
                        await handlePaymentSuccess(details.id!);
                      } catch (error) {
                        console.error('PayPal payment failed:', error);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                    }}
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                      height: 45
                    }}
                    disabled={processing}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
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
        <div className="order-1 sm:order-2">
          {/* Payment buttons are in the payment forms above */}
        </div>
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