function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue
}

function getGroqKey(): string {
  const val = process.env.GROQ_API_KEY || ''
  if (val && !val.startsWith('gsk_')) {
    console.warn('[env] GROQ_API_KEY does not start with "gsk_" - verify it is a valid Groq key')
  }
  return val
}

export const env = {
  GROQ_API_KEY:              getGroqKey(),
  GROQ_MODEL:                process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
  CRON_SECRET:               getEnv('CRON_SECRET'),
  GOOGLE_SHEETS_WEBHOOK_URL: getEnv('GOOGLE_SHEETS_WEBHOOK_URL'),
  ADMIN_SHEETS_WEBHOOK_URL:  process.env.ADMIN_SHEETS_WEBHOOK_URL ?? '',
  GEMINI_API_KEY:            process.env.GEMINI_API_KEY ?? '',
}

