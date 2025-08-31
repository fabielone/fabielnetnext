import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

export async function POST(request: Request) {
  try {
    const { amount, customer, subscriptions, setup_future_usage } = await request.json();

    // Validate required fields
    if (!customer?.email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // 1. Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: customer.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
        metadata: true
      }
    });

    // Create user if doesn't exist
    if (!user) {
      const nameParts = customer.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      user = await prisma.user.create({
        data: {
          email: customer.email,
          firstName,
          lastName,
          metadata: customer.metadata || {},
          // Add any other required user fields with default values
          passwordHash: '', // You might want to handle this differently
          emailVerified: false,
          isActive: true,
          role: 'CUSTOMER'
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          stripeCustomerId: true,
          metadata: true
        }
      });
    }

    // 2. Find or create Stripe customer
    let stripeCustomer;
    if (user.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        metadata: {
          ...(user.metadata as Record<string, string>),
          userId: user.id
        }
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
        userId: user.id,
        subscriptions: JSON.stringify(subscriptions)
      },
      payment_method_types: ['card']
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: stripeCustomer.id
    });
  } catch (error) {
    console.error('Payment setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment setup failed' },
      { status: 500 }
    );
  }
}