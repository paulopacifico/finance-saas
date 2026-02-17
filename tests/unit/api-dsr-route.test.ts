import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@prisma/client", () => ({
  DsrRequestType: {
    ACCESS: "ACCESS",
    CORRECTION: "CORRECTION",
    DELETION: "DELETION",
    PORTABILITY: "PORTABILITY",
  },
}));

import { DsrRequestType } from "@prisma/client";

vi.mock("@/lib/supabase/actions", () => ({
  createSupabaseActionClient: vi.fn(),
  ensureAppUserRecord: vi.fn(),
}));

vi.mock("@/lib/security/audit-log", () => ({
  createAuditLog: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    dataSubjectRequest: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { createSupabaseActionClient } from "@/lib/supabase/actions";
import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/dsr/route";

describe("POST /api/dsr", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as never);

    const response = await POST(
      new Request("http://localhost/api/dsr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: DsrRequestType.ACCESS }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 500 when DSR persistence fails", async () => {
    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-a" } },
          error: null,
        }),
      },
    } as never);

    vi.mocked(prisma.dataSubjectRequest.create).mockRejectedValue(
      new Error("db error"),
    );

    const response = await POST(
      new Request("http://localhost/api/dsr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: DsrRequestType.ACCESS }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Unable to create DSR request",
    });
  });
});
