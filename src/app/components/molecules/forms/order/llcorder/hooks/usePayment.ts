'use client'
import { useState } from 'react';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import { LLCFormData } from '../types';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processStripePayment = async (
    formData: LLCFormData,
    amount: number,
    elements: StripeElements,
    stripe: Stripe | null
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Submit elements FIRST
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      // Create intent AFTER submit
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          customer: {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
          },
          setup_future_usage: 'off_session'
        }),
      });

      const { clientSecret } = await response.json();
      if (!stripe) throw new Error('Stripe not initialized');

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          receipt_email: formData.email,
        },
        redirect: 'if_required'
      });

      if (stripeError) throw stripeError;
      if (!paymentIntent) throw new Error('Payment failed');
      return paymentIntent.id;
    } catch (err) {
      setError((err as any).message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processPayPalPayment = async (orderId: string) => {
    // PayPal processing would be handled client-side by their SDK
    return orderId;
  };

  return {
    loading,
    error,
    processStripePayment,
    processPayPalPayment,
  };
};
