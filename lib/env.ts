function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

function requireGroqKey(): string {
  const val = requireEnv('GROQ_API_KEY')
  if (!val.startsWith('gsk_')) {
    console.warn('[env] GROQ_API_KEY does not start with "gsk_" — verify it is a valid Groq key')
  }
  return val
}

export const env = {
  GROQ_API_KEY:              requireGroqKey(),
  GROQ_MODEL:                process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
  CRON_SECRET:               requireEnv('CRON_SECRET'),
  GOOGLE_SHEETS_WEBHOOK_URL: requireEnv('GOOGLE_SHEETS_WEBHOOK_URL'),
  ADMIN_SHEETS_WEBHOOK_URL:  process.env.ADMIN_SHEETS_WEBHOOK_URL ?? '',
  GEMINI_API_KEY:            process.env.GEMINI_API_KEY ?? '',
}
