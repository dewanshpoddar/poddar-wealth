import { NextResponse } from 'next/server'
import reviews from '@/lib/data/reviews.json'

const sorted = [...reviews].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

export async function GET() {
  return NextResponse.json(sorted, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
