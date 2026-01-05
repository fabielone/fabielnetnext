// components/PaymentStep.tsx
'use client'
import { useState, Suspense, lazy } from 'react';
import { LLCFormData , UpdateFormData } from '../types';
import LoadingSpinner from '../../../../../atoms/LoadingSpinner';
import { RiCoupon2Line, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import type { PaymentSuccessData } from './StripePaymentForm';

// Dynamic imports for Stripe components
const Elements = lazy(() => import('@stripe/react-stripe-js').then(mod => ({ default: mod.Elements })));
const StripePaymentForm = lazy(() => import('./StripePaymentForm').then(mod => ({ default: mod.StripePaymentForm })));

// Lazy load Stripe
const stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) => 
  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
);

interface PaymentStepProps {
  formData: LLCFormData;
  updateFormData: UpdateFormData;
  orderTotal: number;
  onNext: () => void;
  onPrev: () => void;
}

const PaymentStep = ({ formData, updateFormData, orderTotal, onNext, onPrev }: PaymentStepProps) => {
  const [processing, setProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState(formData.couponCode || '');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(formData.couponCode ? `${formData.couponCode} applied!` : '');

  // Formation service fee (coupon only applies to this, not state fees)
  const FORMATION_SERVICE_FEE = 99.99;

  // Handle coupon validation
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      // Only pass the formation service fee for coupon calculation (not state fees)
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          orderTotal: FORMATION_SERVICE_FEE, // Coupon only applies to service fee
          serviceKey: 'llc_formation',
        }),
      });

      const result = await response.json();

      if (result.success) {
        updateFormData('couponCode', result.coupon.code);
        updateFormData('couponDiscount', result.coupon.discountAmount);
        setCouponSuccess(`${result.coupon.code} applied! You save $${result.coupon.discountAmount.toFixed(2)} on formation fee`);
      } else {
        setCouponError(result.error || 'Invalid coupon code');
        updateFormData('couponCode', '');
        updateFormData('couponDiscount', 0);
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
    updateFormData('couponCode', '');
    updateFormData('couponDiscount', 0);
  };

  // Calculate order breakdown - ONLY main service charged today
  const getOrderBreakdown = () => {
    const todayItems: Array<{ name: string; price: number; isDiscount?: boolean }> = [
      { name: 'LLC Formation Package', price: 99.99 }
    ];

    // Add state filing fee
    if (formData.stateFilingFee && formData.stateFilingFee > 0) {
      todayItems.push({ 
        name: `${formData.formationState} State Filing Fee`, 
        price: formData.stateFilingFee 
      });
    }

    // Add rush processing fee if selected
    if (formData.rushProcessing && formData.stateRushFee) {
      todayItems.push({ 
        name: 'Rush Processing', 
        price: formData.stateRushFee 
      });
    }

    const subtotal = todayItems.reduce((sum, item) => sum + item.price, 0);
    
    // Add coupon discount as negative line item (only applies to formation fee)
    if (formData.couponDiscount && formData.couponDiscount > 0) {
      todayItems.push({ 
        name: `Coupon: ${formData.couponCode} (on formation fee)`, 
        price: -formData.couponDiscount,
        isDiscount: true
      });
    }

    const todayTotal = Math.max(0, subtotal - (formData.couponDiscount || 0));
    
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
        note: 'Billed in 10 days'
      });
    }
    
    if (formData.compliance) {
      futureItems.push({ 
        name: 'Compliance Service', 
        price: 99.00,
        frequency: 'yearly',
        note: 'Billed in 10 days'
      });
    }
    
    // Website tier pricing with 25% discount when registered agent or compliance is selected
    const hasWebDiscount = formData.registeredAgent || formData.compliance;
    
    if (formData.website === 'essential') {
      const basePrice = 29.99;
      const finalPrice = hasWebDiscount ? basePrice * 0.75 : basePrice;
      futureItems.push({ 
        name: hasWebDiscount ? 'Essential Website (25% off)' : 'Essential Website', 
        price: Number(finalPrice.toFixed(2)),
        frequency: 'monthly',
        note: 'Billed in 10 days'
      });
    } else if (formData.website === 'professional') {
      const basePrice = 49.99;
      const finalPrice = hasWebDiscount ? basePrice * 0.75 : basePrice;
      futureItems.push({ 
        name: hasWebDiscount ? 'Professional Website (25% off)' : 'Professional Website', 
        price: Number(finalPrice.toFixed(2)),
        frequency: 'monthly',
        note: 'Billed in 10 days'
      });
    }
    
    // Blog Pro pricing (independent add-on) with 25% discount
    if (formData.blogPro) {
      const basePrice = 49.99;
      const finalPrice = hasWebDiscount ? basePrice * 0.75 : basePrice;
      futureItems.push({ 
        name: hasWebDiscount ? 'Blog Pro (25% off)' : 'Blog Pro', 
        price: Number(finalPrice.toFixed(2)),
        frequency: 'monthly',
        note: 'Billed in 10 days'
      });
    }

    return { todayItems, todayTotal, futureItems };
  };

  const { todayItems, todayTotal, futureItems } = getOrderBreakdown();

  const handlePaymentSuccess = async (data: PaymentSuccessData) => {
    setProcessing(true);
    try {
      // Update form data with payment info
      updateFormData('paymentTransactionId', data.paymentId);
      updateFormData('paymentProvider', 'stripe');
      if (data.cardLast4) updateFormData('paymentCardLast4', data.cardLast4);
      if (data.cardBrand) updateFormData('paymentCardBrand', data.cardBrand);
      
      // Create Payment record in database
      try {
        await fetch('/api/payments/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: data.paymentId,
            orderId: formData.orderId,
            amount: todayTotal,
            email: formData.email,
            paymentMethod: 'stripe',
            description: `LLC Formation for ${formData.companyName}`,
            cardLast4: data.cardLast4,
            cardBrand: data.cardBrand
          })
        });
      } catch (error) {
        console.warn('Failed to record payment (continuing):', error);
      }
      
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
              <div key={index} className={`flex justify-between text-sm ${item.isDiscount ? 'text-green-600' : ''}`}>
                <span className={item.isDiscount ? 'text-green-600' : 'text-gray-600'}>{item.name}</span>
                <span className={`font-medium ${item.isDiscount ? 'text-green-600' : ''}`}>
                  {item.isDiscount ? '-' : ''}${Math.abs(item.price).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-bold border-t border-amber-200 pt-2">
              <span>Total Due Today</span>
              <span className="text-amber-900">${todayTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-amber-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <RiCoupon2Line className="inline-block w-4 h-4 mr-1" />
              Have a coupon code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter code"
                disabled={!!formData.couponCode || couponLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:text-gray-500 uppercase"
              />
              {formData.couponCode ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <RiCloseLine className="w-4 h-4" />
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponLoading ? 'Checking...' : 'Apply'}
                </button>
              )}
            </div>
            {couponError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <RiCloseLine className="w-4 h-4" />
                {couponError}
              </p>
            )}
            {couponSuccess && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <RiCheckLine className="w-4 h-4" />
                {couponSuccess}
              </p>
            )}
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
          
          <Suspense fallback={
            <div className="py-8">
              <LoadingSpinner 
                size="medium" 
                color="text-amber-600" 
                message="Loading secure payment form..." 
              />
            </div>
          }>
            <Elements
              stripe={stripePromise}
              options={{
                mode: 'payment',
                amount: Math.round(todayTotal * 100),
                currency: 'usd',
                setupFutureUsage: futureItems.length > 0 ? 'off_session' : undefined,
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
              <Suspense fallback={
                <div className="py-4">
                  <LoadingSpinner 
                    size="small" 
                    color="text-amber-600" 
                    message="Initializing payment..." 
                  />
                </div>
              }>
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
              </Suspense>
            </Elements>
          </Suspense>
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
      </div>
    </div>
  );
};

export default PaymentStep;