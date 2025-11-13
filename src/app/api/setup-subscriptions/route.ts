// app/api/setup-subscriptions/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { customerId, paymentMethodId, subscriptions } = await request.json();

  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Create subscriptions
    await Promise.all(
      subscriptions.map((sub: any) => 
        stripe.subscriptions.create({
          customer: customerId,
          items: [{
            price_data: {
              currency: 'usd',
              product: sub.service,
              unit_amount: Math.round(sub.amount * 100),
              recurring: { 
                interval: sub.frequency === 'yearly' ? 'year' : 'month'
              }
            }
          }],
          trial_period_days: sub.delayDays // Start billing after trial
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Subscription setup failed' },
      { status: 500 }
    );
  }
}