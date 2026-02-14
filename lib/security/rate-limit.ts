type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_SECONDS = RATE_LIMIT_WINDOW_MS / 1000;

const globalForRateLimit = globalThis as unknown as {
  plaidLinkRateLimit?: Map<string, RateLimitEntry>;
};

const store = globalForRateLimit.plaidLinkRateLimit ?? new Map<string, RateLimitEntry>();

if (!globalForRateLimit.plaidLinkRateLimit) {
  globalForRateLimit.plaidLinkRateLimit = store;
}

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstashCommand(args: (string | number)[]) {
  if (!upstashUrl || !upstashToken) {
    return null;
  }

  const response = await fetch(`${upstashUrl}/command`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error(`Upstash command failed with status ${response.status}`);
  }

  const data = (await response.json()) as { result?: string | number | null };
  return data.result ?? null;
}

async function consumeDistributedRateLimit(key: string) {
  const now = Date.now();
  const windowBucket = Math.floor(now / RATE_LIMIT_WINDOW_MS);
  const bucketKey = `${key}:${windowBucket}`;
  const expiresIn = RATE_LIMIT_WINDOW_SECONDS;

  const countResult = await upstashCommand(["INCR", bucketKey]);
  const count = Number(countResult ?? 0);

  if (count === 1) {
    await upstashCommand(["EXPIRE", bucketKey, expiresIn]);
  }

  if (count > RATE_LIMIT_MAX_REQUESTS) {
    const ttlResult = await upstashCommand(["TTL", bucketKey]);
    const retryAfterSeconds = Math.max(1, Number(ttlResult ?? 1));
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function consumeInMemoryRateLimit(key: string): {
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

export async function consumePlaidLinkRateLimit(
  key: string,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  try {
    if (upstashUrl && upstashToken) {
      return await consumeDistributedRateLimit(key);
    }
  } catch (error) {
    console.error("distributed rate limit unavailable, using in-memory fallback", error);
  }

  return consumeInMemoryRateLimit(key);
}
