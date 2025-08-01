// components/StripePaymentForm.tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { LLCFormData } from '../types';

interface StripePaymentFormProps {
  amount: number;
  formData: LLCFormData;
  onSuccess: (paymentId: string) => void;
  processing: boolean;
  setProcessing: (value: boolean) => void;
  futureItems: Array<{
    name: string;
    price: number;
    frequency: 'monthly' | 'yearly';
  }>;
}

const StripePaymentForm = ({ 
  amount, 
  formData, 
  onSuccess, 
  processing, 
  setProcessing,
  futureItems 
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || processing) return;

    setProcessing(true);
    setError('');

    try {
      // 1. Create Payment Intent with setup_future_usage
      const response = await fetch('/api/create-hybrid-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          customer: {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            metadata: {
              companyName: formData.companyName,
              orderId: `LLC-${Date.now()}`
            }
          },
          subscriptions: futureItems,
          setup_future_usage: 'off_session' // Critical for subscriptions
        })
      });

      if (!response.ok) throw new Error('Payment setup failed');
      
      const { clientSecret } = await response.json();

      // 2. Confirm payment (works for both cards & PayPal)
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email
            }
          }
        },
        redirect: 'if_required' // Don't auto-redirect for PayPal
      });

      if (error) throw error;
      if (!paymentIntent) throw new Error('Payment failed');

      // 3. Handle success
      onSuccess(paymentIntent.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Element (automatically shows PayPal if enabled) */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <PaymentElement 
          options={{
            layout: 'tabs', // Shows payment method tabs
            wallets: {
              applePay: 'never',
              googlePay: 'never'
            }
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Billing Notice */}
      {futureItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <strong>Future Billing Authorization:</strong> You're authorizing future charges for:
              <ul className="list-disc pl-5 mt-1">
                {futureItems.map((item, i) => (
                  <li key={i}>
                    {item.name} (${item.price}/{item.frequency.slice(0, -2)})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 rounded-lg font-medium ${
          processing ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-700 text-white'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm