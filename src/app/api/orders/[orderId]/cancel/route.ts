// POST /api/orders/[orderId]/cancel - Cancel an order
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/auth';
import { sendOrderCancellationEmail } from '@/lib/email-service';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  return new Stripe(key);
}

export interface OrderCancellationData {
  reason: string;
  feedback?: string;
  acknowledgedConsequences: boolean;
}

export interface RefundBreakdown {
  serviceFeePaid: number;
  stateFilingFeePaid: number;
  rushFeePaid: number;
  processingFeeRetained: number;
  stateFeesRefundable: boolean;
  serviceFeesRefundable: number;
  totalRefund: number;
  stateFeesPaidToState: boolean;
}

// GET /api/orders/[orderId]/cancel - Get refund breakdown for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await validateSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        progressEvents: true,
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

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check for active subscriptions linked to this order
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        orderId: orderId,
        status: { in: ['ACTIVE', 'PAUSED', 'PENDING'] }
      },
      select: {
        id: true,
        name: true,
        status: true,
        amount: true,
        interval: true
      }
    });

    // Check if LLC has been filed (point of no return)
    const llcFiledEvent = order.progressEvents.find(e => e.eventType === 'LLC_FILED');
    const isSubmittedToState = !!llcFiledEvent?.completedAt;

    // Check cancellability based on status and progress
    const validStatusForCancellation = ['PENDING_PROCESSING', 'PROCESSING'].includes(order.status);
    const isCancellable = !isSubmittedToState && validStatusForCancellation;
    
    // Debug info for troubleshooting
    const cancellationDebug = {
      orderStatus: order.status,
      validStatusForCancellation,
      llcFiledEventExists: !!llcFiledEvent,
      llcFiledEventCompletedAt: llcFiledEvent?.completedAt || null,
      isSubmittedToState,
      isCancellable,
      reason: !isCancellable 
        ? (isSubmittedToState 
            ? 'Order already submitted to state' 
            : `Invalid order status: ${order.status}`)
        : null
    };

    // Calculate refund breakdown
    // Note: Prisma Decimal type needs to be converted properly
    const basePrice = order.basePrice ? Number(order.basePrice.toString()) : 99.99;
    const stateFilingFee = order.stateFilingFee ? Number(order.stateFilingFee.toString()) : 0;
    const rushFee = order.rushFee ? Number(order.rushFee.toString()) : 0;
    const processingFee = 25; // Fixed processing fee retained

    console.log('Refund calculation (GET):', {
      orderId: order.orderId,
      rawBasePrice: order.basePrice,
      basePrice,
      stateFilingFee,
      rushFee,
      totalAmount: Number(order.totalAmount)
    });

    // State fees are refundable only if not yet paid to state
    // This is determined by whether the LLC_FILED event exists
    const stateFeesPaidToState = isSubmittedToState;
    const stateFeesRefundable = !stateFeesPaidToState;
    
    // Service fees refund calculation
    // $25 processing fee is ALWAYS retained for any paid order cancellation
    // This covers our payment processing costs (Stripe fees are ~2.9% + $0.30 and not refunded to us)
    const processingFeeRetained = processingFee;
    const serviceFeesRefundable = basePrice - processingFeeRetained;

    const refundBreakdown: RefundBreakdown = {
      serviceFeePaid: basePrice,
      stateFilingFeePaid: stateFilingFee,
      rushFeePaid: rushFee,
      processingFeeRetained,
      stateFeesRefundable,
      serviceFeesRefundable,
      // Total refund: service fee minus processing fee + state fees if not paid + rush fee
      totalRefund: serviceFeesRefundable + 
        (stateFeesRefundable ? stateFilingFee : 0) + 
        rushFee,
      stateFeesPaidToState
    };

    return NextResponse.json({
      order: {
        id: order.id,
        orderId: order.orderId,
        companyName: order.companyName,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
        formationState: order.formationState
      },
      isCancellable,
      isSubmittedToState,
      refundBreakdown,
      progressEvents: order.progressEvents.map(e => ({
        eventType: e.eventType,
        completedAt: e.completedAt
      })),
      activeSubscriptions: activeSubscriptions.map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        amount: Number(s.amount),
        interval: s.interval
      })),
      hasActiveSubscriptions: activeSubscriptions.length > 0,
      debug: cancellationDebug
    });
  } catch (error) {
    console.error('Get order cancellation info error:', error);
    return NextResponse.json(
      { error: 'Failed to get order cancellation info' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await validateSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    // Parse cancellation data
    let cancellationData: OrderCancellationData | null = null;
    try {
      const body = await request.json();
      cancellationData = body as OrderCancellationData;
    } catch {
      // Allow basic cancellation for backwards compatibility
    }

    if (cancellationData && !cancellationData.acknowledgedConsequences) {
      return NextResponse.json(
        { error: 'You must acknowledge the consequences of cancellation' },
        { status: 400 }
      );
    }

    // Get the order with progress events and user info
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        progressEvents: true,
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

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if LLC has been filed (point of no return)
    const llcFiledEvent = order.progressEvents.find(e => e.eventType === 'LLC_FILED');
    const isSubmittedToState = !!llcFiledEvent?.completedAt;

    if (isSubmittedToState) {
      return NextResponse.json(
        { error: 'Order cannot be cancelled after submission to the state. Please contact support.' },
        { status: 400 }
      );
    }

    // Only allow cancellation of pending or processing orders
    if (!['PENDING_PROCESSING', 'PROCESSING'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Only pending or processing orders can be cancelled' },
        { status: 400 }
      );
    }

    // Calculate refund amount
    // Note: Prisma Decimal type needs to be converted properly
    const basePrice = order.basePrice ? Number(order.basePrice.toString()) : 99.99;
    const stateFilingFee = order.stateFilingFee ? Number(order.stateFilingFee.toString()) : 0;
    const rushFee = order.rushFee ? Number(order.rushFee.toString()) : 0;
    const processingFee = 25;

    console.log('Refund calculation (POST):', {
      orderId: order.orderId,
      basePrice,
      stateFilingFee,
      rushFee,
      processingFee,
      serviceFeesRefundable: basePrice - processingFee,
      totalRefund: (basePrice - processingFee) + stateFilingFee + rushFee
    });

    // $25 processing fee is ALWAYS retained for any paid order cancellation
    // This covers payment processing costs (Stripe fees ~2.9% + $0.30 are not refunded to us)
    const processingFeeRetained = processingFee;
    const serviceFeesRefundable = basePrice - processingFeeRetained;
    // State fees and rush fees are fully refundable if order is cancellable (not yet filed with state)
    const totalRefund = serviceFeesRefundable + stateFilingFee + rushFee;

    // Process refund via Stripe if we have a payment transaction ID
    let stripeRefundId: string | null = null;
    let stripeRefundError: string | null = null;
    
    if (order.paymentTransactionId && order.paymentMethod === 'STRIPE' && totalRefund > 0) {
      try {
        const stripe = getStripe();
        const transactionId = order.paymentTransactionId;
        
        console.log(`Processing refund for order ${order.orderId}:`, {
          transactionId,
          totalRefund,
          amountInCents: Math.round(totalRefund * 100)
        });
        
        // Determine if we have a PaymentIntent ID (pi_) or Charge ID (ch_)
        const refundParams: Stripe.RefundCreateParams = {
          amount: Math.round(totalRefund * 100), // Stripe uses cents
          reason: 'requested_by_customer',
          metadata: {
            orderId: order.id,
            orderNumber: order.orderId,
            cancellationReason: cancellationData?.reason || 'customer_request',
            processingFeeRetained: processingFeeRetained.toString(),
            refundType: totalRefund < Number(order.totalAmount) ? 'partial' : 'full'
          }
        };
        
        // Use the appropriate field based on the ID prefix
        if (transactionId.startsWith('pi_')) {
          refundParams.payment_intent = transactionId;
        } else if (transactionId.startsWith('ch_')) {
          refundParams.charge = transactionId;
        } else {
          // Try as payment_intent by default
          refundParams.payment_intent = transactionId;
          console.warn(`Unknown transaction ID format: ${transactionId}, trying as payment_intent`);
        }
        
        // Create the refund
        const refund = await stripe.refunds.create(refundParams);
        
        stripeRefundId = refund.id;
        console.log('Stripe refund created successfully:', {
          refundId: refund.id,
          status: refund.status,
          amount: refund.amount / 100
        });
      } catch (stripeError) {
        const errorMessage = stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error';
        console.error('Stripe refund failed:', {
          error: errorMessage,
          transactionId: order.paymentTransactionId,
          amount: totalRefund
        });
        stripeRefundError = errorMessage;
        // Don't fail the cancellation - we'll process refund manually
        // But log it for admin attention
      }
    } else {
      console.log('Skipping Stripe refund:', {
        hasTransactionId: !!order.paymentTransactionId,
        paymentMethod: order.paymentMethod,
        totalRefund
      });
    }

    // Update order status to cancelled (or REFUNDED if refund was processed)
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: stripeRefundId ? 'REFUNDED' : 'CANCELLED',
        customerNotes: cancellationData?.reason 
          ? `Cancellation reason: ${cancellationData.reason}${cancellationData.feedback ? ` - ${cancellationData.feedback}` : ''}${stripeRefundId ? ` | Refund ID: ${stripeRefundId}` : stripeRefundError ? ` | Refund failed: ${stripeRefundError}` : ''}`
          : order.customerNotes
      }
    });

    // Mark any associated questionnaire as expired (no CANCELLED status exists)
    await prisma.questionnaireResponse.updateMany({
      where: { orderId: order.id },
      data: { status: 'EXPIRED' }
    });

    // Cancel any pending subscription intents
    await prisma.subscriptionIntent.updateMany({
      where: { 
        orderId: order.id,
        status: { in: ['PENDING', 'SCHEDULED'] }
      },
      data: { status: 'CANCELLED' }
    });

    // Send cancellation confirmation email
    if (order.user) {
      try {
        await sendOrderCancellationEmail({
          email: order.user.email,
          customerName: `${order.user.firstName} ${order.user.lastName}`,
          companyName: order.companyName,
          orderId: order.orderId,
          state: order.formationState || 'CA',
          refundBreakdown: {
            serviceFee: basePrice,
            processingFeeDeducted: processingFeeRetained,
            stateFees: stateFilingFee,
            stateFeesRefundable: true,
            totalRefund: totalRefund
          },
          cancellationReason: cancellationData?.reason
        });
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        // Don't fail the cancellation if email fails
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order cancelled successfully',
      refundAmount: totalRefund,
      processingFeeRetained,
      stripeRefundId,
      stripeRefundError,
      refundStatus: stripeRefundId ? 'processed' : (stripeRefundError ? 'failed' : 'pending_manual_review'),
      transactionId: order.paymentTransactionId,
      paymentMethod: order.paymentMethod
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    // Return more details in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { 
        error: 'Failed to cancel order',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
