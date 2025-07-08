import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LLCFormData } from '../types';
import { FormEvent } from 'react';

interface StripePaymentFormProps {
  amount: number;
  formData: LLCFormData;
  onSuccess: (paymentId: string) => void;
  processing: boolean;
  setProcessing: (value: boolean) => void;
}

const StripePaymentForm = ({ amount, onSuccess }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      console.error(error);
      return;
    }

    // Process payment with your API
    onSuccess(paymentMethod.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border border-gray-300 rounded-lg" />
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Pay ${amount.toFixed(2)}
      </button>
    </form>
  );
};

export default StripePaymentForm;
