import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/service-pricing - Get all active service pricing
export async function GET() {
  try {
    const pricing = await prisma.servicePricing.findMany({
      where: { isActive: true },
      select: {
        id: true,
        serviceKey: true,
        serviceName: true,
        description: true,
        basePrice: true,
        isRecurring: true,
        recurringPrice: true,
        billingCycle: true,
        isRequired: true,
      },
      orderBy: { serviceName: 'asc' }
    });

    // Convert Decimal to number for JSON serialization
    const formattedPricing = pricing.map(p => ({
      ...p,
      basePrice: Number(p.basePrice),
      recurringPrice: p.recurringPrice ? Number(p.recurringPrice) : null,
    }));

    return NextResponse.json({ pricing: formattedPricing });
  } catch (error) {
    console.error('Error fetching service pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service pricing' },
      { status: 500 }
    );
  }
}
