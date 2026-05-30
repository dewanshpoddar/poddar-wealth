/** Premium calculator — sum assured quick-pick values */
export const SA_PRESETS = [500000, 1000000, 2500000, 5000000, 10000000]

/** Premium calculator — payment mode short labels */
export const MODE_LABEL: Record<string, string> = {
  yearly: 'Yly', halfyearly: 'Hly', quarterly: 'Qly', monthly: 'Mly',
}

/** Primary advisor contact — used across all components, fallback messages, and system prompt */
export const ADVISOR_PHONE = '9415313434'

/** Groq model identifier — centralised so upgrades require one change */
export const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile'

/** Gemini model identifier — centralised so upgrades require one change */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'

