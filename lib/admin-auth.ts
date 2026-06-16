import crypto from 'crypto'

export interface AdminSession {
  role: 'admin' | 'developer' | 'viewer'
  exp: number
}

// Generate token using ADMIN_SECRET as secret key
export function signSession(role: string): string {
  const secret = process.env.ADMIN_SECRET || 'fallback-poddar-wealth-secret-key-2026'
  const payload: AdminSession = {
    role: role as any,
    exp: Date.now() + 1000 * 60 * 60 * 24 // 24 hours expiry
  }
  const payloadStr = JSON.stringify(payload)
  const base64Payload = Buffer.from(payloadStr).toString('base64url')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('hex')
  return `${base64Payload}.${signature}`
}

// Verify token
export function verifySession(token: string): AdminSession | null {
  const secret = process.env.ADMIN_SECRET || 'fallback-poddar-wealth-secret-key-2026'
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadBase64, signature] = parts
  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf8')
    const payload: AdminSession = JSON.parse(payloadStr)
    
    // Check expiry
    if (Date.now() > payload.exp) return null
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadStr)
      .digest('hex')
      
    if (signature !== expectedSignature) return null
    return payload
  } catch {
    return null
  }
}
