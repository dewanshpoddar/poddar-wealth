import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // Validate slug — only alphanumeric, hyphens, no traversal
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }
  const contentPath = path.join(process.cwd(), 'lib/data/blog-content', `${slug}.json`)
  if (!fs.existsSync(contentPath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const data = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  })
}
