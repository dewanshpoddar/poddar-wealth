import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { PDFParse } from 'pdf-parse'
import { clean } from '@/lib/server-utils'
import { logger } from '@/lib/logger'
import { adminNotify } from '@/lib/admin-notify'
import { ADVISOR_PHONE } from '@/lib/constants'
import { checkRateLimit } from '@/lib/rate-limit'
import type { PolicyAnalysis, AnalyzerResponse, AnalyzerError } from '@/lib/types/analyzer'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_TEXT_CHARS = 4000

const SYSTEM_PROMPT = `You are an expert LIC insurance policy analyzer helping Indian policyholders understand their policies in simple language. Always respond with valid JSON only, no markdown, no extra text.`

const USER_PROMPT = (text: string) => `A customer has uploaded their LIC policy document. Extract and summarize the following fields. If a field is not found, use the string "Not found in document."

Return ONLY a JSON object with these exact keys:
{
  "policyType": "Type of policy (Endowment, Term, ULIP, Money-Back, Whole Life, etc.)",
  "policyNumber": "Policy number",
  "sumAssured": "Sum Assured in Indian Rupees with ₹ symbol",
  "premium": "Premium amount and frequency (e.g. ₹12,000/year)",
  "startDate": "Policy commencement date",
  "maturityDate": "Policy maturity date",
  "nominee": "Nominee name and relationship",
  "status": "Policy status (Active, Lapsed, Paid-up, Matured)",
  "bonusAccrued": "Total bonus accrued if mentioned",
  "loanOutstanding": "Loan outstanding if any",
  "benefits": "Key benefits and riders in 1-2 sentences",
  "summary": "2-3 sentence plain-language explanation of what this policy does and who it protects",
  "recommendation": "One specific, actionable recommendation for this policyholder based on the policy details"
}

The summary and recommendation must be written in simple English that someone with no insurance knowledge can understand. The recommendation should be specific to what you see in the document (e.g. 'Your policy matures in 2027 — start planning how to reinvest the maturity amount', or 'Your policy is lapsed — contact Ajay Kumar Poddar at ${ADVISOR_PHONE} immediately to revive it before the revival period ends').

Policy document text:
${text}`

function parseGroqResponse(raw: string): PolicyAnalysis {
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON object in response')
  return JSON.parse(jsonMatch[0]) as PolicyAnalysis
}

export async function POST(request: Request): Promise<NextResponse<AnalyzerResponse | AnalyzerError>> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const startTime = Date.now()

  try {
    // Rate limit
    const { allowed } = await checkRateLimit(ip, 5, 3600, 'rl-policy-analyzer')
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. You can analyze up to 5 documents per hour. Call Ajay sir at ${ADVISOR_PHONE} for immediate assistance.` },
        { status: 429 }
      )
    }

    // Parse multipart form
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request format. Please upload a PDF file.' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded. Please select a PDF file.' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ success: false, error: 'Please upload a PDF file. Scanned images are not supported.' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large. Maximum size is 5 MB. Please upload a smaller file.' }, { status: 400 })
    }

    // Extract text from PDF
    let pdfText: string
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const parser = new PDFParse({ data: buffer })
      try {
        const data = await parser.getText()
        pdfText = data.text?.trim() ?? ''
      } finally {
        await parser.destroy()
      }
    } catch (err) {
      logger.warn('/api/analyzers/policy-document', 'PDF parse failed', { error: String(err) })
      return NextResponse.json(
        { success: false, error: 'Could not read this PDF. It may be a scanned image. Please upload a text-based PDF document.' },
        { status: 400 }
      )
    }

    if (!pdfText || pdfText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'This PDF appears to be a scanned image with no readable text. Please upload a digital PDF from LIC\'s portal or your email.' },
        { status: 400 }
      )
    }

    const truncatedText = clean(pdfText.substring(0, MAX_TEXT_CHARS), MAX_TEXT_CHARS)

    // Call Groq
    let analysis: PolicyAnalysis
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT(truncatedText) },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      })
      const raw = completion.choices[0]?.message?.content ?? ''
      analysis = parseGroqResponse(raw)
    } catch (err) {
      logger.error('/api/analyzers/policy-document', 'Groq analysis failed', { error: String(err) })
      adminNotify({
        type: 'API_ERROR', severity: 'warn',
        route: '/api/analyzers/policy-document',
        message: 'Groq policy analysis failed',
        detail: String(err),
      }).catch(() => {})
      return NextResponse.json(
        { success: false, error: `Analysis service temporarily unavailable. Please try again in a moment or call Ajay sir at ${ADVISOR_PHONE}.` },
        { status: 500 }
      )
    }

    const elapsed = Date.now() - startTime
    logger.info('/api/analyzers/policy-document', 'Policy analyzed', {
      ip,
      fileSizeKB: Math.round(file.size / 1024),
      textChars: truncatedText.length,
      elapsedMs: elapsed,
    })

    return NextResponse.json({
      success: true,
      analysis,
      disclaimer: `This analysis is AI-generated and may contain errors. Please verify all details with your LIC branch or call Ajay Kumar Poddar at ${ADVISOR_PHONE} for a complete personal review.`,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    logger.error('/api/analyzers/policy-document', 'Unexpected error', { error: msg })
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
