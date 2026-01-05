import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

export async function GET(request: NextRequest) {
  try {
    const paymentMethodId = request.nextUrl.searchParams.get('paymentMethodId');
    
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing paymentMethodId' },
        { status: 400 }
      );
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    return NextResponse.json({
      last4: paymentMethod.card?.last4 || null,
      brand: paymentMethod.card?.brand || null,
      expMonth: paymentMethod.card?.exp_month || null,
      expYear: paymentMethod.card?.exp_year || null,
    });
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment method details' },
      { status: 500 }
    );
  }
}
