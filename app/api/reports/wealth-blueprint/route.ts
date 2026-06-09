import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { WealthBlueprintPDF } from '@/lib/reports/WealthBlueprintPDF'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/rate-limit'
import type { WealthBlueprintReportInput } from '@/lib/types/reports'

function isValidInput(data: unknown): data is WealthBlueprintReportInput {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return (
    typeof d.name === 'string' && d.name.length > 0 &&
    typeof d.results === 'object' && d.results !== null
  )
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const startTime = Date.now()

  const { allowed } = await checkRateLimit(ip, 3, 3600, 'rl-blueprint-pdf')
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many reports. Please wait before generating another.' },
      { status: 429 }
    )
  }

  let data: unknown
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!isValidInput(data)) {
    return NextResponse.json({ error: 'Missing required fields: name and results.' }, { status: 400 })
  }

  const safeName = data.name.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 50) || 'report'

  try {
    const element = React.createElement(WealthBlueprintPDF, { data })
    // renderToBuffer expects a @react-pdf/renderer Document element; cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any)

    logger.info('/api/reports/wealth-blueprint', 'PDF generated', {
      ip,
      elapsedMs: Date.now() - startTime,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="wealth-blueprint-${safeName.replace(/\s+/g, '-')}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    logger.error('/api/reports/wealth-blueprint', 'PDF generation failed', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    )
  }
}
