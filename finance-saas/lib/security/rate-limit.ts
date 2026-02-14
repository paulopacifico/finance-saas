type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const globalForRateLimit = globalThis as unknown as {
  plaidLinkRateLimit?: Map<string, RateLimitEntry>;
};

const store = globalForRateLimit.plaidLinkRateLimit ?? new Map<string, RateLimitEntry>();

if (!globalForRateLimit.plaidLinkRateLimit) {
  globalForRateLimit.plaidLinkRateLimit = store;
}

export function consumePlaidLinkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, retryAfterSeconds: 0 };
}
