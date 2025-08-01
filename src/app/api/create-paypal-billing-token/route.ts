// pages/api/create-paypal-billing-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import paypal from '@paypal/paypal-server-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyName } = req.body; // Removed unused customerEmail

    // PayPal SDK setup
    const environment = new paypal[process.env.NODE_ENV === 'production' ? 'LiveEnvironment' : 'SandboxEnvironment'](
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    );
    // Add type assertion to bypass TypeScript errors
    const client = new (paypal as any).PayPalHttpClient(environment);

    // Create billing agreement (removed unused billingRequest)
    const agreementRequest = {
      name: `LLC Services - ${companyName}`,
      description: `Recurring billing for LLC services - ${companyName}`,
      start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      plan: {
        id: process.env.PAYPAL_BILLING_PLAN_ID,
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
            value: '50.00',
            currency: 'USD'
          },
          cycles: '0',
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

    const request = new (paypal as any).orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody(agreementRequest);

    const agreement = await client.execute(request);

    res.status(200).json({
      billingToken: agreement.result.id,
      approvalUrl: agreement.result.links.find((link: { rel: string }) => link.rel === 'approval_url')?.href
    });

  } catch (error) {
    console.error('PayPal billing token creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal billing token',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
