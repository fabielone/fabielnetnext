// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

export async function POST(request: Request) {
  try {
    const { amount, userId, subscriptions, setup_future_usage } = await request.json();

    // 1. Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        metadata: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Find or create Stripe customer
    let stripeCustomer;
    if (user.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: user.metadata ? (user.metadata as Record<string, string>) : {}
      });

      // Update user with Stripe ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: stripeCustomer.id }
      });
    }

    // 3. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomer.id,
      setup_future_usage,
      metadata: {
        subscriptions: JSON.stringify(subscriptions)
      },
      payment_method_types: ['card', 'paypal']
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: stripeCustomer.id
    });
  } catch (error) {
    console.error('Payment setup error:', error);
    return NextResponse.json(
      { error: 'Payment setup failed' },
      { status: 500 }
    );
  }
}