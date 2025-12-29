import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }
  return new Stripe(key)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = getStripe()
    const { amount, formData } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        company_name: formData.companyName,
        email: formData.email,
        registered_agent: formData.registeredAgent.toString(),
        compliance: formData.compliance.toString(),
        website: formData.website || 'none'
      }
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: 'Failed to create payment intent' });
  }
}