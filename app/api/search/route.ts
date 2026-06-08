import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface SearchEntry {
  type: 'blog' | 'service' | 'calculator' | 'faq'
  title: string
  titleHi?: string
  url: string
  excerpt: string
  tags?: string[]
}

interface SearchResult extends SearchEntry {
  score: number
}

const CACHE_PATH = path.join(process.cwd(), 'lib/data/search-index.json')

// Cache the index in memory after first load
let cachedIndex: SearchEntry[] | null = null
let cacheBuiltAt = 0
const CACHE_TTL = 3600_000 // 1 hour

function loadIndex(): SearchEntry[] {
  const now = Date.now()
  if (cachedIndex && now - cacheBuiltAt < CACHE_TTL) return cachedIndex

  try {
    cachedIndex = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
    cacheBuiltAt = now
    return cachedIndex!
  } catch {
    return buildIndex()
  }
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  // Blog posts
  try {
    const blog = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'lib/data/blog-index.json'), 'utf8'),
    ) as Array<{ slug: string; title: string; titleHi?: string; summary?: string; tags?: string[]; category?: string }>
    for (const post of blog) {
      entries.push({
        type: 'blog',
        title: post.title,
        titleHi: post.titleHi,
        url: `/blog/${post.slug}`,
        excerpt: post.summary ?? '',
        tags: post.tags ?? (post.category ? [post.category] : []),
      })
    }
  } catch { /* skip */ }

  // Services
  const services: Array<{ title: string; url: string; excerpt: string; tags: string[] }> = [
    { title: 'Life Insurance', url: '/services/life-insurance', excerpt: 'Comprehensive life insurance plans for families in Gorakhpur and eastern UP.', tags: ['life insurance', 'LIC', 'term plan'] },
    { title: 'Health Insurance', url: '/services/health-insurance', excerpt: 'Health cover for individuals, families, and senior citizens.', tags: ['health insurance', 'mediclaim', 'hospital'] },
    { title: 'Child Planning', url: '/services/child-planning', excerpt: "Secure your child's education and future with the right insurance plan.", tags: ['child plan', 'education', 'Jeevan Tarun'] },
    { title: 'Retirement Planning', url: '/services/retirement', excerpt: 'Build a retirement corpus and secure monthly income with LIC pension plans.', tags: ['retirement', 'pension', 'annuity'] },
    { title: 'Tax Planning', url: '/services/tax-planning', excerpt: 'Save tax under Section 80C with LIC premium payments. Up to ₹1.5L deduction.', tags: ['tax saving', '80C', 'tax planning'] },
    { title: 'Critical Illness Cover', url: '/services/critical-illness', excerpt: 'Get a lump sum payout on diagnosis of 36 critical illnesses.', tags: ['critical illness', 'cancer', 'heart attack'] },
    { title: 'Term Life Insurance', url: '/services/term-life', excerpt: 'Pure protection at affordable premiums. Best term plan in India.', tags: ['term insurance', 'death benefit', 'Jeevan Amar'] },
    { title: 'Keyman Insurance', url: '/services/keyman-insurance', excerpt: 'Protect your business from the loss of key personnel.', tags: ['keyman', 'business insurance', 'key person'] },
    { title: 'Group Health Insurance', url: '/services/group-health', excerpt: 'Affordable group health cover for employees and teams.', tags: ['group health', 'corporate', 'employees'] },
    { title: 'Personal Accident Cover', url: '/services/personal-accident', excerpt: 'Financial support in case of accidental death or disability.', tags: ['accident', 'disability', 'PA cover'] },
    { title: 'Cancer Cover', url: '/services/cancer-cover', excerpt: 'Dedicated cancer insurance with early and major stage coverage.', tags: ['cancer', 'critical illness', 'treatment'] },
  ]
  for (const s of services) entries.push({ type: 'service', ...s })

  // Calculators
  const calculators: Array<{ title: string; url: string; excerpt: string; tags: string[] }> = [
    { title: 'Premium Calculator', url: '/calculators/premium', excerpt: 'Calculate your LIC premium instantly for any plan, age, and sum assured.', tags: ['premium', 'calculator', 'LIC'] },
    { title: 'Maturity Calculator', url: '/calculators/maturity', excerpt: 'Find out how much your LIC policy pays at maturity.', tags: ['maturity', 'returns', 'bonus'] },
    { title: 'Life Insurance Calculator', url: '/calculators/life-insurance', excerpt: 'Find out how much life cover your family actually needs.', tags: ['life cover', 'human life value', 'HLV'] },
    { title: 'Retirement Calculator', url: '/calculators/retirement', excerpt: 'Plan your retirement corpus with monthly income projections.', tags: ['retirement', 'corpus', 'pension'] },
    { title: 'Surrender Value Calculator', url: '/calculators/surrender-value', excerpt: 'Know how much you get if you surrender your LIC policy early.', tags: ['surrender', 'paid-up', 'early exit'] },
    { title: 'Policy Loan Calculator', url: '/calculators/loan', excerpt: 'Calculate the loan you can get against your LIC policy.', tags: ['loan', 'policy loan', 'LIC loan'] },
    { title: 'Policy Health Checker', url: '/calculators/policy-health', excerpt: 'Check if your insurance coverage is adequate for your income and family.', tags: ['policy health', 'adequacy', 'coverage'] },
    { title: 'AI Policy Analyzer', url: '/analyzers/policy-document', excerpt: 'Upload your LIC policy PDF to get an instant AI-powered analysis.', tags: ['policy analyzer', 'AI', 'PDF', 'document'] },
  ]
  for (const c of calculators) entries.push({ type: 'calculator', ...c })

  // Save the built index
  try { fs.writeFileSync(CACHE_PATH, JSON.stringify(entries, null, 2)) } catch { /* non-critical */ }

  cachedIndex = entries
  cacheBuiltAt = Date.now()
  return entries
}

function score(entry: SearchEntry, terms: string[]): number {
  let s = 0
  const titleLower = entry.title.toLowerCase()
  const excerptLower = entry.excerpt.toLowerCase()
  const tagsLower = (entry.tags ?? []).map(t => t.toLowerCase())

  for (const term of terms) {
    if (titleLower.includes(term)) s += 10
    if (excerptLower.includes(term)) s += 4
    for (const tag of tagsLower) if (tag.includes(term)) s += 6
  }
  return s
}

// In-memory result cache
const resultCache = new Map<string, { results: SearchResult[]; ts: number }>()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim().slice(0, 100)

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: q })
  }

  const cacheKey = q.toLowerCase()
  const cached = resultCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < 3_600_000) {
    return NextResponse.json(
      { results: cached.results, query: q, cached: true },
      { headers: { 'Cache-Control': 'public, s-maxage=3600' } },
    )
  }

  const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 1)
  const index = loadIndex()

  const results: SearchResult[] = index
    .map(entry => ({ ...entry, score: score(entry, terms) }))
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  resultCache.set(cacheKey, { results, ts: Date.now() })

  return NextResponse.json(
    { results, query: q, total: results.length },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
