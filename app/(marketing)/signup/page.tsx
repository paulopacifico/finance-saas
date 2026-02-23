"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  mapSupabaseAuthError,
  SIGNUP_MIN_PASSWORD_LENGTH,
  validateSignupPassword,
} from "@/lib/supabase/auth-errors";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const passwordValidationError = validateSignupPassword(password);
    if (passwordValidationError) {
      setErrorMessage(passwordValidationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMessage(mapSupabaseAuthError(error));
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSuccessMessage("Check your inbox to confirm your email and finish sign up.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to initialize authentication. Check environment variables.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Create Account</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Create your account to start using Finflow.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-sm font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-sm font-medium text-[var(--text-primary)]">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder={`At least ${SIGNUP_MIN_PASSWORD_LENGTH} characters`}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={SIGNUP_MIN_PASSWORD_LENGTH}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-hover)]"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Use at least {SIGNUP_MIN_PASSWORD_LENGTH} characters. Passwords exposed in known data
              breaches are rejected.
            </p>
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-400" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-emerald-400" role="status">
              {successMessage}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-sm">
          <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-dim)]">
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  );
}
