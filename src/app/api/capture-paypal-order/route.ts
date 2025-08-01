import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma'; // Your Prisma instance

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderID, formData, subscriptions } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

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

    // Capture the order
    const captureResponse = await fetch(`${baseURL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal capture failed:', errorData);
      throw new Error(`PayPal capture failed: ${errorData.message || 'Unknown error'}`);
    }

    const captureData = await captureResponse.json();

    // Extract vault information if available
    const vaultId = captureData.payment_source?.paypal?.attributes?.vault?.id;
    const customerId = captureData.payment_source?.paypal?.attributes?.vault?.customer?.id;

    console.log('PayPal order captured:', {
      id: captureData.id,
      status: captureData.status,
      vaultId,
      customerId,
      captureId: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id
    });

    // Store vault information for future billing
    if (vaultId && subscriptions?.length > 0) {
      try {
        await prisma.paymentMethodVault.create({
          data: {
            provider: 'PAYPAL',
            customerId: customerId || captureData.payer?.payer_id || orderID,
            vaultId: vaultId,
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            companyName: formData.companyName,
            isActive: true,
            metadata: {
              orderID,
              payerID: captureData.payer?.payer_id,
              futureServices: subscriptions.map((sub: any) => sub.service)
            }
          }
        });
        console.log('PayPal vault information stored successfully');
      } catch (dbError) {
        console.error('Failed to store PayPal vault info:', dbError);
        // Don't fail the payment if vault storage fails
      }
    }

    // Store subscription intents for future processing
    if (subscriptions?.length > 0 && formData) {
      try {
        const subscriptionIntents = subscriptions.map((sub: any) => ({
          orderId: formData.orderId || orderID,
          customerId: customerId || captureData.payer?.payer_id || orderID,
          paymentMethodId: vaultId || 'paypal-vault-pending',
          service: sub.service,
          amount: sub.amount,
          frequency: sub.frequency === 'yearly' ? 'YEARLY' : 'MONTHLY',
          delayDays: sub.delayDays || 7,
          scheduledDate: new Date(Date.now() + ((sub.delayDays || 7) * 24 * 60 * 60 * 1000)),
          status: 'SCHEDULED',
          provider: 'PAYPAL',
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          companyName: formData.companyName,
        }));

        await prisma.subscriptionIntent.createMany({
          data: subscriptionIntents
        });

        console.log(`Stored ${subscriptionIntents.length} PayPal subscription intents`);
      } catch (dbError) {
        console.error('Failed to store subscription intents:', dbError);
      }
    }

    res.status(200).json({
      success: true,
      orderID: captureData.id,
      status: captureData.status,
      captureID: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
      vaultStored: !!vaultId,
      subscriptionsScheduled: subscriptions?.length || 0
    });

  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({
      error: 'PayPal capture failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}