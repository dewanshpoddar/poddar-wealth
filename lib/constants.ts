/** Premium calculator - sum assured quick-pick values */
export const SA_PRESETS = [500000, 1000000, 2500000, 5000000, 10000000]

/** Premium calculator - payment mode short labels */
export const MODE_LABEL: Record<string, string> = {
  yearly: 'Yly', halfyearly: 'Hly', quarterly: 'Qly', monthly: 'Mly',
}

/** Primary advisor contact - used across all components, fallback messages, and system prompt */
export const ADVISOR_PHONE = '9415313434'

/** Secondary office number (verified with Ajay sir, June 4 2026) */
export const SECONDARY_PHONE = '7007937104'

/** Groq model identifier - centralised so upgrades require one change */
export const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile'

/** Office hours - import in Footer, Contact, and any component showing business hours */
export const OFFICE_HOURS = {
  en: 'Mon-Sat: 9:00 AM - 6:00 PM',
  hi: 'सोम-शनि: सुबह 9:00 - शाम 6:00 बजे',
}

/** WhatsApp pre-fill message - standardised site-wide */
export const WHATSAPP_PREFILL = {
  en: `Namaste Ajay ji, I visited poddarwealth.com and would like to discuss insurance plans.`,
  hi: `नमस्ते अजय जी, मैंने poddarwealth.com देखा और बीमा योजनाओं के बारे में बात करना चाहता/चाहती हूँ।`,
}

/** AI chatbot disclaimer - for display below chatbot responses */
export const AI_DISCLAIMER = 'AI-generated responses are for information only. For personalised advice, speak with Ajay Kumar Poddar directly.'

