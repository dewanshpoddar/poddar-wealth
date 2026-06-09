import { checkRateLimit as checkRateLimitKV } from './rate-limiter-kv'

/**
 * Centered async rate limiter wrapper that delegates to KV REST / memory fallback.
 */
export async function checkRateLimit(
  ip: string,
  limit: number = 15,
  windowSeconds: number = 3600,
  prefix: string = 'rl-global'
): Promise<{ allowed: boolean; remaining: number }> {
  const result = await checkRateLimitKV(ip, limit, windowSeconds, prefix)
  return {
    allowed: result.success,
    remaining: result.remaining,
  }
}
