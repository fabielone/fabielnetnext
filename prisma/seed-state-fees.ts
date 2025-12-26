// prisma/seed-state-fees.ts
// Run with: npx ts-node prisma/seed-state-fees.ts
// Or add to package.json scripts and run via: npx prisma db seed

import { PrismaClient, BillingCycle } from '@prisma/client';

const prisma = new PrismaClient();

// All 50 US states with estimated LLC filing fees
// Note: These are approximate values - update via admin panel with actual current fees
const stateFees = [
  { stateCode: 'AL', stateName: 'Alabama', filingFee: 200, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'AK', stateName: 'Alaska', filingFee: 250, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'AZ', stateName: 'Arizona', filingFee: 50, rushFee: 35, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'AR', stateName: 'Arkansas', filingFee: 45, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'CA', stateName: 'California', filingFee: 70, rushFee: null, rushAvailable: false, standardDays: 3 },
  { stateCode: 'CO', stateName: 'Colorado', filingFee: 50, rushFee: null, rushAvailable: false, standardDays: 3 },
  { stateCode: 'CT', stateName: 'Connecticut', filingFee: 120, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'DE', stateName: 'Delaware', filingFee: 90, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 3 },
  { stateCode: 'FL', stateName: 'Florida', filingFee: 125, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'GA', stateName: 'Georgia', filingFee: 100, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'HI', stateName: 'Hawaii', filingFee: 50, rushFee: null, rushAvailable: false, standardDays: 7 },
  { stateCode: 'ID', stateName: 'Idaho', filingFee: 100, rushFee: 20, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'IL', stateName: 'Illinois', filingFee: 150, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'IN', stateName: 'Indiana', filingFee: 95, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'IA', stateName: 'Iowa', filingFee: 50, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'KS', stateName: 'Kansas', filingFee: 160, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'KY', stateName: 'Kentucky', filingFee: 40, rushFee: 30, rushAvailable: true, rushDays: 1, standardDays: 3 },
  { stateCode: 'LA', stateName: 'Louisiana', filingFee: 100, rushFee: 30, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'ME', stateName: 'Maine', filingFee: 175, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'MD', stateName: 'Maryland', filingFee: 100, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'MA', stateName: 'Massachusetts', filingFee: 500, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'MI', stateName: 'Michigan', filingFee: 50, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'MN', stateName: 'Minnesota', filingFee: 155, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'MS', stateName: 'Mississippi', filingFee: 50, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'MO', stateName: 'Missouri', filingFee: 50, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'MT', stateName: 'Montana', filingFee: 35, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'NE', stateName: 'Nebraska', filingFee: 100, rushFee: 500, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'NV', stateName: 'Nevada', filingFee: 75, rushFee: 125, rushAvailable: true, rushDays: 1, standardDays: 3 },
  { stateCode: 'NH', stateName: 'New Hampshire', filingFee: 100, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'NJ', stateName: 'New Jersey', filingFee: 125, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'NM', stateName: 'New Mexico', filingFee: 50, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'NY', stateName: 'New York', filingFee: 200, rushFee: 75, rushAvailable: true, rushDays: 1, standardDays: 5, requiresPublishedNotice: true, publishedNoticeFee: 1500 },
  { stateCode: 'NC', stateName: 'North Carolina', filingFee: 125, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'ND', stateName: 'North Dakota', filingFee: 135, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'OH', stateName: 'Ohio', filingFee: 99, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'OK', stateName: 'Oklahoma', filingFee: 100, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'OR', stateName: 'Oregon', filingFee: 100, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'PA', stateName: 'Pennsylvania', filingFee: 125, rushFee: 100, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'RI', stateName: 'Rhode Island', filingFee: 150, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'SC', stateName: 'South Carolina', filingFee: 110, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'SD', stateName: 'South Dakota', filingFee: 150, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'TN', stateName: 'Tennessee', filingFee: 300, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'TX', stateName: 'Texas', filingFee: 300, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'UT', stateName: 'Utah', filingFee: 54, rushFee: 75, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'VT', stateName: 'Vermont', filingFee: 125, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'VA', stateName: 'Virginia', filingFee: 100, rushFee: 200, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'WA', stateName: 'Washington', filingFee: 200, rushFee: null, rushAvailable: false, standardDays: 5 },
  { stateCode: 'WV', stateName: 'West Virginia', filingFee: 100, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'WI', stateName: 'Wisconsin', filingFee: 130, rushFee: 25, rushAvailable: true, rushDays: 1, standardDays: 5 },
  { stateCode: 'WY', stateName: 'Wyoming', filingFee: 100, rushFee: 50, rushAvailable: true, rushDays: 1, standardDays: 3 },
];

// Default registered agent pricing (can be overridden per state)
const registeredAgentPricing = [
  { stateCode: 'ALL', annualFee: 149, firstYearFee: 99 },
];

// Service pricing configuration
const servicePricing = [
  { serviceKey: 'llc_formation', serviceName: 'LLC Formation', basePrice: 99.99, isRequired: true },
  { serviceKey: 'ein', serviceName: 'EIN (Federal Tax ID)', basePrice: 0, isRequired: false },
  { serviceKey: 'operating_agreement', serviceName: 'Operating Agreement', basePrice: 0, isRequired: false },
  { serviceKey: 'bank_letter', serviceName: 'Bank Resolution Letter', basePrice: 0, isRequired: false },
  { serviceKey: 'registered_agent', serviceName: 'Registered Agent', basePrice: 149, isRecurring: true, billingCycle: BillingCycle.YEARLY, isRequired: false },
  { serviceKey: 'compliance', serviceName: 'Annual Compliance Service', basePrice: 99, isRecurring: true, billingCycle: BillingCycle.YEARLY, isRequired: false },
];

async function main() {
  console.log('Seeding state fees...');

  // Upsert state fees
  for (const fee of stateFees) {
    await prisma.stateFee.upsert({
      where: { stateCode: fee.stateCode },
      update: fee,
      create: {
        ...fee,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${stateFees.length} state fees`);

  // Upsert registered agent pricing
  for (const pricing of registeredAgentPricing) {
    await prisma.registeredAgentPricing.upsert({
      where: { stateCode: pricing.stateCode },
      update: pricing,
      create: {
        ...pricing,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${registeredAgentPricing.length} registered agent pricing entries`);

  // Upsert service pricing
  for (const service of servicePricing) {
    await prisma.servicePricing.upsert({
      where: { serviceKey: service.serviceKey },
      update: service,
      create: {
        ...service,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${servicePricing.length} service pricing entries`);

  console.log('✓ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
