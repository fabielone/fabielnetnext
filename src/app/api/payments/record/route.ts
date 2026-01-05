import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { 
      paymentIntentId, 
      orderId, 
      amount, 
      email, 
      paymentMethod = 'stripe',
      description,
      cardLast4,
      cardBrand
    } = await request.json();

    if (!paymentIntentId || !amount || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentIntentId, amount, email' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the order if orderId is provided
    let order: { id: string; orderId: string } | null = null;
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { orderId },
        select: { id: true, orderId: true }
      });
    }

    // Check if payment record already exists (prevent duplicates)
    const existingPayment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntentId }
    });

    if (existingPayment) {
      // Still ensure order is updated and progress event exists
      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'COMPLETED',
            paymentTransactionId: paymentIntentId,
            paymentCardLast4: cardLast4 || null,
            paymentCardBrand: cardBrand || null,
            paymentDate: new Date(),
            status: 'PROCESSING',
            progressLastUpdatedAt: new Date()
          }
        });

        // Ensure ORDER_RECEIVED progress event exists
        await prisma.orderProgressEvent.upsert({
          where: {
            orderId_eventType: {
              orderId: order.id,
              eventType: 'ORDER_RECEIVED'
            }
          },
          update: {
            completedAt: new Date(),
            notes: 'Payment confirmed'
          },
          create: {
            orderId: order.id,
            eventType: 'ORDER_RECEIVED',
            completedAt: new Date(),
            notes: 'Payment confirmed'
          }
        });
      }
      
      return NextResponse.json({ 
        payment: existingPayment,
        message: 'Payment record already exists'
      });
    }

    // Create the payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        orderId: order?.id ?? null,
        amount,
        currency: 'usd',
        status: 'COMPLETED',
        paymentMethod,
        stripePaymentIntentId: paymentIntentId,
        description: description || `Payment for order ${orderId || 'N/A'}`,
      }
    });

    // Update order payment status if order exists
    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          paymentTransactionId: paymentIntentId,
          paymentCardLast4: cardLast4 || null,
          paymentCardBrand: cardBrand || null,
          paymentDate: new Date(),
          status: 'PROCESSING',
          progressLastUpdatedAt: new Date()
        }
      });

      // Create ORDER_RECEIVED progress event when payment is confirmed
      await prisma.orderProgressEvent.upsert({
        where: {
          orderId_eventType: {
            orderId: order.id,
            eventType: 'ORDER_RECEIVED'
          }
        },
        update: {
          completedAt: new Date(),
          notes: 'Payment confirmed'
        },
        create: {
          orderId: order.id,
          eventType: 'ORDER_RECEIVED',
          completedAt: new Date(),
          notes: 'Payment confirmed'
        }
      });
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Error creating payment record:', error);
    return NextResponse.json(
      { error: 'Failed to create payment record' },
      { status: 500 }
    );
  }
}
