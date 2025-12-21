-- CreateEnum
CREATE TYPE "public"."OAuthProvider" AS ENUM ('google', 'facebook', 'apple');

-- CreateEnum
CREATE TYPE "public"."BusinessEntityType" AS ENUM ('llc', 'corporation', 's_corporation', 'sole_proprietorship', 'partnership', 'non_profit');

-- CreateEnum
CREATE TYPE "public"."BusinessStatus" AS ENUM ('pending', 'active', 'inactive', 'suspended', 'dissolved');

-- CreateEnum
CREATE TYPE "public"."BusinessMemberRole" AS ENUM ('owner', 'member', 'manager', 'viewer');

-- CreateEnum
CREATE TYPE "public"."DocumentCategory" AS ENUM ('formation', 'tax', 'compliance', 'financial', 'legal', 'other');

-- CreateEnum
CREATE TYPE "public"."BusinessEventType" AS ENUM ('deadline', 'renewal', 'meeting', 'tax_due', 'reminder', 'milestone');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('upcoming', 'in_progress', 'completed', 'overdue', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."ServiceCategory" AS ENUM ('llc_formation', 'registered_agent', 'compliance_package', 'website_basic', 'website_pro', 'website_growth', 'ein_service', 'annual_report', 'other');

-- CreateEnum
CREATE TYPE "public"."ServiceStatus" AS ENUM ('pending', 'active', 'paused', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "public"."ComplianceTaskType" AS ENUM ('annual_report', 'franchise_tax', 'business_license', 'registered_agent', 'statement_info', 'tax_filing', 'other');

-- CreateEnum
CREATE TYPE "public"."ComplianceTaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'overdue', 'not_applicable');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "business_id" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar_url" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."oauth_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "public"."OAuthProvider" NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "token_type" TEXT,
    "scope" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_verification_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."businesses" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legal_name" TEXT,
    "entity_type" "public"."BusinessEntityType" NOT NULL DEFAULT 'llc',
    "state" TEXT NOT NULL DEFAULT 'CA',
    "status" "public"."BusinessStatus" NOT NULL DEFAULT 'pending',
    "formation_order_id" TEXT,
    "formation_date" TIMESTAMP(3),
    "ein_number" TEXT,
    "state_file_number" TEXT,
    "business_address" TEXT,
    "business_city" TEXT,
    "business_zip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "is_existing" BOOLEAN NOT NULL DEFAULT false,
    "external_id" TEXT,
    "annual_report_due_date" TIMESTAMP(3),
    "franchise_tax_due_date" TIMESTAMP(3),
    "registered_agent_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_members" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" "public"."BusinessMemberRole" NOT NULL DEFAULT 'member',
    "title" TEXT,
    "ownership_percentage" DOUBLE PRECISION,
    "can_view_documents" BOOLEAN NOT NULL DEFAULT true,
    "can_upload_documents" BOOLEAN NOT NULL DEFAULT false,
    "can_manage_services" BOOLEAN NOT NULL DEFAULT false,
    "can_invite_members" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_documents" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "category" "public"."DocumentCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "is_latest" BOOLEAN NOT NULL DEFAULT true,
    "is_final" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "uploaded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_events" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_type" "public"."BusinessEventType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_all_day" BOOLEAN NOT NULL DEFAULT false,
    "reminder_days" INTEGER,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_rule" TEXT,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'upcoming',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_services" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "service_type" "public"."ServiceCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "billing_cycle" "public"."BillingCycle",
    "status" "public"."ServiceStatus" NOT NULL DEFAULT 'active',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "renewal_date" TIMESTAMP(3),
    "stripe_subscription_id" TEXT,
    "order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."compliance_tasks" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "task_type" "public"."ComplianceTaskType" NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "reminder_date" TIMESTAMP(3),
    "status" "public"."ComplianceTaskStatus" NOT NULL DEFAULT 'pending',
    "completed_at" TIMESTAMP(3),
    "completed_by" TEXT,
    "notes" TEXT,
    "document_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_notes" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "business_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_provider_account_id_key" ON "public"."oauth_accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "public"."password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "public"."email_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_formation_order_id_key" ON "public"."businesses"("formation_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_members_business_id_email_key" ON "public"."business_members"("business_id", "email");

-- AddForeignKey
ALTER TABLE "public"."oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_formation_order_id_fkey" FOREIGN KEY ("formation_order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_members" ADD CONSTRAINT "business_members_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_members" ADD CONSTRAINT "business_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_documents" ADD CONSTRAINT "business_documents_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_events" ADD CONSTRAINT "business_events_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_services" ADD CONSTRAINT "business_services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."compliance_tasks" ADD CONSTRAINT "compliance_tasks_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_notes" ADD CONSTRAINT "business_notes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
