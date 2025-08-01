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

    const baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Get access token
    const authString = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const { access_token } = await tokenResponse.json();

    // Create order
    const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (amount / 100).toFixed(2)
          },
          description: `LLC Formation - ${customer.metadata.companyName}`
        }],
        application_context: {
          brand_name: 'Fabiel LLC Formation',
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
        }
      })
    });

    const order = await orderResponse.json();
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href;

    res.status(200).json({
      orderId: order.id,
      approvalUrl
    });

  } catch (error) {
    console.error('PayPal error:', error);
    res.status(500).json({
      error: 'PayPal setup failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}