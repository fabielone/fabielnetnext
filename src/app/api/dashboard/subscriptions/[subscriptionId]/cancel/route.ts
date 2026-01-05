import { NextRequest, NextResponse } from 'next/server';
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
    
    // Parse cancellation data from request body
    let cancellationData: CancellationData | null = null;
    try {
      const body = await request.json();
      cancellationData = body as CancellationData;
    } catch {
      // If no body provided, that's fine for backwards compatibility
    }
    
    // Validate that user acknowledged consequences
    if (cancellationData && !cancellationData.acknowledgedConsequences) {
      return NextResponse.json({ 
        error: 'You must acknowledge the consequences of cancellation' 
      }, { status: 400 });
    }
    
    // Find the subscription with related data
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
    
    // Determine the service end date (end of current billing period)
    const serviceEndDate = subscription.currentPeriodEnd || new Date();
    
    // Update subscription to pending cancellation (service continues until period end)
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        // Store cancellation reason in metadata for analytics
        // Note: We're not changing status to CANCELLED yet - it stays ACTIVE until period ends
      }
    });
    
    // TODO: Cancel on Stripe/PayPal if applicable (cancel at period end)
    // if (subscription.stripeSubscriptionId) {
    //   await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    //     cancel_at_period_end: true
    //   });
    // }
    
    // Determine if this is a registered agent service
    const isRegisteredAgent = subscription.name.toLowerCase().includes('registered agent') ||
                               subscription.name.toLowerCase().includes('agente registrado');
    
    const isCompliancePackage = subscription.name.toLowerCase().includes('compliance') ||
                                 subscription.name.toLowerCase().includes('cumplimiento');
    
    // Send cancellation confirmation email
    try {
      await sendSubscriptionCancellationEmail({
        email: subscription.user.email,
        customerName: `${subscription.user.firstName} ${subscription.user.lastName}`,
        serviceName: subscription.name,
        companyName: subscription.business?.name || 'Your LLC',
        state: subscription.business?.state || 'CA',
        serviceEndDate,
        isRegisteredAgent,
        isCompliancePackage,
        cancellationReason: cancellationData?.reason,
        stateFileNumber: subscription.business?.stateFileNumber || undefined
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription scheduled for cancellation',
      serviceEndDate: serviceEndDate.toISOString(),
      cancelAtPeriodEnd: true
    });
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
