import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Update to latest version
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { amount, customer, subscriptions, formData } = await request.json();

  if (!amount || amount < 50) {
    return NextResponse.json(
      { error: 'Invalid amount' },
      { status: 400 }
    );
  }

  console.log('Creating hybrid payment for:', {
    customerEmail: customer.email,
    amount,
    subscriptionCount: subscriptions.length
  });

  try {
    // 1. Create Customer
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

    // 2. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomer.id,
      metadata: {
        integration_check: 'hybrid_payment',
        orderId: customer.metadata.orderId,
        companyName: customer.metadata.companyName,
        subscriptionCount: subscriptions.length.toString(),
        subscriptions: JSON.stringify(subscriptions)
      },
      automatic_payment_methods: {
        enabled: true,
      },
      setup_future_usage: 'off_session',
      receipt_email: customer.email,
    });

    console.log('Created payment intent:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: stripeCustomer.id,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Error creating hybrid payment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}