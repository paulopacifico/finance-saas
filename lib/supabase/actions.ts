import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const getRequiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export async function createSupabaseActionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseKey) {
    throw new Error(
      "Missing Supabase public key: NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)",
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

function resolveUserEmail(user: Pick<User, "id" | "email">): string {
  return user.email ?? `${user.id}@no-email.local`;
}

function resolveUserFullName(user: Pick<User, "user_metadata">): string | null {
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName !== "string") {
    return null;
  }

  const normalized = fullName.trim();
  return normalized.length > 0 ? normalized : null;
}

export async function ensureAppUserRecord(user: Pick<User, "id" | "email" | "user_metadata">) {
  const { prisma } = await import("@/lib/prisma");
  const email = resolveUserEmail(user);
  const fullName = resolveUserFullName(user);

  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email,
      fullName,
    },
    create: {
      id: user.id,
      email,
      fullName,
    },
  });
}
