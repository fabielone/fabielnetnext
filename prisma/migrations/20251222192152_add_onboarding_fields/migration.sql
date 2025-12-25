-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "business_goals" TEXT,
ADD COLUMN     "created_via_checkout" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboarding_skipped_at" TIMESTAMP(3),
ADD COLUMN     "referral_source" TEXT,
ADD COLUMN     "welcome_shown" BOOLEAN NOT NULL DEFAULT false;
