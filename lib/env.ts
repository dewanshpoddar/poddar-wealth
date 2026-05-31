function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

export const env = {
  GROQ_API_KEY: requireEnv('GROQ_API_KEY'),
  GROQ_MODEL: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
  CRON_SECRET: requireEnv('CRON_SECRET'),
  GOOGLE_SHEETS_WEBHOOK_URL: requireEnv('GOOGLE_SHEETS_WEBHOOK_URL'),
}
