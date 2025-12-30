import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }
  return new Stripe(key)
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const sig = request.headers.get('stripe-signature');
    
    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    }

    const body = await request.text();
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find user by Stripe customer ID
        if (paymentIntent.customer) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: paymentIntent.customer as string }
          });
          
          if (user) {
            // Check if payment record already exists
            const existingPayment = await prisma.payment.findUnique({
              where: { stripePaymentIntentId: paymentIntent.id }
            });
            
            if (!existingPayment) {
              await prisma.payment.create({
                data: {
                  userId: user.id,
                  amount: paymentIntent.amount / 100, // Convert from cents
                  currency: paymentIntent.currency,
                  status: 'COMPLETED',
                  paymentMethod: 'stripe',
                  stripePaymentIntentId: paymentIntent.id,
                  description: paymentIntent.description || 'Payment via Stripe',
                }
              });
            }
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceSubscription = (invoice as any).subscription;
        
        if (invoice.customer && invoiceSubscription) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: invoice.customer as string }
          });
          
          if (user) {
            // Find the subscription
            const subscription = await prisma.subscription.findFirst({
              where: { stripeSubscriptionId: invoiceSubscription as string }
            });
            
            // Create payment record for subscription invoice
            await prisma.payment.create({
              data: {
                userId: user.id,
                subscriptionId: subscription?.id || null,
                amount: (invoice.amount_paid ?? 0) / 100,
                currency: invoice.currency ?? 'usd',
                status: 'COMPLETED',
                paymentMethod: 'stripe',
                description: `Subscription payment: ${subscription?.name || 'Unknown'}`,
                receiptUrl: invoice.hosted_invoice_url || undefined,
              }
            });
          }
        }
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        // Use any to access properties that may not be in type definition
        const subData = stripeSubscription as any;
        
        if (stripeSubscription.customer) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: stripeSubscription.customer as string }
          });
          
          if (user) {
            // Check if subscription exists in DB
            const existingSubscription = await prisma.subscription.findFirst({
              where: { stripeSubscriptionId: stripeSubscription.id }
            });
            
            // Map Stripe status to our status enum
            const getStatus = (stripeStatus: string) => {
              switch (stripeStatus) {
                case 'active': return 'ACTIVE' as const;
                case 'canceled': return 'CANCELLED' as const;
                case 'past_due': return 'SUSPENDED' as const;
                case 'paused': return 'PAUSED' as const;
                default: return 'ACTIVE' as const;
              }
            };
            
            const subscriptionData = {
              status: getStatus(stripeSubscription.status),
              currentPeriodStart: subData.current_period_start 
                ? new Date(subData.current_period_start * 1000) 
                : new Date(),
              currentPeriodEnd: subData.current_period_end 
                ? new Date(subData.current_period_end * 1000) 
                : new Date(),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              cancelledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
            };
            
            if (existingSubscription) {
              await prisma.subscription.update({
                where: { id: existingSubscription.id },
                data: subscriptionData
              });
            }
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        
        const existingSubscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: stripeSubscription.id }
        });
        
        if (existingSubscription) {
          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              status: 'CANCELLED',
              cancelledAt: new Date(),
            }
          });
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('Webhook error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 500 });
  }
}
