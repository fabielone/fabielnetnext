-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('customer', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "public"."WebsiteServiceTier" AS ENUM ('basic', 'pro', 'growth');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('pending', 'active', 'paused', 'cancelled', 'expired', 'suspended');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."WebsiteStatus" AS ENUM ('pending', 'setup', 'review', 'live', 'maintenance', 'suspended');

-- CreateEnum
CREATE TYPE "public"."MarketingCampaignType" AS ENUM ('google_ads', 'facebook_ads', 'seo_organic', 'content_marketing', 'email_marketing', 'social_media');

-- CreateEnum
CREATE TYPE "public"."CampaignStatus" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('pending_processing', 'processing_articles', 'articles_filed', 'obtaining_ein', 'generating_documents', 'completed', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "public"."OrderPriority" AS ENUM ('normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('stripe', 'paypal');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "public"."CommunicationType" AS ENUM ('email_confirmation', 'email_status_update', 'email_completion', 'sms_notification', 'internal_note');

-- CreateEnum
CREATE TYPE "public"."CommunicationStatus" AS ENUM ('pending', 'sent', 'delivered', 'failed', 'bounced');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('articles_of_organization', 'operating_agreement', 'ein_confirmation', 'bank_resolution_letter', 'invoice', 'receipt');

-- CreateEnum
CREATE TYPE "public"."CompanyDuration" AS ENUM ('perpetual', 'fixed_period');

-- CreateEnum
CREATE TYPE "public"."FiscalYearEnd" AS ENUM ('december', 'custom');

-- CreateEnum
CREATE TYPE "public"."ManagementType" AS ENUM ('member_managed', 'manager_managed');

-- CreateEnum
CREATE TYPE "public"."VotingStructure" AS ENUM ('proportional', 'equal_vote', 'custom');

-- CreateEnum
CREATE TYPE "public"."DecisionRule" AS ENUM ('unanimous', 'majority', 'supermajority');

-- CreateEnum
CREATE TYPE "public"."DistributionMethod" AS ENUM ('proportional', 'equal_shares', 'custom');

-- CreateEnum
CREATE TYPE "public"."DistributionFrequency" AS ENUM ('as_decided', 'annually', 'quarterly', 'monthly', 'never');

-- CreateEnum
CREATE TYPE "public"."TaxClassification" AS ENUM ('disregarded_entity', 'partnership', 's_corporation', 'c_corporation');

-- CreateEnum
CREATE TYPE "public"."ValuationMethod" AS ENUM ('professional_appraisal', 'book_value', 'formula_based', 'member_agreement');

-- CreateEnum
CREATE TYPE "public"."MeetingFrequency" AS ENUM ('as_required', 'annually', 'quarterly', 'monthly', 'custom');

-- CreateEnum
CREATE TYPE "public"."QuorumType" AS ENUM ('all_members', 'majority_members', 'percentage_ownership');

-- CreateEnum
CREATE TYPE "public"."ReportPreparer" AS ENUM ('company_member', 'outside_accountant', 'to_be_decided');

-- CreateEnum
CREATE TYPE "public"."DisputeResolution" AS ENUM ('mediation_first', 'binding_arbitration', 'california_courts');

-- CreateEnum
CREATE TYPE "public"."MemberType" AS ENUM ('individual', 'entity');

-- CreateEnum
CREATE TYPE "public"."ContributionType" AS ENUM ('cash', 'property', 'services');

-- CreateEnum
CREATE TYPE "public"."UnanimousConsentType" AS ENUM ('amending_agreement', 'adding_members', 'selling_assets', 'major_debt', 'major_expenses', 'dissolving_company', 'changing_purpose', 'custom');

-- CreateEnum
CREATE TYPE "public"."BankingAuthType" AS ENUM ('any_member', 'specific_members', 'managers_only', 'multiple_signatures');

-- CreateEnum
CREATE TYPE "public"."DissolutionTriggerType" AS ENUM ('unanimous_vote', 'majority_vote', 'member_death', 'member_bankruptcy', 'business_purpose_achieved', 'custom');

-- CreateEnum
CREATE TYPE "public"."SubscriptionFrequency" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "public"."SubscriptionIntentStatus" AS ENUM ('pending', 'scheduled', 'active', 'failed', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('stripe', 'paypal');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role" "public"."UserRole" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stripe_customer_id" TEXT,
    "metadata" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT,
    "company_name" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "business_city" TEXT NOT NULL,
    "business_state" TEXT NOT NULL DEFAULT 'CA',
    "business_zip" TEXT NOT NULL,
    "business_purpose" TEXT NOT NULL,
    "contact_first_name" TEXT NOT NULL,
    "contact_last_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "contact_address" TEXT,
    "need_ein" BOOLEAN NOT NULL DEFAULT true,
    "need_operating_agreement" BOOLEAN NOT NULL DEFAULT true,
    "need_bank_letter" BOOLEAN NOT NULL DEFAULT true,
    "registered_agent" BOOLEAN NOT NULL DEFAULT false,
    "compliance" BOOLEAN NOT NULL DEFAULT false,
    "website_service" "public"."WebsiteServiceTier",
    "base_price" DECIMAL(10,2) NOT NULL DEFAULT 49.99,
    "registered_agent_price" DECIMAL(10,2) NOT NULL DEFAULT 149.00,
    "compliance_price" DECIMAL(10,2) NOT NULL DEFAULT 99.00,
    "website_setup_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'pending_processing',
    "priority" "public"."OrderPriority" NOT NULL DEFAULT 'normal',
    "payment_method" "public"."PaymentMethod" NOT NULL DEFAULT 'stripe',
    "payment_status" "public"."PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_transaction_id" TEXT,
    "payment_date" TIMESTAMP(3),
    "state_filing_date" TIMESTAMP(3),
    "state_filing_number" TEXT,
    "ein" TEXT,
    "ein_issued_date" TIMESTAMP(3),
    "articles_generated" BOOLEAN NOT NULL DEFAULT false,
    "operating_agreement_generated" BOOLEAN NOT NULL DEFAULT false,
    "bank_letter_generated" BOOLEAN NOT NULL DEFAULT false,
    "ein_obtained" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "assigned_to" TEXT,
    "internal_notes" TEXT,
    "customer_notes" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."website_subscriptions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "service_tier" "public"."WebsiteServiceTier" NOT NULL,
    "monthly_price" DECIMAL(10,2) NOT NULL,
    "setup_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'pending',
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "billing_cycle" "public"."BillingCycle" NOT NULL DEFAULT 'monthly',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "next_billing_date" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "paused_at" TIMESTAMP(3),
    "trial_ends_at" TIMESTAMP(3),
    "is_trial_active" BOOLEAN NOT NULL DEFAULT false,
    "domain_name" TEXT,
    "website_url" TEXT,
    "website_status" "public"."WebsiteStatus" NOT NULL DEFAULT 'pending',
    "google_analytics_id" TEXT,
    "facebook_pixel_id" TEXT,
    "google_ads_account_id" TEXT,
    "chat_widget_enabled" BOOLEAN NOT NULL DEFAULT false,
    "scheduling_enabled" BOOLEAN NOT NULL DEFAULT false,
    "marketing_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."website_billing" (
    "id" TEXT NOT NULL,
    "website_subscription_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billing_period_start" TIMESTAMP(3) NOT NULL,
    "billing_period_end" TIMESTAMP(3) NOT NULL,
    "stripe_invoice_id" TEXT,
    "payment_status" "public"."PaymentStatus" NOT NULL,
    "paid_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."marketing_campaigns" (
    "id" TEXT NOT NULL,
    "website_subscription_id" TEXT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "campaign_type" "public"."MarketingCampaignType" NOT NULL,
    "status" "public"."CampaignStatus" NOT NULL DEFAULT 'draft',
    "monthly_budget" DECIMAL(10,2),
    "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "google_ads_id" TEXT,
    "facebook_campaign_id" TEXT,
    "target_audience" TEXT,
    "keywords" TEXT,
    "demographics" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cost_per_click" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."website_analytics" (
    "id" TEXT NOT NULL,
    "website_subscription_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "page_views" INTEGER NOT NULL DEFAULT 0,
    "unique_visitors" INTEGER NOT NULL DEFAULT 0,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "bounce_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avg_session_duration" INTEGER NOT NULL DEFAULT 0,
    "contact_form_submissions" INTEGER NOT NULL DEFAULT 0,
    "phone_call_clicks" INTEGER NOT NULL DEFAULT 0,
    "appointments_scheduled" INTEGER NOT NULL DEFAULT 0,
    "chat_conversations" INTEGER NOT NULL DEFAULT 0,
    "organic_traffic" INTEGER NOT NULL DEFAULT 0,
    "paid_traffic" INTEGER NOT NULL DEFAULT 0,
    "social_traffic" INTEGER NOT NULL DEFAULT 0,
    "direct_traffic" INTEGER NOT NULL DEFAULT 0,
    "referral_traffic" INTEGER NOT NULL DEFAULT 0,
    "avg_load_time" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "mobile_traffic" INTEGER NOT NULL DEFAULT 0,
    "desktop_traffic" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."operating_agreements" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "formation_date" TIMESTAMP(3),
    "business_start_date" TIMESTAMP(3),
    "principal_activity" TEXT,
    "duration" "public"."CompanyDuration" NOT NULL DEFAULT 'perpetual',
    "fixed_end_date" TIMESTAMP(3),
    "fiscalYearEnd" "public"."FiscalYearEnd" NOT NULL DEFAULT 'december',
    "member_count" INTEGER NOT NULL DEFAULT 1,
    "is_single_member" BOOLEAN NOT NULL DEFAULT true,
    "management_type" "public"."ManagementType" NOT NULL DEFAULT 'member_managed',
    "voting_structure" "public"."VotingStructure",
    "major_decision_rule" "public"."DecisionRule",
    "profit_dist_method" "public"."DistributionMethod" NOT NULL DEFAULT 'proportional',
    "dist_frequency" "public"."DistributionFrequency" NOT NULL DEFAULT 'as_decided',
    "tax_classification" "public"."TaxClassification" NOT NULL DEFAULT 'disregarded_entity',
    "allow_member_transfer" BOOLEAN NOT NULL DEFAULT false,
    "transfer_to_non_members" BOOLEAN,
    "right_of_first_refusal" BOOLEAN,
    "family_transfer_allowed" BOOLEAN NOT NULL DEFAULT true,
    "valuation_method" "public"."ValuationMethod" NOT NULL DEFAULT 'book_value',
    "withdrawal_rule" "public"."DecisionRule",
    "withdrawal_payment_method" "public"."PaymentMethod",
    "require_meetings" BOOLEAN NOT NULL DEFAULT false,
    "meeting_frequency" "public"."MeetingFrequency",
    "virtual_meetings_allowed" BOOLEAN,
    "meeting_notice_days" INTEGER,
    "quorum_requirement" "public"."QuorumType",
    "provide_tax_returns" BOOLEAN NOT NULL DEFAULT true,
    "provide_profit_loss" BOOLEAN NOT NULL DEFAULT true,
    "provide_balance_sheet" BOOLEAN NOT NULL DEFAULT false,
    "financial_prepared_by" "public"."ReportPreparer" NOT NULL DEFAULT 'company_member',
    "records_location" TEXT,
    "records_maintained_by" TEXT,
    "dispute_resolution" "public"."DisputeResolution" NOT NULL DEFAULT 'california_courts',
    "witness_required" BOOLEAN NOT NULL DEFAULT false,
    "notarization_required" BOOLEAN NOT NULL DEFAULT false,
    "additional_terms" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "document_generated" BOOLEAN NOT NULL DEFAULT false,
    "document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."llc_members" (
    "id" TEXT NOT NULL,
    "operating_agreement_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "member_type" "public"."MemberType" NOT NULL,
    "entity_type" TEXT,
    "street_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "ssn" TEXT,
    "ownership_percentage" DOUBLE PRECISION,
    "ownership_units" INTEGER,
    "is_responsible_party" BOOLEAN NOT NULL DEFAULT false,
    "time_commitment_required" BOOLEAN NOT NULL DEFAULT false,
    "hours_per_week" INTEGER,
    "guaranteed_payments" BOOLEAN NOT NULL DEFAULT false,
    "guaranteed_amount" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llc_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."llc_managers" (
    "id" TEXT NOT NULL,
    "operating_agreement_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_also_member" BOOLEAN NOT NULL DEFAULT false,
    "member_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llc_managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."member_contributions" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "contribution_type" "public"."ContributionType" NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unanimous_consent_items" (
    "id" TEXT NOT NULL,
    "operating_agreement_id" TEXT NOT NULL,
    "item_type" "public"."UnanimousConsentType" NOT NULL,
    "custom_description" TEXT,
    "dollar_threshold" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unanimous_consent_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banking_authorizations" (
    "id" TEXT NOT NULL,
    "operating_agreement_id" TEXT NOT NULL,
    "authorization_type" "public"."BankingAuthType" NOT NULL,
    "specific_members" TEXT,
    "dollar_threshold" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banking_authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dissolution_triggers" (
    "id" TEXT NOT NULL,
    "operating_agreement_id" TEXT NOT NULL,
    "trigger_type" "public"."DissolutionTriggerType" NOT NULL,
    "custom_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dissolution_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_status_history" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "previous_status" "public"."OrderStatus",
    "new_status" "public"."OrderStatus" NOT NULL,
    "changed_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."communications" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "type" "public"."CommunicationType" NOT NULL,
    "subject" TEXT,
    "content" TEXT,
    "recipient_email" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."CommunicationStatus" NOT NULL DEFAULT 'sent',

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "document_type" "public"."DocumentType" NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "is_latest" BOOLEAN NOT NULL DEFAULT true,
    "is_final" BOOLEAN NOT NULL DEFAULT false,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription_intents" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "frequency" "public"."SubscriptionFrequency" NOT NULL,
    "delay_days" INTEGER NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."SubscriptionIntentStatus" NOT NULL DEFAULT 'pending',
    "provider" "public"."PaymentProvider" NOT NULL DEFAULT 'stripe',
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "paypal_billing_agreement_id" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "last_retry_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_method_vaults" (
    "id" TEXT NOT NULL,
    "provider" "public"."PaymentProvider" NOT NULL,
    "customer_id" TEXT NOT NULL,
    "vault_id" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_vaults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_token_key" ON "public"."user_sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "public"."orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_subscriptions_order_id_key" ON "public"."website_subscriptions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_analytics_website_subscription_id_date_key" ON "public"."website_analytics"("website_subscription_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "operating_agreements_order_id_key" ON "public"."operating_agreements"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_vaults_provider_customer_id_key" ON "public"."payment_method_vaults"("provider", "customer_id");

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."website_subscriptions" ADD CONSTRAINT "website_subscriptions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."website_billing" ADD CONSTRAINT "website_billing_website_subscription_id_fkey" FOREIGN KEY ("website_subscription_id") REFERENCES "public"."website_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marketing_campaigns" ADD CONSTRAINT "marketing_campaigns_website_subscription_id_fkey" FOREIGN KEY ("website_subscription_id") REFERENCES "public"."website_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."website_analytics" ADD CONSTRAINT "website_analytics_website_subscription_id_fkey" FOREIGN KEY ("website_subscription_id") REFERENCES "public"."website_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operating_agreements" ADD CONSTRAINT "operating_agreements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."llc_members" ADD CONSTRAINT "llc_members_operating_agreement_id_fkey" FOREIGN KEY ("operating_agreement_id") REFERENCES "public"."operating_agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."llc_managers" ADD CONSTRAINT "llc_managers_operating_agreement_id_fkey" FOREIGN KEY ("operating_agreement_id") REFERENCES "public"."operating_agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."member_contributions" ADD CONSTRAINT "member_contributions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."llc_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unanimous_consent_items" ADD CONSTRAINT "unanimous_consent_items_operating_agreement_id_fkey" FOREIGN KEY ("operating_agreement_id") REFERENCES "public"."operating_agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."banking_authorizations" ADD CONSTRAINT "banking_authorizations_operating_agreement_id_fkey" FOREIGN KEY ("operating_agreement_id") REFERENCES "public"."operating_agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dissolution_triggers" ADD CONSTRAINT "dissolution_triggers_operating_agreement_id_fkey" FOREIGN KEY ("operating_agreement_id") REFERENCES "public"."operating_agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communications" ADD CONSTRAINT "communications_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscription_intents" ADD CONSTRAINT "subscription_intents_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
