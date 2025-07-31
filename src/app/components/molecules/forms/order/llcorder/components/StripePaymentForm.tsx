import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LLCFormData } from '../types';
import { FormEvent, useState } from 'react';

interface StripePaymentFormProps {
  amount: number;
  formData: LLCFormData;
  onSuccess: (paymentId: string) => void;
  processing: boolean;
  setProcessing: (value: boolean) => void;
}

interface BillingInfo {
  name: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

const StripePaymentForm = ({ amount, formData, onSuccess, processing, setProcessing }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    address: {
      line1: formData.address || formData.businessAddress || '',
      line2: '',
      city: formData.businessCity || '',
      state: 'CA',
      postal_code: formData.businessZip || '',
      country: 'US'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardError, setCardError] = useState<string>('');

  const validateBillingInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!billingInfo.name.trim()) newErrors.name = 'Cardholder name is required';
    if (!billingInfo.address.line1.trim()) newErrors.address = 'Billing address is required';
    if (!billingInfo.address.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.address.postal_code.trim()) newErrors.postal_code = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBillingChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setBillingInfo(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field] || errors[field.split('.')[1]]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
        [field.split('.')[1]]: ''
      }));
    }
  };

  const getSelectedSubscriptions = () => {
    const subscriptions: Array<{
      service: string;
      amount: number;
      frequency: 'monthly' | 'yearly';
      delayDays: number;
    }> = [];
    
    if (formData.registeredAgent) {
      subscriptions.push({
        service: 'Registered Agent Service',
        amount: 149.00,
        frequency: 'yearly',
        delayDays: 7
      });
    }
    
    if (formData.compliance) {
      subscriptions.push({
        service: 'Compliance Service', 
        amount: 99.00,
        frequency: 'yearly',
        delayDays: 7
      });
    }
    
    if (formData.website === 'basic') {
      subscriptions.push({
        service: 'Basic Website',
        amount: 9.99,
        frequency: 'monthly',
        delayDays: 14
      });
    } else if (formData.website === 'pro') {
      subscriptions.push({
        service: 'Pro Website',
        amount: 49.99,
        frequency: 'monthly', 
        delayDays: 14
      });
    } else if (formData.website === 'ecommerce') {
      subscriptions.push({
        service: 'E-commerce Website',
        amount: 49.99,
        frequency: 'monthly',
        delayDays: 14
      });
    }
    
    return subscriptions;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || processing) return;
    
    if (!validateBillingInfo()) {
      return;
    }

    setProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Create customer and payment intent with setup for future use
      const response = await fetch('/api/create-hybrid-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          customer: {
            email: formData.email,
            name: billingInfo.name,
            address: billingInfo.address,
            metadata: {
              companyName: formData.companyName,
              orderId: `LLC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            }
          },
          subscriptions: getSelectedSubscriptions(),
          formData: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, customerId, paymentIntentId } = await response.json();

      // Step 2: Confirm payment with setup for future usage
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingInfo.name,
            email: billingInfo.email,
            address: billingInfo.address,
          },
        },
        setup_future_usage: 'off_session' // This saves the payment method!
      });

      if (error) {
        setCardError(error.message || 'Payment failed. Please try again.');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Generate orderId from the response or create a new one
        const orderId = paymentIntentId || `LLC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Step 3: Setup future subscriptions with the saved payment method
        const subscriptionResponse = await fetch('/api/setup-future-subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId,
            paymentMethodId: paymentIntent.payment_method,
            orderId: orderId,
            subscriptions: getSelectedSubscriptions(),
            customerInfo: {
              email: formData.email,
              name: billingInfo.name,
              companyName: formData.companyName
            }
          }),
        });

        if (!subscriptionResponse.ok) {
          console.warn('Failed to setup future subscriptions, but payment succeeded');
        }

        // Call onSuccess only once, inside the success block
        onSuccess(paymentIntent.id);
      } else {
        setCardError('Payment confirmation failed. Please try again.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setCardError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        '::placeholder': {
          color: '#9CA3AF',
        },
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name *
        </label>
        <input
          type="text"
          value={billingInfo.name}
          onChange={(e) => handleBillingChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 text-sm ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Full name as it appears on card"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Card Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information *
        </label>
        <div className={`border rounded-lg p-3 bg-white ${
          cardError ? 'border-red-500' : 'border-gray-300'
        }`}>
          <CardElement
            options={cardElementOptions}
            onChange={(event) => {
              if (event.error) {
                setCardError(event.error.message);
              } else {
                setCardError('');
              }
            }}
          />
        </div>
        {cardError && <p className="text-red-500 text-sm mt-1">{cardError}</p>}
      </div>

      {/* Billing Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Billing Address *
        </label>
        <div className="space-y-3">
          <input
            type="text"
            value={billingInfo.address.line1}
            onChange={(e) => handleBillingChange('address.line1', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 text-sm ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Street address"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          
          <input
            type="text"
            value={billingInfo.address.line2}
            onChange={(e) => handleBillingChange('address.line2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 text-sm"
            placeholder="Apartment, suite, etc. (optional)"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={billingInfo.address.city}
                onChange={(e) => handleBillingChange('address.city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 text-sm ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <input
                type="text"
                value={billingInfo.address.postal_code}
                onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 text-sm ${
                  errors.postal_code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ZIP code"
              />
              {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* State and Country (pre-filled) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value="California"
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value="United States"
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
          />
        </div>
      </div>

      {/* Future Billing Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>Future Billing Authorization:</strong> By completing this payment, you authorize us to charge this payment method for selected subscription services after your LLC is approved. You'll receive separate confirmations for each service.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
          processing || !stripe
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-amber-600 text-white hover:bg-amber-700'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay $${amount.toFixed(2)} & Authorize Future Billing`
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By completing this payment, you agree to our{' '}
        <a href="/terms" className="text-amber-600 hover:text-amber-700">Terms of Service</a>
        {' '}and authorize future billing for selected subscription services.
      </p>
    </form>
  );
};

export default StripePaymentForm;