const BREACHED_PASSWORD_PATTERN = /(haveibeenpwned|pwned|breach|breached|compromised|leaked password)/i;
const INVALID_CREDENTIALS_PATTERN = /(invalid login credentials|invalid credentials)/i;

const DEFAULT_AUTH_ERROR_MESSAGE = "Authentication failed. Please try again.";

export const SIGNUP_MIN_PASSWORD_LENGTH = 12;

type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

export function mapSupabaseAuthError(error: AuthErrorLike | null | undefined): string {
  if (!error) {
    return DEFAULT_AUTH_ERROR_MESSAGE;
  }

  const code = error.code?.toLowerCase() ?? "";
  const message = error.message ?? "";

  if (code === "weak_password" || BREACHED_PASSWORD_PATTERN.test(message)) {
    return "This password has appeared in a data breach. Please choose a different password.";
  }

  if (code === "invalid_credentials" || INVALID_CREDENTIALS_PATTERN.test(message)) {
    return "Invalid email or password.";
  }

  if (message.trim().length > 0) {
    return message;
  }

  return DEFAULT_AUTH_ERROR_MESSAGE;
}

export function validateSignupPassword(password: string): string | null {
  if (password.length < SIGNUP_MIN_PASSWORD_LENGTH) {
    return `Use at least ${SIGNUP_MIN_PASSWORD_LENGTH} characters for your password.`;
  }

  return null;
}
