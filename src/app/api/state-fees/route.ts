// src/app/api/state-fees/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all active state fees
export async function GET() {
  try {
    const stateFees = await prisma.stateFee.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        stateName: 'asc',
      },
      select: {
        stateCode: true,
        stateName: true,
        filingFee: true,
        rushFee: true,
        rushAvailable: true,
        rushDays: true,
        standardDays: true,
        annualReportFee: true,
        franchiseTaxFee: true,
      },
    });

    // Convert Decimal to number for JSON response
    const formattedFees = stateFees.map((fee) => ({
      ...fee,
      filingFee: Number(fee.filingFee),
      rushFee: fee.rushFee ? Number(fee.rushFee) : null,
      annualReportFee: fee.annualReportFee ? Number(fee.annualReportFee) : null,
      franchiseTaxFee: fee.franchiseTaxFee ? Number(fee.franchiseTaxFee) : null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedFees,
    });
  } catch (error) {
    console.error('Error fetching state fees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch state fees' },
      { status: 500 }
    );
  }
}

// POST - Get fee for a specific state
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stateCode } = body;

    if (!stateCode) {
      return NextResponse.json(
        { success: false, error: 'State code is required' },
        { status: 400 }
      );
    }

    const stateFee = await prisma.stateFee.findUnique({
      where: {
        stateCode: stateCode.toUpperCase(),
        isActive: true,
      },
      select: {
        stateCode: true,
        stateName: true,
        filingFee: true,
        rushFee: true,
        rushAvailable: true,
        rushDays: true,
        standardDays: true,
        annualReportFee: true,
        franchiseTaxFee: true,
      },
    });

    if (!stateFee) {
      return NextResponse.json(
        { success: false, error: 'State not found or not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...stateFee,
        filingFee: Number(stateFee.filingFee),
        rushFee: stateFee.rushFee ? Number(stateFee.rushFee) : null,
        annualReportFee: stateFee.annualReportFee ? Number(stateFee.annualReportFee) : null,
        franchiseTaxFee: stateFee.franchiseTaxFee ? Number(stateFee.franchiseTaxFee) : null,
      },
    });
  } catch (error) {
    console.error('Error fetching state fee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch state fee' },
      { status: 500 }
    );
  }
}
