import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../lib/prisma';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }
  return new Stripe(key)
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const { amount, customer, subscriptions, setup_future_usage, savedPaymentMethodId, savePaymentMethod } = await request.json();

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
          role: 'CUSTOMER',
          createdViaCheckout: true, // Mark as created during checkout
          onboardingCompleted: true, // Skip onboarding for checkout users
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
    let stripeCustomer: Stripe.Customer | Stripe.DeletedCustomer;
    let needsCustomerUpdate = false;
    
    if (user.stripeCustomerId) {
      try {
        stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
        // If customer was deleted in Stripe, we need to create a new one
        if ((stripeCustomer as Stripe.DeletedCustomer).deleted) {
          needsCustomerUpdate = true;
          throw new Error('Customer was deleted');
        }
      } catch {
        // Customer doesn't exist in Stripe (different environment or deleted)
        // Create a new one
        needsCustomerUpdate = true;
        stripeCustomer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          metadata: {
            ...(user.metadata as Record<string, string>),
            userId: user.id
          }
        });
      }
    } else {
      needsCustomerUpdate = true;
      stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        metadata: {
          ...(user.metadata as Record<string, string>),
          userId: user.id
        }
      });
    }

    // Update user with new Stripe customer ID if needed
    if (needsCustomerUpdate) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: stripeCustomer.id }
      });
      
      // Clear old saved payment methods since they're tied to the old customer
      await prisma.savedPaymentMethod.deleteMany({
        where: { userId: user.id }
      });
    }

    // 3. Check if using a saved payment method
    if (savedPaymentMethodId) {
      // Find the saved payment method
      const savedMethod = await prisma.savedPaymentMethod.findUnique({
        where: { id: savedPaymentMethodId }
      });

      if (!savedMethod || !savedMethod.stripePaymentMethodId) {
        return NextResponse.json(
          { error: 'Saved payment method not found. Please use a new card.' },
          { status: 400 }
        );
      }

      // Verify the payment method still exists in Stripe
      try {
        const stripePaymentMethod = await stripe.paymentMethods.retrieve(savedMethod.stripePaymentMethodId);
        
        // Check if payment method is attached to the current customer
        if (stripePaymentMethod.customer !== stripeCustomer.id) {
          // Payment method exists but for different customer - delete from our DB and reject
          await prisma.savedPaymentMethod.delete({
            where: { id: savedPaymentMethodId }
          });
          return NextResponse.json(
            { error: 'This saved card is no longer valid. Please use a new card.' },
            { status: 400 }
          );
        }
      } catch {
        // Payment method doesn't exist in Stripe - delete from our DB
        await prisma.savedPaymentMethod.delete({
          where: { id: savedPaymentMethodId }
        });
        return NextResponse.json(
          { error: 'This saved card is no longer valid. Please use a new card.' },
          { status: 400 }
        );
      }

      // Create and confirm PaymentIntent with the saved payment method
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: stripeCustomer.id,
        payment_method: savedMethod.stripePaymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          userId: user.id,
          subscriptions: JSON.stringify(subscriptions || [])
        }
      });

      return NextResponse.json({
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        customerId: stripeCustomer.id,
        paymentMethodId: savedMethod.stripePaymentMethodId
      });
    }

    // 4. Create Payment Intent for new card
    const intentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      customer: stripeCustomer.id,
      metadata: {
        userId: user.id,
        subscriptions: JSON.stringify(subscriptions || []),
        savePaymentMethod: savePaymentMethod ? 'true' : 'false'
      },
      // Let Stripe determine payment methods available for the mode/amount/currency
      automatic_payment_methods: { enabled: true },
    };

    if (setup_future_usage || savePaymentMethod) {
      intentParams.setup_future_usage = 'off_session';
    }

    const paymentIntent = await stripe.paymentIntents.create(intentParams);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: stripeCustomer.id
    });
  } catch (error) {
    console.error('Payment setup error:', error);
    
    // Handle Stripe card errors (e.g., card declined)
    if (error instanceof Stripe.errors.StripeCardError) {
      return NextResponse.json(
        { error: error.message || 'Your card was declined' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment setup failed' },
      { status: 500 }
    );
  }
}