// src/app/api/registered-agent-pricing/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch registered agent pricing for all states or a specific state
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get('stateCode');

    if (stateCode) {
      // Get state-specific pricing, fallback to "ALL" if not found
      let pricing = await prisma.registeredAgentPricing.findUnique({
        where: {
          stateCode: stateCode.toUpperCase(),
          isActive: true,
        },
      });

      if (!pricing) {
        // Fallback to default pricing
        pricing = await prisma.registeredAgentPricing.findUnique({
          where: {
            stateCode: 'ALL',
            isActive: true,
          },
        });
      }

      if (!pricing) {
        return NextResponse.json(
          { success: false, error: 'Pricing not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          stateCode: pricing.stateCode,
          annualFee: Number(pricing.annualFee),
          firstYearFee: pricing.firstYearFee ? Number(pricing.firstYearFee) : null,
          includedWithFormation: pricing.includedWithFormation,
          includedMonths: pricing.includedMonths,
        },
      });
    }

    // Get all pricing
    const allPricing = await prisma.registeredAgentPricing.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        stateCode: 'asc',
      },
    });

    const formattedPricing = allPricing.map((pricing) => ({
      stateCode: pricing.stateCode,
      annualFee: Number(pricing.annualFee),
      firstYearFee: pricing.firstYearFee ? Number(pricing.firstYearFee) : null,
      includedWithFormation: pricing.includedWithFormation,
      includedMonths: pricing.includedMonths,
    }));

    return NextResponse.json({
      success: true,
      data: formattedPricing,
    });
  } catch (error) {
    console.error('Error fetching registered agent pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
