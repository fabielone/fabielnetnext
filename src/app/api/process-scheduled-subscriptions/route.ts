import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { sendSubscriptionConfirmation, sendSubscriptionFailure } from '../../../lib/email-service';
import { Decimal } from '@prisma/client/runtime/library';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil' // Updated to current version
});

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

    // Get scheduled subscriptions that are due
    const scheduledSubscriptions = await prisma.subscriptionIntent.findMany({
      where: {
        orderId,
        status: 'SCHEDULED',
        scheduledDate: {
          lte: new Date()
        }
      }
    });

    if (scheduledSubscriptions.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No scheduled subscriptions found',
        processed: 0,
        results: [] 
      });
    }

    console.log(`Processing ${scheduledSubscriptions.length} subscriptions for order ${orderId}`);

    const results: Array<{
      service: string;
      status: 'success' | 'failed';
      subscriptionId?: string;
      amount?: Decimal;
      frequency?: string;
      error?: string;
    }> = [];

    for (const subscription of scheduledSubscriptions) {
      try {
        // Create Stripe price
        const price = await stripe.prices.create({
          currency: 'usd',
          unit_amount: Math.round(parseFloat(subscription.amount.toString()) * 100),
          recurring: {
            interval: subscription.frequency === 'YEARLY' ? 'year' : 'month',
          },
          product_data: {
            name: subscription.service,
            metadata: {
              orderId: subscription.orderId,
              companyName: subscription.companyName
            }
          },
        });

        // Create Stripe subscription
        const stripeSubscription = await stripe.subscriptions.create({
          customer: subscription.customerId,
          items: [{ price: price.id }],
          default_payment_method: subscription.paymentMethodId,
          metadata: {
            orderId: subscription.orderId,
            companyName: subscription.companyName,
            intentId: subscription.id
          }
        });

        // Update database
        await prisma.subscriptionIntent.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: price.id,
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
          subscriptionId: stripeSubscription.id,
          companyName: subscription.companyName
        });

        results.push({
          service: subscription.service,
          status: 'success',
          subscriptionId: stripeSubscription.id,
          amount: subscription.amount,
          frequency: subscription.frequency
        });

      } catch (error) {
        console.error(`Failed to process subscription ${subscription.service}:`, error);
        
        // Update with failure
        await prisma.subscriptionIntent.update({
          where: { id: subscription.id },
          data: {
            status: 'FAILED',
            failureReason: error instanceof Error ? error.message : 'Unknown error',
            retryCount: { increment: 1 },
            lastRetryAt: new Date(),
            updatedAt: new Date()
          }
        });

        // Send failure notification
        await sendSubscriptionFailure({
          email: subscription.customerEmail,
          customerName: subscription.customerName,
          serviceName: subscription.service,
          companyName: subscription.companyName,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        results.push({
          service: subscription.service,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
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
    console.error('Error processing scheduled subscriptions:', error);
    res.status(500).json({ 
      error: 'Failed to process subscriptions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}