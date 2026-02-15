import { NextResponse } from "next/server";

import { createSupabaseActionClient } from "@/lib/supabase/actions";

function sanitizeNextPath(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/";
  }

  // Prevent protocol-relative redirects like //evil.com
  if (next.startsWith("//")) {
    return "/";
  }

  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseActionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
