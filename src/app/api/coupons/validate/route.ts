// API route to validate and apply coupons
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal, serviceKey } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    // Check if coupon has started
    if (coupon.startsAt && new Date() < coupon.startsAt) {
      return NextResponse.json(
        { success: false, error: 'This coupon is not yet active' },
        { status: 400 }
      );
    }

    // Check if coupon has expired
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount !== null && orderTotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Minimum order amount of $${Number(coupon.minOrderAmount).toFixed(2)} required` 
        },
        { status: 400 }
      );
    }

    // Check if coupon applies to the specific service
    if (coupon.appliesToService && serviceKey && coupon.appliesToService !== serviceKey) {
      return NextResponse.json(
        { success: false, error: 'This coupon does not apply to this service' },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    const discountValue = Number(coupon.discountValue);

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderTotal * discountValue) / 100;
    } else {
      // FIXED discount
      discountAmount = discountValue;
    }

    // Apply max discount cap if set
    if (coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
    }

    // Don't let discount exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: discountValue,
        discountAmount: Number(discountAmount.toFixed(2)),
        appliesToService: coupon.appliesToService,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

// Mark coupon as used (call after successful order)
export async function PATCH(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Increment usage count
    await prisma.coupon.update({
      where: { code: code.toUpperCase().trim() },
      data: { usedCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating coupon usage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon usage' },
      { status: 500 }
    );
  }
}
