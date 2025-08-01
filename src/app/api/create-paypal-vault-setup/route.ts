// pages/api/create-paypal-vault-setup.ts
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
    const { customerEmail, companyName } = req.body;

    const environment = new paypal[process.env.NODE_ENV === 'production' ? 'LiveEnvironment' : 'SandboxEnvironment'](
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    );
    const client = new (paypal as any).PayPalHttpClient(environment);

    // Create a $0 setup order to vault the payment method
    const request = new (paypal as any).orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'AUTHORIZE', // Use AUTHORIZE for $0 setup
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '0.00' // $0 for payment method setup
        },
        description: `Payment Method Setup - ${companyName}`
      }],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'Fabiel LLC Formation',
            locale: 'en-US',
            landing_page: 'LOGIN',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/paypal-vault-success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
          },
          attributes: {
            vault: {
              store_in_vault: 'ON_SUCCESS',
              usage_pattern: 'RECURRING',
              usage_type: 'MERCHANT',
              customer_type: 'CONSUMER'
            }
          }
        }
      }
    });

    const order = await client.execute(request);

    res.status(200).json({
      vaultSetupOrderId: order.result.id,
      approvalUrl: order.result.links.find((link: any) => link.rel === 'approve')?.href
    });

  } catch (error) {
    console.error('PayPal vault setup error:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal vault setup',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}