import { Prisma } from "@prisma/client";

type AuditLogInput = {
  actorUserId?: string | null;
  targetUserId?: string | null;
  action: string;
  resource: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function createAuditLog(input: AuditLogInput) {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.accessAuditLog.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        targetUserId: input.targetUserId ?? null,
        action: input.action,
        resource: input.resource,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        metadata: input.metadata,
      },
    });
  } catch (error) {
    console.error("audit log write failed", error);
  }
}

export function shouldSampleEvent(sampleRate: number): boolean {
  if (sampleRate <= 0) {
    return false;
  }

  if (sampleRate >= 1) {
    return true;
  }

  return Math.random() < sampleRate;
}
