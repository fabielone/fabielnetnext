// app/api/setup-subscriptions/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }
  return new Stripe(key)
}

export async function POST(request: Request) {
  const { customerId, paymentMethodId, subscriptions, email, orderId } = await request.json();

  console.log('Setup subscriptions called with:', {
    customerId,
    paymentMethodId,
    email,
    orderId,
    subscriptionsCount: subscriptions?.length || 0,
    subscriptions
  });

  try {
    const stripe = getStripe()
    
    // Find user by Stripe customer ID or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { stripeCustomerId: customerId },
          ...(email ? [{ email }] : [])
        ]
      }
    });
    
    if (!user && email) {
      // Try to find by email if not found by customerId
      user = await prisma.user.findUnique({
        where: { email }
      });
    }

    // Find the order and associated business
    let businessId: string | null = null;
    let dbOrderId: string | null = null;
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { orderId },
        include: {
          business: {
            select: { id: true }
          }
        }
      });
      if (order) {
        dbOrderId = order.id;
        businessId = order.business?.id || null;
      }
    }
    
    // Attach payment method to customer
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
    } catch (attachError: any) {
      // Ignore if already attached
      if (!attachError?.message?.includes('already been attached')) {
        throw attachError;
      }
    }

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Calculate trial end date (10 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 10);

    // Create subscriptions and save to database
    const createdSubscriptions = await Promise.all(
      subscriptions.map(async (sub: any) => {
        // First, create a product for this service
        const product = await stripe.products.create({
          name: sub.service,
        });

        // Then create a price for the product
        const price = await stripe.prices.create({
          product: product.id,
          currency: 'usd',
          unit_amount: Math.round(sub.amount * 100),
          recurring: { 
            interval: sub.frequency === 'yearly' ? 'year' : 'month'
          }
        });

        // Create Stripe subscription with the price (10 day trial)
        const stripeSubscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: price.id }],
          trial_period_days: sub.delayDays || 10, // Default to 10 days delay
          metadata: {
            orderId: orderId || '',
            businessId: businessId || '',
            service: sub.service
          }
        });

        // Save subscription to database if we have a user
        if (user) {
          // Get period dates from Stripe subscription (using any to handle Stripe type variations)
          const stripeSub = stripeSubscription as any;
          const periodStart = stripeSub.current_period_start 
            ? new Date(stripeSub.current_period_start * 1000) 
            : new Date();
          const periodEnd = stripeSub.current_period_end 
            ? new Date(stripeSub.current_period_end * 1000) 
            : new Date();

          const dbSubscription = await prisma.subscription.create({
            data: {
              userId: user.id,
              businessId: businessId,
              orderId: dbOrderId,
              name: sub.service,
              description: `${sub.service} - ${sub.frequency} billing`,
              status: 'ACTIVE',
              amount: sub.amount,
              currency: 'usd',
              interval: sub.frequency === 'yearly' ? 'year' : 'month',
              stripeSubscriptionId: stripeSubscription.id,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              trialEndsAt: trialEndsAt,
            }
          });
          return { stripe: stripeSubscription, db: dbSubscription };
        }
        
        return { stripe: stripeSubscription };
      })
    );

    return NextResponse.json({ 
      success: true, 
      subscriptions: createdSubscriptions.map(s => ({
        stripeId: s.stripe.id,
        dbId: s.db?.id
      }))
    });
  } catch (error: any) {
    console.error('Subscription setup failed:', {
      error: error.message,
      stack: error.stack,
      customerId,
      email
    });
    return NextResponse.json(
      { error: 'Subscription setup failed', details: error.message },
      { status: 500 }
    );
  }
}