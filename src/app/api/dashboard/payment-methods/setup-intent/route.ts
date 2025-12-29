import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

// POST - Create a SetupIntent for adding a new payment method
export async function POST() {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        email: true, 
        firstName: true, 
        lastName: true,
        stripeCustomerId: true 
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    let stripeCustomerId = user.stripeCustomerId;
    
    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim() || undefined,
        metadata: { userId: user.id }
      });
      
      stripeCustomerId = customer.id;
      
      // Save to database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId }
      });
    }
    
    // Create SetupIntent for collecting payment method without charging
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      metadata: { 
        userId: user.id 
      },
      usage: 'off_session' // Allow using this payment method for future off-session payments
    });
    
    return NextResponse.json({ 
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json({ error: 'Failed to create setup intent' }, { status: 500 });
  }
}
