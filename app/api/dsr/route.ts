import { DsrRequestType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createAuditLog } from "@/lib/security/audit-log";
import { createSupabaseActionClient, ensureAppUserRecord } from "@/lib/supabase/actions";

const dsrSchema = z.object({
  type: z.nativeEnum(DsrRequestType),
  details: z.string().trim().max(2000).optional(),
});

export const runtime = "nodejs";

async function getAuthenticatedUserId() {
  const supabase = await createSupabaseActionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  await ensureAppUserRecord(user);
  return user.id;
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = dsrSchema.parse(await request.json());
    const { prisma } = await import("@/lib/prisma");
    const dsr = await prisma.dataSubjectRequest.create({
      data: {
        userId,
        type: payload.type,
        details: payload.details,
      },
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    await createAuditLog({
      actorUserId: userId,
      targetUserId: userId,
      action: "DSR_CREATE",
      resource: "data_subject_requests",
      metadata: { dsrId: dsr.id, type: dsr.type },
    });

    return NextResponse.json({ request: dsr }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", fields: error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Unable to create DSR request" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const requests = await prisma.dataSubjectRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        status: true,
        details: true,
        createdAt: true,
        updatedAt: true,
        resolvedAt: true,
      },
      take: 50,
    });

    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch DSR requests" },
      { status: 500 },
    );
  }
}
