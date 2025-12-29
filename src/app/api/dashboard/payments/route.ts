import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        order: {
          select: {
            orderId: true,
            companyName: true
          }
        },
        subscription: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      payments: payments.map(payment => ({
        id: payment.id,
        orderId: payment.orderId,
        subscriptionId: payment.subscriptionId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        description: payment.description,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt,
        order: payment.order,
        subscription: payment.subscription
      }))
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
