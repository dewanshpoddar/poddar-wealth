import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verifySession } from '@/lib/admin-auth'

function auth(req: NextRequest) {
  // 1. Check header secret key (for server-to-server crons/integrations)
  const secret = process.env.ADMIN_SECRET
  if (secret && req.headers.get('x-admin-secret') === secret) return true

  // 2. Check signed HttpOnly cookie (for browser admin dashboard UI)
  const token = req.cookies.get('admin_session')?.value
  if (token) {
    const session = verifySession(token)
    if (session) return true
  }

  return false
}

function readFileSafe(p: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), p), 'utf-8')
  } catch {
    return '(file not found)'
  }
}

export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(
    {
      claudeMd: readFileSafe('CLAUDE.md'),
      envExample: readFileSafe('.env.example'),
      packageJson: readFileSafe('package.json'),
      vercelJson: readFileSafe('vercel.json'),
    },
    { headers: { 'Cache-Control': 'private, max-age=60' } }
  )
}
