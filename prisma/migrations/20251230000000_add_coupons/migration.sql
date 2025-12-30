-- CreateEnum
CREATE TYPE "discount_type" AS ENUM ('percentage', 'fixed');

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discount_type" "discount_type" NOT NULL DEFAULT 'percentage',
    "discount_value" DECIMAL(10,2) NOT NULL,
    "min_order_amount" DECIMAL(10,2),
    "max_discount_amount" DECIMAL(10,2),
    "applies_to_service" TEXT,
    "usage_limit" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- Insert NEWYEAR2026 coupon
INSERT INTO "coupons" (
    "id",
    "code",
    "description",
    "discount_type",
    "discount_value",
    "applies_to_service",
    "is_active",
    "starts_at",
    "expires_at",
    "created_at",
    "updated_at"
) VALUES (
    'cm5h' || substr(md5(random()::text), 1, 21),
    'NEWYEAR2026',
    'New Year 2026 Promotion - 20% off LLC formation fee',
    'percentage',
    20,
    'llc_formation',
    true,
    '2025-12-01 00:00:00',
    '2026-03-31 23:59:59',
    NOW(),
    NOW()
);
