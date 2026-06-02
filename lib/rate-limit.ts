const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60 * 60 * 1000  // 1 hour
const MAX_PER_IP = 15

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_PER_IP - 1 }
  }
  if (entry.count >= MAX_PER_IP) {
    return { allowed: false, remaining: 0 }
  }
  entry.count++
  return { allowed: true, remaining: MAX_PER_IP - entry.count }
}

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 10 * 60 * 1000)
