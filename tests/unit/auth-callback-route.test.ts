import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/actions", () => ({
  createSupabaseActionClient: vi.fn(),
}));

import { GET } from "@/app/auth/callback/route";
import { createSupabaseActionClient } from "@/lib/supabase/actions";

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to auth error when code is missing", async () => {
    const response = await GET(new Request("https://example.com/auth/callback"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/auth/auth-error");
    expect(createSupabaseActionClient).not.toHaveBeenCalled();
  });

  it("redirects to root when code exchange succeeds and next is missing", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        exchangeCodeForSession,
      },
    } as never);

    const response = await GET(new Request("https://example.com/auth/callback?code=abc123"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });

  it("redirects to safe next path when code exchange succeeds", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        exchangeCodeForSession,
      },
    } as never);

    const response = await GET(
      new Request("https://example.com/auth/callback?code=abc123&next=/dashboard"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/dashboard");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });

  it("sanitizes unsafe external next value to root", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        exchangeCodeForSession,
      },
    } as never);

    const response = await GET(
      new Request("https://example.com/auth/callback?code=abc123&next=https://evil.com"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });

  it("redirects to auth error when code exchange fails", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({
      error: { message: "invalid_code" },
    });

    vi.mocked(createSupabaseActionClient).mockResolvedValue({
      auth: {
        exchangeCodeForSession,
      },
    } as never);

    const response = await GET(
      new Request("https://example.com/auth/callback?code=bad-code&next=/dashboard"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/auth/auth-error");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("bad-code");
  });
});
