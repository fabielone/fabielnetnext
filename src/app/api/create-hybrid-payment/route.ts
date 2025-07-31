import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Update to latest version
});

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'usd', customer, subscriptions, formData } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    console.log('Creating hybrid payment for:', {
      customerEmail: customer.email,
      amount,
      subscriptionCount: subscriptions.length
    });

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: customer.name,
      address: customer.address,
      metadata: {
        ...customer.metadata,
        hasSubscriptions: subscriptions.length > 0 ? 'true' : 'false'
      }
    });

    console.log('Created Stripe customer:', stripeCustomer.id);

    // Create payment intent with future usage setup
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: stripeCustomer.id,
      metadata: {
        integration_check: 'hybrid_payment',
        orderId: customer.metadata.orderId,
        companyName: customer.metadata.companyName,
        subscriptionCount: subscriptions.length.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
      setup_future_usage: 'off_session', // Key for saving payment method
      receipt_email: customer.email,
    });

    console.log('Created payment intent:', paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      customerId: stripeCustomer.id,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Error creating hybrid payment:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}