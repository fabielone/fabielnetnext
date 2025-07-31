
// lib/cron-scheduler.ts
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Run every hour to check for due subscriptions
export const startSubscriptionProcessor = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled subscription processor...');
    
    try {
      // Get all orders with pending subscriptions that are due
      const ordersWithDueSubscriptions = await prisma.subscriptionIntent.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledDate: {
            lte: new Date()
          }
        },
        select: {
          orderId: true
        },
        distinct: ['orderId']
      });

      console.log(`Found ${ordersWithDueSubscriptions.length} orders with due subscriptions`);

      // Process each order
      for (const order of ordersWithDueSubscriptions) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/process-scheduled-subscriptions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
            },
            body: JSON.stringify({ orderId: order.orderId })
          });

          if (!response.ok) {
            console.error(`Failed to process subscriptions for order ${order.orderId}`);
          } else {
            const result = await response.json();
            console.log(`Successfully processed ${result.processed} subscriptions for order ${order.orderId}`);
          }
        } catch (error) {
          console.error(`Error processing order ${order.orderId}:`, error);
        }
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });

  console.log('Subscription processor scheduled to run every hour');
};