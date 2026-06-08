const GRAPH_API = 'https://graph.facebook.com/v18.0'

export async function sendWhatsAppMessage(to: string, text: string): Promise<unknown> {
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!phoneId || !token) {
    console.warn('[whatsapp] WHATSAPP_PHONE_ID or WHATSAPP_ACCESS_TOKEN not set')
    return { error: 'WhatsApp not configured' }
  }
  const res = await fetch(`${GRAPH_API}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })
  return res.json()
}

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode = 'en',
  components?: unknown[],
): Promise<unknown> {
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!phoneId || !token) return { error: 'WhatsApp not configured' }
  const res = await fetch(`${GRAPH_API}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: { name: templateName, language: { code: languageCode }, components },
    }),
  })
  return res.json()
}
