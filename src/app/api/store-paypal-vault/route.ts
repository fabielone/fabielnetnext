// pages/api/store-paypal-vault.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderID, payerID, formData, futureItems } = req.body;

    console.log('Storing PayPal vault information:', { orderID, payerID });

    // Get PayPal vault ID from the completed authorization
    const paypal = require('@paypal/checkout-server-sdk');
    
    const environment = process.env.NODE_ENV === 'production' 
      ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
      : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
    
    const client = new paypal.core.PayPalHttpClient(environment);

    // Get order details to extract vault information
    const request = new paypal.orders.OrdersGetRequest(orderID);
    const orderDetails = await client.execute(request);

    // Extract vault/billing agreement information
    const vaultId = orderDetails.result.payment_source?.paypal?.attributes?.vault?.id;
    const billingAgreementId = orderDetails.result.payment_source?.paypal?.billing_agreement_id;

    // Store vault information in your database
    // You might want to create a separate table for payment method vaults
    await prisma.paymentMethodVault.create({
      data: {
        provider: 'PAYPAL',
        customerId: payerID,
        vaultId: vaultId || billingAgreementId,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        companyName: formData.companyName,
        isActive: true,
        metadata: {
          orderID,
          payerID,
          futureServices: futureItems.map(item => item.name)
        }
      }
    });

    res.status(200).json({ 
      success: true,
      vaultId: vaultId || billingAgreementId,
      message: 'PayPal vault information stored successfully'
    });

  } catch (error) {
    console.error('Error storing PayPal vault info:', error);
    res.status(500).json({ 
      error: 'Failed to store vault information',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}