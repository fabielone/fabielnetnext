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

    // Create order payload - charge today + authorize future billing
    const orderPayload: {
      intent: string;
      purchase_units: Array<{
        reference_id: string;
        amount: {
          currency_code: string;
          value: string;
        };
        description: string;
        custom_id: string;
        invoice_id: string;
      }>;
      application_context: {
        brand_name: string;
        locale: string;
        landing_page: string;
        shipping_preference: string;
        user_action: string;
        return_url: string;
        cancel_url: string;
      };
      payment_source?: {
        paypal: {
          experience_context: {
            payment_method_preference: string;
            brand_name: string;
            locale: string;
            landing_page: string;
            shipping_preference: string;
            user_action: string;
            return_url: string;
            cancel_url: string;
          };
          attributes: {
            vault: {
              store_in_vault: string;
              usage_pattern: string;
              usage_type: string;
              customer_type: string;
            };
          };
        };
      };
    } = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: customer.metadata?.orderId || `LLC-${Date.now()}`,
        amount: {
          currency_code: 'USD',
          value: (amount / 100).toFixed(2)
        },
        description: `LLC Formation - ${customer.metadata?.companyName}`,
        custom_id: customer.metadata?.orderId || `LLC-${Date.now()}`,
        invoice_id: `INV-${customer.metadata?.orderId || Date.now()}`
      }],
      application_context: {
        brand_name: 'Fabiel LLC Formation',
        locale: 'en-US',
        landing_page: 'LOGIN',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?provider=paypal`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?provider=paypal`
      }
    };

    // KEY: Add vaulting if customer has future subscriptions
    if (subscriptions && subscriptions.length > 0) {
      orderPayload.payment_source = {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'Fabiel LLC Formation',
            locale: 'en-US',
            landing_page: 'LOGIN',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?provider=paypal`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?provider=paypal`
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
      };
    }

    // Create the order
    const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderPayload)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('PayPal order creation failed:', errorData);
      throw new Error(`PayPal order creation failed: ${errorData.message || 'Unknown error'}`);
    }

    const orderData = await orderResponse.json();

    // Find approval URL
    const approvalUrl = orderData.links?.find(
      (link: any) => link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response');
    }

    console.log('PayPal order created:', {
      id: orderData.id,
      status: orderData.status,
      hasVaulting: subscriptions?.length > 0,
      customer: customer.email || customer.metadata?.companyName
    });

    res.status(200).json({
      success: true,
      orderId: orderData.id,
      approvalUrl,
      status: orderData.status,
      hasSubscriptions: subscriptions?.length > 0 || false
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({
      error: 'PayPal order creation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
