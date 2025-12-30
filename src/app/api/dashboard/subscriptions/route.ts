import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get business names for subscriptions that have a businessId
    const businessIds = subscriptions
      .map(sub => sub.businessId)
      .filter((id): id is string => id !== null);
    
    const businesses = businessIds.length > 0 
      ? await prisma.business.findMany({
          where: { id: { in: businessIds } },
          select: { id: true, name: true }
        })
      : [];
    
    const businessMap = new Map(businesses.map(b => [b.id, b.name]));
    
    return NextResponse.json({
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        status: sub.status,
        amount: sub.amount,
        interval: sub.interval,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        trialEndsAt: sub.trialEndsAt,
        cancelledAt: sub.cancelledAt,
        createdAt: sub.createdAt,
        businessId: sub.businessId,
        businessName: sub.businessId ? businessMap.get(sub.businessId) || null : null,
        orderId: sub.orderId
      }))
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
