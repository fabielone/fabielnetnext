// pages/api/process-paypal-subscriptions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sendSubscriptionConfirmation } from '../../../lib/email-service';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

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

    // Get PayPal subscription intents for this order
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

    const paypal = require('@paypal/checkout-server-sdk');
    
    const environment = process.env.NODE_ENV === 'production' 
      ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
      : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
    
    const client = new paypal.core.PayPalHttpClient(environment);

    const results: Array<{
      service: string;
      status: 'success' | 'failed';
      transactionId?: string;
      amount?: Decimal;
      error?: string;
    }> = [];

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

        // Create a billing agreement charge
        const billingRequest = {
          amount: {
            total: subscription.amount.toString(),
            currency: 'USD'
          },
          description: `${subscription.service} - ${subscription.companyName}`,
          invoice_number: `SUB-${subscription.id}-${Date.now()}`,
          note_to_payer: `Recurring charge for ${subscription.service}`
        };

        // Execute billing agreement charge
        const chargeRequest = new paypal.billingAgreements.BillBalanceRequest(vaultInfo.vaultId);
        chargeRequest.requestBody(billingRequest);

        const chargeResult = await client.execute(chargeRequest);

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
        await sendSubscriptionConfirmation({
          email: subscription.customerEmail,
          customerName: subscription.customerName,
          serviceName: subscription.service,
          amount: parseFloat(subscription.amount.toString()),
          frequency: subscription.frequency.toLowerCase(),
          subscriptionId: chargeResult.result.id,
          companyName: subscription.companyName
        });

        results.push({
          service: subscription.service,
          status: 'success',
          transactionId: chargeResult.result.id,
          amount: subscription.amount
        });

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
