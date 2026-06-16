import { NextRequest, NextResponse } from 'next/server'
import { signSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.password) {
    return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD
  if (!adminPassword) {
    return NextResponse.json({ success: false, error: 'Not configured' }, { status: 503 })
  }

  if (body.password === adminPassword) {
    const role = body.role || 'viewer'
    const token = signSession(role)
    const response = NextResponse.json({ success: true })
    
    // Set cryptographically signed session token in secure HttpOnly cookie
    response.cookies.set('admin_session', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
