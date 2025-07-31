// pages/api/create-paypal-billing-token.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerEmail, companyName } = req.body;

    // PayPal SDK setup
    const paypal = require('@paypal/checkout-server-sdk');
    
    const environment = process.env.NODE_ENV === 'production' 
      ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
      : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
    
    const client = new paypal.core.PayPalHttpClient(environment);

    // Create billing agreement token for future payments
    const billingRequest = {
      intent: 'CAPTURE',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/paypal-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
      },
      transactions: [{
        amount: {
          total: '0.00', // $0 for agreement setup
          currency: 'USD'
        },
        description: `Billing Agreement Setup - ${companyName} LLC Services`
      }]
    };

    // For PayPal billing agreements, we need to use the Billing API
    const agreementRequest = {
      name: `LLC Services - ${companyName}`,
      description: `Recurring billing for LLC services - ${companyName}`,
      start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      plan: {
        id: process.env.PAYPAL_BILLING_PLAN_ID, // You'll need to create this
        state: 'ACTIVE',
        name: 'LLC Services Billing Plan',
        description: 'Recurring billing for LLC formation services',
        type: 'INFINITE',
        payment_definitions: [{
          id: 'regular',
          name: 'Regular Payment',
          type: 'REGULAR',
          frequency: 'Month',
          frequency_interval: '1',
          amount: {
            value: '50.00', // Base amount (will be overridden per service)
            currency: 'USD'
          },
          cycles: '0', // Infinite
          charge_models: [{
            id: 'charge',
            type: 'SHIPPING',
            amount: {
              value: '0.00',
              currency: 'USD'
            }
          }]
        }],
        merchant_preferences: {
          auto_bill_amount: 'YES',
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/paypal-success`,
          initial_fail_amount_action: 'CONTINUE',
          max_fail_attempts: '3'
        }
      },
      payer: {
        payment_method: 'paypal'
      }
    };

    // Create the billing agreement
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody(agreementRequest);

    const agreement = await client.execute(request);

    res.status(200).json({
      billingToken: agreement.result.id,
      approvalUrl: agreement.result.links.find((link: any) => link.rel === 'approval_url')?.href
    });

  } catch (error) {
    console.error('PayPal billing token creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal billing token',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
