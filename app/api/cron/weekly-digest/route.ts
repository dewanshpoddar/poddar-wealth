import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { ADVISOR_PHONE } from '@/lib/constants'

const SUBSCRIBERS_PATH = path.join(process.cwd(), 'lib/data/newsletter-subscribers.json')
const BLOG_INDEX_PATH = path.join(process.cwd(), 'lib/data/blog-index.json')

interface Subscriber { email: string; name?: string; subscribedAt: string }
interface BlogPost { slug: string; title: string; summary: string; date?: string; readTime?: number }

function getSubscribers(): Subscriber[] {
  try { return JSON.parse(fs.readFileSync(SUBSCRIBERS_PATH, 'utf8')) } catch { return [] }
}

function getLatestPosts(n: number): BlogPost[] {
  try {
    const all: BlogPost[] = JSON.parse(fs.readFileSync(BLOG_INDEX_PATH, 'utf8'))
    return all
      .filter(p => p.date)
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
      .slice(0, n)
  } catch { return [] }
}

function postCard(post: BlogPost): string {
  return `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px">
    <h3 style="margin:0 0 8px;color:#111827;font-size:15px"><a href="https://poddarwealth.com/blog/${post.slug}" style="color:#D97706;text-decoration:none">${post.title}</a></h3>
    <p style="margin:0 0 8px;color:#6B7280;font-size:13px;line-height:1.5">${post.summary}</p>
    <a href="https://poddarwealth.com/blog/${post.slug}" style="font-size:12px;color:#D97706;font-weight:600">Read more →</a>
  </div>`
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET?.trim()
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ skipped: 'RESEND_API_KEY not configured' })

  const subscribers = getSubscribers()
  if (!subscribers.length) return NextResponse.json({ sent: 0, note: 'No subscribers' })

  const posts = getLatestPosts(3)
  if (!posts.length) return NextResponse.json({ sent: 0, note: 'No blog posts found' })

  const resend = new Resend(resendKey)
  const weekLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })

  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#111827;padding:24px;text-align:center;border-radius:12px 12px 0 0">
      <h1 style="color:#F59E0B;font-size:18px;margin:0;font-weight:700">PODDAR WEALTH</h1>
      <p style="color:#9CA3AF;font-size:12px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase">Weekly Insurance Insights · ${weekLabel}</p>
    </div>
    <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
      <p style="color:#374151;font-size:15px">Namaste! Here are this week's top articles from Ajay sir:</p>
      ${posts.map(postCard).join('')}
      <div style="border-top:1px solid #e5e7eb;margin-top:20px;padding-top:16px;text-align:center">
        <p style="color:#6B7280;font-size:13px">Got questions? Call Ajay sir: <strong>${ADVISOR_PHONE}</strong></p>
        <p style="color:#9CA3AF;font-size:11px">You received this because you subscribed at poddarwealth.com. <a href="https://poddarwealth.com/unsubscribe" style="color:#9CA3AF">Unsubscribe</a></p>
      </div>
    </div>
  </div>`

  let sent = 0
  // Send in batches of 50 to avoid rate limits
  for (let i = 0; i < subscribers.length; i += 50) {
    const batch = subscribers.slice(i, i + 50)
    await Promise.allSettled(
      batch.map(sub =>
        resend.emails.send({
          from: 'Poddar Wealth <noreply@poddarwealth.com>',
          to: sub.email,
          subject: `This Week's Insurance Insights from Ajay sir — ${weekLabel}`,
          html,
        }).then(() => { sent++ }).catch(err => console.error('[weekly-digest]', sub.email, err)),
      ),
    )
  }

  return NextResponse.json({ sent, total: subscribers.length })
}
