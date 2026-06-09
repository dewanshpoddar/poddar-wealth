interface RateLimitData {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitData>();

// Periodic memory store cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of memoryStore.entries()) {
      if (now > data.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks the rate limit for a given IP/key.
 * Falls back to an in-memory store if the Upstash/Vercel KV REST API is not configured or fails.
 */
export async function checkRateLimit(
  ip: string,
  limit: number,
  windowSeconds: number = 60,
  prefix: string = 'rl'
): Promise<RateLimitResult> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const key = `${prefix}:${ip}`;
      
      // Execute INCR and TTL atomically in a pipeline
      const response = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['TTL', key],
        ]),
        // Prevent hanging requests
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        throw new Error(`KV REST error: ${response.statusText}`);
      }

      const results = await response.json();
      
      // Upstash returns results in array format: [{ result: X }, { result: Y }] or [{ error: ... }]
      if (results[0]?.error) {
        throw new Error(`Redis error: ${results[0].error}`);
      }

      const count = results[0]?.result ?? 1;
      let ttl = results[1]?.result ?? -1;

      // If key was just created, expire is -1. We must set it.
      if (ttl === -1) {
        await fetch(`${url}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(['EXPIRE', key, windowSeconds]),
          signal: AbortSignal.timeout(2000),
        }).catch((err) => {
          console.error('Failed to set expire TTL on rate limit key:', err);
        });
        ttl = windowSeconds;
      }

      const remaining = Math.max(0, limit - count);
      const reset = Math.ceil(Date.now() / 1000) + (ttl > 0 ? ttl : windowSeconds);

      return {
        success: count <= limit,
        limit,
        remaining,
        reset,
      };
    } catch (error) {
      console.error('Vercel KV REST rate limiter failed, falling back to local memory store:', error);
      // Fall through to memory fallback
    }
  }

  // Local Memory Fallback
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil(resetAt / 1000),
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    success: existing.count <= limit,
    limit,
    remaining,
    reset: Math.ceil(existing.resetAt / 1000),
  };
}
