-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "formation_state" TEXT NOT NULL DEFAULT 'CA',
ADD COLUMN     "rush_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "rush_processing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state_filing_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ALTER COLUMN "base_price" SET DEFAULT 99.99;

-- CreateTable
CREATE TABLE "public"."state_fees" (
    "id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,
    "filing_fee" DECIMAL(10,2) NOT NULL,
    "rush_fee" DECIMAL(10,2),
    "rush_available" BOOLEAN NOT NULL DEFAULT false,
    "rush_days" INTEGER,
    "standard_days" INTEGER NOT NULL DEFAULT 7,
    "annual_report_fee" DECIMAL(10,2),
    "franchise_tax_fee" DECIMAL(10,2),
    "requires_published_notice" BOOLEAN NOT NULL DEFAULT false,
    "published_notice_fee" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registered_agent_pricing" (
    "id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "annual_fee" DECIMAL(10,2) NOT NULL,
    "first_year_fee" DECIMAL(10,2),
    "included_with_formation" BOOLEAN NOT NULL DEFAULT false,
    "included_months" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registered_agent_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_pricing" (
    "id" TEXT NOT NULL,
    "service_key" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_price" DECIMAL(10,2),
    "billing_cycle" "public"."BillingCycle",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "state_fees_state_code_key" ON "public"."state_fees"("state_code");

-- CreateIndex
CREATE UNIQUE INDEX "registered_agent_pricing_state_code_key" ON "public"."registered_agent_pricing"("state_code");

-- CreateIndex
CREATE UNIQUE INDEX "service_pricing_service_key_key" ON "public"."service_pricing"("service_key");
