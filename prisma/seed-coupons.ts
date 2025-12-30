// prisma/seed-coupons.ts
// Run with: npx ts-node prisma/seed-coupons.ts

import { PrismaClient, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

const coupons = [
  {
    code: 'NEWYEAR2026',
    description: 'New Year 2026 Promotion - 20% off LLC formation fee',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 20, // 20% off
    appliesToService: 'llc_formation', // Only applies to formation fee
    usageLimit: null, // Unlimited uses
    isActive: true,
    startsAt: new Date('2025-12-01T00:00:00Z'),
    expiresAt: new Date('2026-03-31T23:59:59Z'),
  },
];

async function main() {
  console.log('Seeding coupons...');

  for (const coupon of coupons) {
    const existing = await prisma.coupon.findUnique({
      where: { code: coupon.code },
    });

    if (existing) {
      // Update existing coupon
      await prisma.coupon.update({
        where: { code: coupon.code },
        data: coupon,
      });
      console.log(`Updated coupon: ${coupon.code}`);
    } else {
      // Create new coupon
      await prisma.coupon.create({
        data: coupon,
      });
      console.log(`Created coupon: ${coupon.code}`);
    }
  }

  console.log('Coupon seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding coupons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
