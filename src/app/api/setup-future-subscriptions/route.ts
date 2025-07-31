import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, paymentMethodId, orderId, subscriptions, customerInfo } = req.body;

    console.log('Setting up future subscriptions for order:', orderId);

    // Create subscription intents
    const subscriptionIntents = subscriptions.map((sub: any) => ({
      orderId,
      customerId,
      paymentMethodId,
      service: sub.service,
      amount: sub.amount,
      frequency: sub.frequency === 'yearly' ? 'YEARLY' : 'MONTHLY',
      delayDays: sub.delayDays,
      scheduledDate: new Date(Date.now() + (sub.delayDays * 24 * 60 * 60 * 1000)),
      status: 'SCHEDULED',
      provider: 'STRIPE',
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      companyName: customerInfo.companyName,
    }));

    // Save to database using Prisma
    await prisma.subscriptionIntent.createMany({
      data: subscriptionIntents
    });

    console.log(`Saved ${subscriptionIntents.length} subscription intents to database`);

    res.status(200).json({ 
      success: true, 
      scheduledSubscriptions: subscriptionIntents.length,
      subscriptions: subscriptionIntents.map(sub => ({
        service: sub.service,
        amount: sub.amount,
        frequency: sub.frequency,
        scheduledDate: sub.scheduledDate
      }))
    });

  } catch (error) {
    console.error('Error setting up future subscriptions:', error);
    res.status(500).json({ 
      error: 'Failed to setup subscriptions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
