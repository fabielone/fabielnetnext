import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, customer, subscriptions } = req.body;

    // PayPal SDK implementation
    const paypal = require('@paypal/checkout-server-sdk');
    
    const environment = process.env.NODE_ENV === 'production' 
      ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
      : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
    
    const client = new paypal.core.PayPalHttpClient(environment);

    // Create order with billing agreement setup
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: (amount / 100).toFixed(2)
        },
        description: `LLC Formation - ${customer.metadata.companyName}`
      }],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
            vault_id: customer.email // For future billing
          }
        }
      }
    });

    const order = await client.execute(request);

    res.status(200).json({
      orderId: order.result.id,
      approvalUrl: order.result.links.find((link: any) => link.rel === 'approve')?.href
    });

  } catch (error) {
    console.error('PayPal error:', error);
    res.status(500).json({ 
      error: 'PayPal setup failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}