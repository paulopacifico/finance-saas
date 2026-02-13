import { NextResponse } from "next/server";

import { plaidClient, plaidCountryCodes, plaidProducts } from "@/lib/plaid";

type LinkTokenBody = {
  clientUserId?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as LinkTokenBody;
    const clientUserId = body.clientUserId?.trim() || crypto.randomUUID();

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: clientUserId,
      },
      client_name: "Finance SaaS",
      language: "en",
      country_codes: plaidCountryCodes,
      products: plaidProducts,
      redirect_uri: process.env.PLAID_REDIRECT_URI || undefined,
    });

    return NextResponse.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error) {
    console.error("plaid link token error", error);
    return NextResponse.json(
      { error: "Unable to create Plaid link token" },
      { status: 500 },
    );
  }
}
