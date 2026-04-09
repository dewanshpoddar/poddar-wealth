import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are an AI insurance advisor for Poddar Wealth Management, a respected insurance agency in Gorakhpur, UP, India, run by Ajay Kumar Poddar since 1994. MDRT member, Chairman's Club awardee.

Products handled:
- LIC of India: Jeevan Amar (term), New Jeevan Anand, Jeevan Umang, Jeevan Tarun (child), Jeevan Shanti (pension), Jeevan Akshay (pension), money-back plans, endowment plans
- Star Health Insurance: family floater, individual, senior citizen plans

Rules:
- Answer warmly in the same language as the user (Hindi in Devanagari or English)
- Be specific and concise (3-5 sentences max)
- End responses with a gentle nudge to call 9415313434 for personalised advice
- Never make up exact premiums — say "roughly" or "approximately"
- Do not advise on stocks or mutual funds
- If asked about claims, reassure them and explain the simple process with Ajay sir's help`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply: text })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
