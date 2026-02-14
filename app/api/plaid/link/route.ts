import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getPlaidClient, plaidCountryCodes, plaidProducts } from "@/lib/plaid";
import { createAuditLog } from "@/lib/security/audit-log";
import { consumePlaidLinkRateLimit } from "@/lib/security/rate-limit";
import { createSupabaseActionClient } from "@/lib/supabase/actions";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `plaid-link:${user.id}:${clientIp}`;
    const rateLimit = consumePlaidLinkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const plaidClient = getPlaidClient();

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user.id,
      },
      client_name: "Finance SaaS",
      language: "en",
      country_codes: plaidCountryCodes,
      products: plaidProducts,
      redirect_uri: process.env.PLAID_REDIRECT_URI || undefined,
    });

    await createAuditLog({
      actorUserId: user.id,
      targetUserId: user.id,
      action: "PLAID_LINK_TOKEN_CREATE",
      resource: "plaid",
      ipAddress: clientIp,
    });

    return NextResponse.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch {
    console.error("plaid link token error");
    return NextResponse.json(
      { error: "Unable to create Plaid link token" },
      { status: 500 },
    );
  }
}
