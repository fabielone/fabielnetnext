import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LLCFormData } from '../types';
import { FormEvent, useState } from 'react';

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
      // 1. Create Payment Intent
      const response = await fetch('/api/create-payment-intent', {
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
          setup_future_usage: futureItems.length > 0 ? 'off_session' : undefined
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment setup failed');
      }
  
      // 2. Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          receipt_email: formData.email,
        },
        redirect: 'if_required'
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
      <PaymentElement options={{
        layout: 'tabs',
        wallets: { applePay: 'never', googlePay: 'never' }
      }} />
      
      {error && <div className="text-red-500">{error}</div>}

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

export { StripePaymentForm };