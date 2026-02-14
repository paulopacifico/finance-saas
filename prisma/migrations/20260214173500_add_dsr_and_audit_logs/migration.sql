-- CreateEnum
CREATE TYPE "DsrRequestType" AS ENUM ('ACCESS', 'CORRECTION', 'DELETION');

-- CreateEnum
CREATE TYPE "DsrRequestStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "data_subject_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DsrRequestType" NOT NULL,
    "status" "DsrRequestStatus" NOT NULL DEFAULT 'OPEN',
    "details" VARCHAR(2000),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_subject_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_audit_logs" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "targetUserId" TEXT,
    "action" VARCHAR(120) NOT NULL,
    "resource" VARCHAR(120) NOT NULL,
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(512),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "data_subject_requests_userId_status_createdAt_idx" ON "data_subject_requests"("userId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "access_audit_logs_actorUserId_createdAt_idx" ON "access_audit_logs"("actorUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "access_audit_logs_targetUserId_createdAt_idx" ON "access_audit_logs"("targetUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "access_audit_logs_resource_createdAt_idx" ON "access_audit_logs"("resource", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "data_subject_requests" ADD CONSTRAINT "data_subject_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_audit_logs" ADD CONSTRAINT "access_audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_audit_logs" ADD CONSTRAINT "access_audit_logs_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_audit_logs ENABLE ROW LEVEL SECURITY;

-- DSR owner policies
CREATE POLICY dsr_select_owner ON public.data_subject_requests
  FOR SELECT
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY dsr_insert_owner ON public.data_subject_requests
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY dsr_update_owner ON public.data_subject_requests
  FOR UPDATE
  TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

-- service role full access
CREATE POLICY dsr_service_role_all ON public.data_subject_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY access_audit_logs_service_role_all ON public.access_audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
