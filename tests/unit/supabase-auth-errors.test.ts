import { describe, expect, it } from "vitest";

import {
  mapSupabaseAuthError,
  SIGNUP_MIN_PASSWORD_LENGTH,
  validateSignupPassword,
} from "@/lib/supabase/auth-errors";

describe("supabase auth error mapping", () => {
  it("maps leaked password errors to a friendly message", () => {
    const message = mapSupabaseAuthError({
      code: "weak_password",
      message: "Password should not be one of the breached passwords from HaveIBeenPwned.",
    });

    expect(message).toBe(
      "This password has appeared in a data breach. Please choose a different password.",
    );
  });

  it("maps invalid credentials to a friendly message", () => {
    const message = mapSupabaseAuthError({
      code: "invalid_credentials",
      message: "Invalid login credentials",
    });

    expect(message).toBe("Invalid email or password.");
  });

  it("returns provider message for unrecognized errors", () => {
    const message = mapSupabaseAuthError({
      message: "Email rate limit exceeded",
    });

    expect(message).toBe("Email rate limit exceeded");
  });
});

describe("signup password validation", () => {
  it("rejects passwords shorter than the configured minimum", () => {
    const message = validateSignupPassword("short");

    expect(message).toBe(`Use at least ${SIGNUP_MIN_PASSWORD_LENGTH} characters for your password.`);
  });

  it("accepts passwords that meet the configured minimum", () => {
    const message = validateSignupPassword("LongerPass123");

    expect(message).toBeNull();
  });
});
