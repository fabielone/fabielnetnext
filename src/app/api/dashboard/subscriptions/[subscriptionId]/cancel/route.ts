import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendSubscriptionCancellationEmail } from '@/lib/email-service';

// Cancellation reasons for analytics
export interface CancellationData {
  reason: string;
  feedback?: string;
  willAppointNewAgent?: boolean;
  acknowledgedConsequences: boolean;
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  return new Stripe(key);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { subscriptionId } = await params;
    
    // Parse request body for cancellation options
    let cancelAtPeriodEnd = false;
    try {
      const body = await request.json();
      cancelAtPeriodEnd = body.cancelAtPeriodEnd ?? false;
    } catch {
      // No body provided, use defaults
    }
    
    // Find the subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            state: true,
            stateFileNumber: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    // Verify ownership
    if (subscription.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Check if already cancelled
    if (subscription.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Subscription is already cancelled' }, { status: 400 });
    }
    
    // Cancel on Stripe if there's a Stripe subscription ID
    if (subscription.stripeSubscriptionId) {
      try {
        const stripe = getStripe();
        
        if (cancelAtPeriodEnd) {
          // Cancel at the end of the current billing period
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true
          });
          
          // Update database to reflect pending cancellation
          await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
              cancelAtPeriodEnd: true
            }
          });
          
          return NextResponse.json({ 
            success: true, 
            message: 'Subscription will be cancelled at the end of the billing period' 
          });
        } else {
          // Cancel immediately
          const cancelledStripeSubscription = await stripe.subscriptions.cancel(
            subscription.stripeSubscriptionId
          );
          
          // Update database with cancellation
          await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
              status: 'CANCELLED',
              cancelledAt: new Date(),
              // Update period end from Stripe response
              currentPeriodEnd: (cancelledStripeSubscription as any).current_period_end
                ? new Date((cancelledStripeSubscription as any).current_period_end * 1000)
                : subscription.currentPeriodEnd
            }
          });
          
          return NextResponse.json({ 
            success: true, 
            message: 'Subscription cancelled successfully' 
          });
        }
      } catch (stripeError) {
        console.error('Stripe cancellation error:', stripeError);
        
        // Handle specific Stripe errors
        if (stripeError instanceof Stripe.errors.StripeError) {
          // Don't update the database if Stripe cancellation failed
          return NextResponse.json({ 
            error: 'Failed to cancel subscription with payment provider',
            details: stripeError.message
          }, { status: 502 });
        }
        
        throw stripeError;
      }
    }
    
    // TODO: Handle PayPal subscription cancellation
    if (subscription.paypalSubscriptionId) {
      // PayPal cancellation would go here
      console.warn('PayPal subscription cancellation not yet implemented');
    }
    
    // If no external subscription ID, just update the database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        // Store cancellation reason in metadata for analytics
        // Note: We're not changing status to CANCELLED yet - it stays ACTIVE until period ends
      }
    });
    
    return NextResponse.json({ success: true, message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}

// Allow user to reactivate a pending cancellation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { subscriptionId } = await params;
    
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    if (subscription.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Can only reactivate if it's pending cancellation (not fully cancelled)
    if (subscription.status === 'CANCELLED') {
      return NextResponse.json({ 
        error: 'Subscription is already fully cancelled and cannot be reactivated' 
      }, { status: 400 });
    }
    
    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json({ 
        error: 'Subscription is not pending cancellation' 
      }, { status: 400 });
    }
    
    // Reactivate the subscription
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: false,
        cancelledAt: null
      }
    });
    
    // TODO: Reactivate on Stripe/PayPal if applicable
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription reactivated successfully' 
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 });
  }
}
