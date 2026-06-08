import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { ADVISOR_PHONE } from './constants'

const ALERTS_PATH = path.join(process.cwd(), 'lib/data/nav-alerts.json')

export interface NavAlert {
  id: string
  email: string
  fund: string
  threshold: number
  direction: 'above' | 'below'
  active: boolean
  createdAt: string
}

export function readAlerts(): NavAlert[] {
  try { return JSON.parse(fs.readFileSync(ALERTS_PATH, 'utf8')) } catch { return [] }
}

function writeAlerts(alerts: NavAlert[]) {
  fs.writeFileSync(ALERTS_PATH, JSON.stringify(alerts, null, 2))
}

export function addAlert(alert: Omit<NavAlert, 'id' | 'createdAt'>): NavAlert {
  const alerts = readAlerts()
  const newAlert: NavAlert = {
    ...alert,
    id: Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
  }
  alerts.push(newAlert)
  writeAlerts(alerts)
  return newAlert
}

export async function checkAndFireAlerts(fund: string, currentNav: number) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const alerts = readAlerts()
  let changed = false

  for (const alert of alerts) {
    if (!alert.active || alert.fund !== fund) continue

    const triggered =
      (alert.direction === 'above' && currentNav >= alert.threshold) ||
      (alert.direction === 'below' && currentNav <= alert.threshold)

    if (!triggered) continue

    // Fire email
    try {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Poddar Wealth <noreply@poddarwealth.com>',
        to: alert.email,
        subject: `NAV Alert: ${fund} has crossed ₹${alert.threshold}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#F59E0B">NAV Alert Triggered 🔔</h2>
          <p>Your LIC ULIP fund <strong>${fund}</strong> has gone ${alert.direction} ₹${alert.threshold}.</p>
          <p><strong>Current NAV:</strong> ₹${currentNav.toFixed(4)}</p>
          <p>For investment advice, call Ajay sir: <strong>${ADVISOR_PHONE}</strong></p>
          <p style="color:#9CA3AF;font-size:12px">This alert has been deactivated. You can set a new one at poddarwealth.com</p>
        </div>`,
      })
    } catch (err) {
      console.error('[nav-alerts] email failed', err)
    }

    alert.active = false
    changed = true
  }

  if (changed) writeAlerts(alerts)
}
