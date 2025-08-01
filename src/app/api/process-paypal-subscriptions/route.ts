import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

type ProcessingResult = {
  service: string;
  status: 'success' | 'failed';
  transactionId?: string;
  amount?: Decimal;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { orderId } = req.body;

    // Get PayPal subscription intents that are due
    const paypalSubscriptions = await prisma.subscriptionIntent.findMany({
      where: {
        orderId,
        provider: 'PAYPAL',
        status: 'SCHEDULED',
        scheduledDate: { lte: new Date() }
      }
    });

    if (paypalSubscriptions.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No PayPal subscriptions to process',
        processed: 0
      });
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

    const results: ProcessingResult[] = [];

    for (const subscription of paypalSubscriptions) {
      try {
        // Get the stored vault information
        const vaultInfo = await prisma.paymentMethodVault.findFirst({
          where: {
            customerEmail: subscription.customerEmail,
            provider: 'PAYPAL',
            isActive: true
          }
        });

        if (!vaultInfo) {
          throw new Error('PayPal vault information not found');
        }

        // Create a reference transaction using the vault
        const chargeResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
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
                value: subscription.amount.toString()
              },
              description: `${subscription.service} - ${subscription.companyName}`,
              custom_id: `SUB-${subscription.id}`,
              invoice_id: `SUB-INV-${subscription.id}-${Date.now()}`
            }],
            payment_source: {
              paypal: {
                vault_id: vaultInfo.vaultId,
                experience_context: {
                  payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED'
                }
              }
            }
          })
        });

        const orderData = await chargeResponse.json();

        if (chargeResponse.ok) {
          // Auto-capture the order
          const captureResponse = await fetch(`${baseURL}/v2/checkout/orders/${orderData.id}/capture`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            }
          });

          const captureData = await captureResponse.json();

          if (captureResponse.ok) {
            // Update subscription status
            await prisma.subscriptionIntent.update({
              where: { id: subscription.id },
              data: {
                status: 'ACTIVE',
                paypalBillingAgreementId: vaultInfo.vaultId,
                processedAt: new Date(),
                updatedAt: new Date()
              }
            });

            // Send confirmation email
            // await sendSubscriptionConfirmation({...});

            results.push({
              service: subscription.service,
              status: 'success',
              transactionId: captureData.id,
              amount: subscription.amount
            });
          } else {
            throw new Error(`Capture failed: ${captureData.message}`);
          }
        } else {
          throw new Error(`Order creation failed: ${orderData.message}`);
        }

      } catch (error) {
        console.error(`PayPal subscription processing failed for ${subscription.service}:`, error);
        
        // Update with failure
        await prisma.subscriptionIntent.update({
          where: { id: subscription.id },
          data: {
            status: 'FAILED',
            failureReason: error instanceof Error ? error.message : 'PayPal processing failed',
            retryCount: { increment: 1 },
            lastRetryAt: new Date(),
            updatedAt: new Date()
          }
        });

        results.push({
          service: subscription.service,
          status: 'failed',
          error: error instanceof Error ? error.message : 'PayPal processing failed'
        });
      }
    }

    res.status(200).json({ 
      success: true, 
      processed: results.length,
      results,
      summary: {
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length
      }
    });

  } catch (error) {
    console.error('PayPal subscription processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process PayPal subscriptions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}