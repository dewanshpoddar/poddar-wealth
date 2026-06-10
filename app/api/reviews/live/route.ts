import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const STATIC_REVIEWS_PATH = path.join(process.cwd(), 'lib/data/reviews.json')

interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  relative_time_description: string
}

interface StaticReview {
  author: string
  rating: number
  text: string
  date: string
  source: string
}

interface ReviewsResponse {
  reviews: Array<{
    author: string
    rating: number
    text: string
    date?: string
    relativeTime?: string
    source: 'live' | 'static'
  }>
  rating: number
  totalRatings: number
  source: 'live' | 'static'
}

function loadStaticReviews(): ReviewsResponse {
  try {
    const data = JSON.parse(fs.readFileSync(STATIC_REVIEWS_PATH, 'utf8')) as StaticReview[]
    return {
      reviews: data.map((r) => ({
        author: r.author,
        rating: r.rating,
        text: r.text,
        date: r.date,
        source: 'static' as const,
      })),
      rating: 4.9,
      totalRatings: 154,
      source: 'static',
    }
  } catch {
    return { reviews: [], rating: 4.9, totalRatings: 154, source: 'static' }
  }
}

export const revalidate = 86400 // Cache for 24 hours

export async function GET(): Promise<NextResponse<ReviewsResponse>> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return NextResponse.json(loadStaticReviews())
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`

    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) {
      throw new Error(`Google Places API returned ${res.status}`)
    }

    const data = (await res.json()) as {
      status: string
      result?: {
        rating?: number
        user_ratings_total?: number
        reviews?: GoogleReview[]
      }
    }

    if (data.status !== 'OK' || !data.result) {
      throw new Error(`Google Places API status: ${data.status}`)
    }

    const result = data.result
    const reviews = (result.reviews ?? []).map((r: GoogleReview) => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
      date: new Date(r.time * 1000).toISOString().split('T')[0],
      source: 'live' as const,
    }))

    return NextResponse.json({
      reviews,
      rating: result.rating ?? 4.9,
      totalRatings: result.user_ratings_total ?? 154,
      source: 'live',
    })
  } catch {
    // Graceful fallback to static reviews — log but don't surface error to client
    return NextResponse.json(loadStaticReviews())
  }
}
