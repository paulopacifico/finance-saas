import { beforeEach, describe, expect, it, vi } from "vitest";

const { headersMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("@/lib/supabase/actions", () => ({
  createSupabaseActionClient: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  consumePlaidLinkRateLimit: vi.fn(),
}));

vi.mock("@/lib/plaid", () => ({
  getPlaidClient: vi.fn(),
  plaidCountryCodes: ["CA"],
  plaidProducts: ["transactions", "auth"],
}));

vi.mock("@/lib/security/audit-log", () => ({
  createAuditLog: vi.fn(),
}));

import { POST } from "@/app/api/plaid/link/route";
import { getPlaidClient } from "@/lib/plaid";
import { consumePlaidLinkRateLimit } from "@/lib/security/rate-limit";
import { createSupabaseActionClient } from "@/lib/supabase/actions";

describe("POST /api/plaid/link", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "127.0.0.1" }));
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

    const response = await POST();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 429 when rate limit is exceeded", async () => {
    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-a" } },
          error: null,
        }),
      },
    } as never);
    vi.mocked(consumePlaidLinkRateLimit).mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 30,
    });

    const response = await POST();

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("30");
    await expect(response.json()).resolves.toEqual({
      error: "Rate limit exceeded",
    });
  });

  it("returns 500 when Plaid token generation fails", async () => {
    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-a" } },
          error: null,
        }),
      },
    } as never);
    vi.mocked(consumePlaidLinkRateLimit).mockResolvedValue({
      allowed: true,
      retryAfterSeconds: 0,
    });
    vi.mocked(getPlaidClient).mockReturnValue({
      linkTokenCreate: vi.fn().mockRejectedValue(new Error("plaid down")),
    } as never);

    const response = await POST();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Unable to create Plaid link token",
    });
  });
});
