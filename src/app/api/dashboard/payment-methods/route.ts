import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

// GET - List saved payment methods
export async function GET() {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const paymentMethods = await prisma.savedPaymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });
    
    return NextResponse.json({ 
      paymentMethods: paymentMethods.map(pm => ({
        id: pm.id,
        provider: pm.provider,
        type: pm.type,
        cardBrand: pm.cardBrand,
        cardLast4: pm.cardLast4,
        cardExpMonth: pm.cardExpMonth,
        cardExpYear: pm.cardExpYear,
        paypalEmail: pm.paypalEmail,
        isDefault: pm.isDefault,
        nickname: pm.nickname,
        stripePaymentMethodId: pm.stripePaymentMethodId,
        createdAt: pm.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

// POST - Save a new payment method after SetupIntent is confirmed
export async function POST(request: Request) {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { paymentMethodId, setAsDefault, nickname } = await request.json();
    
    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }
    
    // Get the user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    });
    
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'Stripe customer not found' }, { status: 400 });
    }
    
    // Check if payment method already exists
    const existing = await prisma.savedPaymentMethod.findUnique({
      where: { stripePaymentMethodId: paymentMethodId }
    });
    
    if (existing) {
      return NextResponse.json({ error: 'Payment method already saved' }, { status: 400 });
    }
    
    // Get payment method details from Stripe
    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    // Verify it's attached to the correct customer
    if (pm.customer !== user.stripeCustomerId) {
      // Attach it to the customer if not already attached
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId
      });
    }
    
    // If setting as default, unset other defaults first
    if (setAsDefault) {
      await prisma.savedPaymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
      
      // Also set as default in Stripe
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    }
    
    // Check if this is the first payment method
    const existingCount = await prisma.savedPaymentMethod.count({
      where: { userId: session.user.id }
    });
    
    // Save to database
    const savedPM = await prisma.savedPaymentMethod.create({
      data: {
        userId: session.user.id,
        provider: 'STRIPE',
        stripePaymentMethodId: paymentMethodId,
        stripeCustomerId: user.stripeCustomerId,
        type: pm.type,
        cardBrand: pm.card?.brand || null,
        cardLast4: pm.card?.last4 || null,
        cardExpMonth: pm.card?.exp_month || null,
        cardExpYear: pm.card?.exp_year || null,
        isDefault: setAsDefault || existingCount === 0, // First one is always default
        nickname: nickname || null
      }
    });
    
    return NextResponse.json({ 
      success: true,
      paymentMethod: {
        id: savedPM.id,
        provider: savedPM.provider,
        type: savedPM.type,
        cardBrand: savedPM.cardBrand,
        cardLast4: savedPM.cardLast4,
        cardExpMonth: savedPM.cardExpMonth,
        cardExpYear: savedPM.cardExpYear,
        isDefault: savedPM.isDefault,
        nickname: savedPM.nickname
      }
    });
  } catch (error) {
    console.error('Error saving payment method:', error);
    return NextResponse.json({ error: 'Failed to save payment method' }, { status: 500 });
  }
}
