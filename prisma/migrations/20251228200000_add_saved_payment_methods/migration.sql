-- CreateTable
CREATE TABLE IF NOT EXISTS "saved_payment_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "stripe_payment_method_id" TEXT,
    "stripe_customer_id" TEXT,
    "paypal_vault_id" TEXT,
    "type" TEXT NOT NULL,
    "card_brand" TEXT,
    "card_last4" TEXT,
    "card_exp_month" INTEGER,
    "card_exp_year" INTEGER,
    "paypal_email" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "nickname" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "saved_payment_methods_stripe_payment_method_id_key" ON "saved_payment_methods"("stripe_payment_method_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "saved_payment_methods_paypal_vault_id_key" ON "saved_payment_methods"("paypal_vault_id");

-- AddForeignKey
ALTER TABLE "saved_payment_methods" ADD CONSTRAINT "saved_payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
