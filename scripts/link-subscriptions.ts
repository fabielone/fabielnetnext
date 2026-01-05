import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get recent orders with their businesses
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { 
      business: { select: { id: true } }
    }
  });
  
  console.log(`Found ${orders.length} orders to check`);
  
  for (const order of orders) {
    if (!order.userId || !order.business) {
      console.log(`Skipping order ${order.orderId} - no userId or business`);
      continue;
    }
    
    // Link unlinked subscriptions created around the same time
    const result = await prisma.subscription.updateMany({
      where: {
        userId: order.userId,
        businessId: null,
        createdAt: {
          gte: new Date(new Date(order.createdAt).getTime() - 5 * 60 * 1000),
          lte: new Date(new Date(order.createdAt).getTime() + 5 * 60 * 1000)
        }
      },
      data: {
        businessId: order.business.id,
        orderId: order.id
      }
    });
    
    if (result.count > 0) {
      console.log(`Linked ${result.count} subscriptions to business ${order.business.id} for order ${order.orderId}`);
    }
  }
  
  console.log('Done');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
