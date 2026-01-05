import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LLCFormData } from '../types';
import { FormEvent, useState, useEffect } from 'react';
import { RiBankCardLine, RiAddLine, RiCheckLine } from 'react-icons/ri';

interface SavedPaymentMethod {
  id: string;
  provider: string;
  type: string;
  cardBrand: string | null;
  cardLast4: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  isDefault: boolean;
  nickname: string | null;
  stripePaymentMethodId?: string;
}

export interface PaymentSuccessData {
  paymentId: string;
  cardLast4?: string;
  cardBrand?: string;
  customerId?: string;
  paymentMethodId?: string;
}

interface StripePaymentFormProps {
  amount: number;
  formData: LLCFormData;
  onSuccess: (data: PaymentSuccessData) => void;
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
  const [customerId, setCustomerId] = useState<string | null>(null);
  
  // Saved payment methods state
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string | null>(null);
  const [loadingSavedMethods, setLoadingSavedMethods] = useState(true);
  const [useNewCard, setUseNewCard] = useState(false);
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  // Fetch saved payment methods on mount
  useEffect(() => {
    const fetchSavedMethods = async () => {
      try {
        const res = await fetch('/api/dashboard/payment-methods', {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setSavedPaymentMethods(data.paymentMethods || []);
          // Auto-select default method if exists
          const defaultMethod = data.paymentMethods?.find((pm: SavedPaymentMethod) => pm.isDefault);
          if (defaultMethod) {
            setSelectedSavedMethod(defaultMethod.id);
          } else if (data.paymentMethods?.length > 0) {
            setSelectedSavedMethod(data.paymentMethods[0].id);
          } else {
            setUseNewCard(true);
          }
        } else {
          // No saved methods - use new card
          setUseNewCard(true);
        }
      } catch {
        setUseNewCard(true);
      } finally {
        setLoadingSavedMethods(false);
      }
    };
    
    fetchSavedMethods();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || processing) return;
  
    setProcessing(true);
    setError('');
  
    try {
      // Check if using saved payment method
      if (selectedSavedMethod && !useNewCard) {
        // Find the saved method to get the Stripe payment method ID
        const savedMethod = savedPaymentMethods.find(pm => pm.id === selectedSavedMethod);
        
        // Create Payment Intent with saved payment method
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
            savedPaymentMethodId: savedMethod?.id,
            subscriptions: futureItems,
            setup_future_usage: futureItems.length > 0 ? 'off_session' : undefined
          })
        });
    
        const data = await response.json();
        if (data.customerId) setCustomerId(data.customerId);
        
        if (!response.ok) {
          throw new Error(data.error || 'Payment setup failed');
        }

        // If payment was already confirmed (using saved method)
        if (data.paymentIntentId && data.status === 'succeeded') {
          // Note: Subscriptions are now set up in OrderConfirmation after order/business is created
          onSuccess({ 
            paymentId: data.paymentIntentId, 
            cardLast4: savedMethod?.cardLast4 || undefined,
            cardBrand: savedMethod?.cardBrand || undefined,
            customerId: data.customerId,
            paymentMethodId: data.paymentMethodId
          });
          return;
        }

        // Otherwise confirm with Stripe
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret);
        
        if (confirmError) throw confirmError;
        if (!paymentIntent) throw new Error('Payment failed');

        onSuccess({ 
          paymentId: paymentIntent.id,
          cardLast4: savedMethod?.cardLast4 || undefined,
          cardBrand: savedMethod?.cardBrand || undefined
        });
        return;
      }

      // Using new card - need elements
      if (!elements) {
        throw new Error('Payment form not ready');
      }

      // 1. Submit elements FIRST (validates and collects wallet details)
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // 2. Create Payment Intent AFTER elements.submit()
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
          setup_future_usage: (futureItems.length > 0 || saveCardForFuture) ? 'off_session' : undefined,
          savePaymentMethod: saveCardForFuture
        })
      });
  
      const data = await response.json();
      const currentCustomerId = data.customerId || customerId;
      if (data.customerId) setCustomerId(data.customerId);
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment setup failed');
      }
  
      // 3. Confirm payment
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
  
      // 4. Save the payment method if requested
      if (saveCardForFuture && paymentIntent.payment_method) {
        try {
          await fetch('/api/dashboard/payment-methods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              paymentMethodId: paymentIntent.payment_method,
              setAsDefault: savedPaymentMethods.length === 0
            })
          });
        } catch (e) {
          console.warn('Failed to save payment method:', e);
        }
      }

      // 5. Get card details from Stripe for the new card
      let cardLast4: string | undefined;
      let cardBrand: string | undefined;
      
      if (paymentIntent.payment_method) {
        try {
          const pmResponse = await fetch(`/api/payment-method-details?paymentMethodId=${paymentIntent.payment_method}`);
          if (pmResponse.ok) {
            const pmData = await pmResponse.json();
            cardLast4 = pmData.last4;
            cardBrand = pmData.brand;
          }
        } catch (e) {
          console.warn('Could not fetch payment method details:', e);
        }
      }

      // Note: Subscriptions are now set up in OrderConfirmation after order/business is created
      // Pass customerId and paymentMethodId so OrderConfirmation can set up subscriptions
      onSuccess({ 
        paymentId: paymentIntent.id, 
        cardLast4, 
        cardBrand,
        customerId: currentCustomerId || undefined,
        paymentMethodId: paymentIntent.payment_method as string
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setProcessing(false);
    }
  };

  if (loadingSavedMethods) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading payment methods...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Saved Payment Methods */}
      {savedPaymentMethods.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Select payment method</p>
          
          {savedPaymentMethods.map((pm) => (
            <label
              key={pm.id}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                selectedSavedMethod === pm.id && !useNewCard
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedSavedMethod === pm.id && !useNewCard}
                onChange={() => {
                  setSelectedSavedMethod(pm.id);
                  setUseNewCard(false);
                }}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <RiBankCardLine className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  {pm.nickname || `${pm.cardBrand?.charAt(0).toUpperCase()}${pm.cardBrand?.slice(1) || 'Card'}`}
                </span>
                <span className="text-gray-500 ml-2">•••• {pm.cardLast4}</span>
                {pm.cardExpMonth && pm.cardExpYear && (
                  <span className="text-gray-400 text-sm ml-2">
                    {pm.cardExpMonth.toString().padStart(2, '0')}/{pm.cardExpYear.toString().slice(-2)}
                  </span>
                )}
              </div>
              {pm.isDefault && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Default</span>
              )}
              {selectedSavedMethod === pm.id && !useNewCard && (
                <RiCheckLine className="w-5 h-5 text-amber-600" />
              )}
            </label>
          ))}
          
          {/* Add New Card Option */}
          <label
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
              useNewCard
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={useNewCard}
              onChange={() => setUseNewCard(true)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <RiAddLine className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Use a new card</span>
          </label>
        </div>
      )}

      {/* New Card Form */}
      {(useNewCard || savedPaymentMethods.length === 0) && (
        <div className="space-y-4">
          {savedPaymentMethods.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Enter card details</p>
            </div>
          )}
          
          <PaymentElement options={{
            layout: 'tabs',
            wallets: { applePay: 'never', googlePay: 'never' }
          }} />
          
          {/* Save card checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCardForFuture}
              onChange={(e) => setSaveCardForFuture(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="text-sm text-gray-600">Save this card for future purchases</span>
          </label>
        </div>
      )}
      
      {error && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{error}</div>}

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