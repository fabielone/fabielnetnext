-- CreateEnum
CREATE TYPE "public"."QuestionnaireStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'expired');

-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'dismissed', 'snoozed');

-- CreateTable
CREATE TABLE "public"."questionnaire_configs" (
    "id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "config_type" TEXT NOT NULL,
    "config_data" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questionnaire_responses" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "products" JSONB NOT NULL,
    "responses" JSONB NOT NULL DEFAULT '{}',
    "status" "public"."QuestionnaireStatus" NOT NULL DEFAULT 'not_started',
    "current_section" TEXT,
    "completed_at" TIMESTAMP(3),
    "pre_populated_data" JSONB,
    "access_token" TEXT NOT NULL,
    "token_expires_at" TIMESTAMP(3),
    "last_saved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pending_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_type" TEXT NOT NULL,
    "task_title" TEXT NOT NULL,
    "task_description" TEXT,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "priority" "public"."TaskPriority" NOT NULL DEFAULT 'medium',
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'pending',
    "due_date" TIMESTAMP(3),
    "reminder_sent_at" TIMESTAMP(3),
    "action_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "pending_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionnaire_configs_state_code_config_type_idx" ON "public"."questionnaire_configs"("state_code", "config_type");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_configs_state_code_config_type_key" ON "public"."questionnaire_configs"("state_code", "config_type");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_responses_order_id_key" ON "public"."questionnaire_responses"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_responses_access_token_key" ON "public"."questionnaire_responses"("access_token");

-- CreateIndex
CREATE INDEX "questionnaire_responses_user_id_idx" ON "public"."questionnaire_responses"("user_id");

-- CreateIndex
CREATE INDEX "questionnaire_responses_status_idx" ON "public"."questionnaire_responses"("status");

-- CreateIndex
CREATE INDEX "questionnaire_responses_access_token_idx" ON "public"."questionnaire_responses"("access_token");

-- CreateIndex
CREATE INDEX "pending_tasks_user_id_status_idx" ON "public"."pending_tasks"("user_id", "status");

-- CreateIndex
CREATE INDEX "pending_tasks_task_type_idx" ON "public"."pending_tasks"("task_type");

-- AddForeignKey
ALTER TABLE "public"."questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pending_tasks" ADD CONSTRAINT "pending_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
