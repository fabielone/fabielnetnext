import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
});

// DELETE - Remove a saved payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ paymentMethodId: string }> }
) {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { paymentMethodId } = await params;
    
    // Find the payment method
    const savedPM = await prisma.savedPaymentMethod.findUnique({
      where: { id: paymentMethodId }
    });
    
    if (!savedPM) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }
    
    // Verify ownership
    if (savedPM.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Detach from Stripe if it's a Stripe payment method
    if (savedPM.stripePaymentMethodId) {
      try {
        await stripe.paymentMethods.detach(savedPM.stripePaymentMethodId);
      } catch (stripeError) {
        console.error('Error detaching from Stripe:', stripeError);
        // Continue anyway - might already be detached
      }
    }
    
    // Delete from database
    await prisma.savedPaymentMethod.delete({
      where: { id: paymentMethodId }
    });
    
    // If this was the default, set another one as default
    if (savedPM.isDefault) {
      const nextPaymentMethod = await prisma.savedPaymentMethod.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      });
      
      if (nextPaymentMethod) {
        await prisma.savedPaymentMethod.update({
          where: { id: nextPaymentMethod.id },
          data: { isDefault: true }
        });
        
        // Update Stripe default if applicable
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { stripeCustomerId: true }
        });
        
        if (user?.stripeCustomerId && nextPaymentMethod.stripePaymentMethodId) {
          await stripe.customers.update(user.stripeCustomerId, {
            invoice_settings: {
              default_payment_method: nextPaymentMethod.stripePaymentMethodId
            }
          });
        }
      }
    }
    
    return NextResponse.json({ success: true, message: 'Payment method removed' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}

// PATCH - Update payment method (nickname, set as default)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ paymentMethodId: string }> }
) {
  try {
    const session = await validateSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { paymentMethodId } = await params;
    const { nickname, setAsDefault } = await request.json();
    
    // Find the payment method
    const savedPM = await prisma.savedPaymentMethod.findUnique({
      where: { id: paymentMethodId }
    });
    
    if (!savedPM) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }
    
    // Verify ownership
    if (savedPM.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Build update data
    const updateData: { nickname?: string; isDefault?: boolean } = {};
    
    if (nickname !== undefined) {
      updateData.nickname = nickname;
    }
    
    if (setAsDefault) {
      // Unset other defaults first
      await prisma.savedPaymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
      updateData.isDefault = true;
      
      // Update Stripe default if applicable
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true }
      });
      
      if (user?.stripeCustomerId && savedPM.stripePaymentMethodId) {
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: savedPM.stripePaymentMethodId
          }
        });
      }
    }
    
    // Update
    const updated = await prisma.savedPaymentMethod.update({
      where: { id: paymentMethodId },
      data: updateData
    });
    
    return NextResponse.json({ 
      success: true,
      paymentMethod: {
        id: updated.id,
        nickname: updated.nickname,
        isDefault: updated.isDefault
      }
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}
