/**
 * Poddar Wealth — Google Apps Script (FULL REPLACEMENT)
 * ──────────────────────────────────────────────────────
 * Handles ALL data coming from the website into dedicated tabs.
 *
 * SETUP:
 * 1. Open Google Sheet → Extensions → Apps Script
 * 2. SELECT ALL existing code and DELETE it
 * 3. Paste this entire file
 * 4. Click Save (Ctrl+S)
 * 5. Deploy → Manage Deployments → Edit (pencil) → New Version → Deploy
 * 6. Copy the Web App URL — use it for ALL three env vars in Vercel:
 *      GOOGLE_SHEETS_WEBHOOK_URL     = <url>
 *      ADMIN_SHEETS_WEBHOOK_URL      = <url>
 *    (GOOGLE_SHEETS_BLUEPRINT_WEBHOOK_URL no longer needed — same URL handles it)
 *
 * TABS CREATED AUTOMATICALLY (on first row received):
 *   All Leads           — every lead form submission
 *   Popup Inquiries     — openLeadPopup() calls (plan interest, service pages)
 *   Agent Recruitment   — /become-advisor form
 *   Premium Calculator  — calc runs + WhatsApp shares
 *   Wealth Blueprint    — full blueprint calculation data
 *   Chat Logs           — every AI chat message pair
 *   Chat Lead Capture   — when chat captures a lead
 *   Admin Notifications — plan alerts, API errors, scrape failures
 */

// ─── Tab definitions: name → column headers ───────────────────────────────
const TAB_HEADERS = {
  'All Leads': [
    'Timestamp (IST)', 'Name', 'Mobile', 'Email',
    'City', 'Profession', 'Want To', 'I Am',
    'Intent', 'Experience', 'Message'
  ],
  'Popup Inquiries': [
    'Timestamp (IST)', 'Name', 'Mobile', 'Email',
    'City', 'Profession', 'Want To', 'I Am',
    'Intent', 'Experience', 'Message'
  ],
  'Agent Recruitment': [
    'Timestamp (IST)', 'Name', 'Mobile', 'Email',
    'City', 'Profession', 'Want To', 'I Am',
    'Intent', 'Experience', 'Message'
  ],
  'Premium Calculator': [
    'Timestamp (IST)', 'Event', 'Plan No.', 'Plan Name', 'Category',
    'Age', 'Sum Assured', 'Term', 'PPT', 'Mode',
    'Gender', 'Annual Premium', 'Total Paid', 'Maturity Value',
    'Client Name', 'Unlock Mobile', 'Session'
  ],
  'Wealth Blueprint': [
    'Timestamp (IST)', 'Name', 'Mobile',
    'Age', 'Monthly Income', 'Employment', 'City Tier',
    'Married', 'Children', 'Aged Parents',
    'Life Cover (L)', 'Health Cover (L)', 'Home Loan (L)', 'Other Loans (L)',
    'Equity (L)', 'Debt Savings (L)', 'Real Estate (L)',
    'Retirement Age', 'Goals',
    'HLV (L)', 'Protection Gap (L)', 'Gap %',
    'Ret Corpus (Cr)', 'Total Projected (Cr)', 'Surplus/Deficit (Cr)',
    'Edu Corpus (L)', 'Net Worth (L)', 'Blueprint Score',
    'Monthly Recommended'
  ],
  'Chat Logs': [
    'Timestamp (IST)', 'Session ID', 'User Message', 'Bot Reply'
  ],
  'Chat Lead Capture': [
    'Timestamp (IST)', 'Session ID', 'Name', 'Mobile', 'Intent'
  ],
  'Admin Notifications': [
    'Timestamp (IST)', 'Type', 'Severity', 'Route / Page',
    'Message', 'Detail', 'Plan No.', 'Plan Name', 'Resolved?'
  ],
}

// Tab header row background colours
const TAB_COLORS = {
  'All Leads':           '#1a2744',
  'Popup Inquiries':     '#1a4430',
  'Agent Recruitment':   '#2d1a44',
  'Premium Calculator':  '#1a3044',
  'Wealth Blueprint':    '#44331a',
  'Chat Logs':           '#1a3a44',
  'Chat Lead Capture':   '#0f3d1e',
  'Admin Notifications': '#44251a',
}

// Admin notification severity row colours
const SEVERITY_COLOR = {
  ERROR: '#fce8e6',
  WARN:  '#fef9e7',
  INFO:  '#e8f5e9',
}

// ─── Routing: maps intent strings / sheetName to the right tab ────────────
function resolveSheetName(payload) {
  // Explicit sheetName always wins
  if (payload.sheetName && TAB_HEADERS[payload.sheetName]) return payload.sheetName

  // Admin notifications (from adminNotify utility)
  if (payload.type && ['PLAN_ALERT','API_ERROR','SCRAPE_FAIL','CRON_WARN','LEAD_FAIL','SYSTEM'].includes(payload.type)) {
    return 'Admin Notifications'
  }

  // Route by intent string
  const intent = (payload.intent || '').toLowerCase()
  if (intent.includes('agent') || intent.includes('advisor'))    return 'Agent Recruitment'
  if (intent.includes('popup') || intent.includes('consultation') || intent.includes('interest in')) return 'Popup Inquiries'
  if (intent.includes('calc') || intent.includes('premium'))      return 'Premium Calculator'
  if (intent.includes('blueprint'))                               return 'Wealth Blueprint'
  if (intent.includes('chat lead'))                               return 'Chat Lead Capture'
  if (intent.includes('chat log'))                                return 'Chat Logs'

  return 'All Leads'
}

// ─── Get or create a sheet tab ────────────────────────────────────────────
function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name)
  if (sheet) return sheet

  sheet = ss.insertSheet(name)
  const headers = TAB_HEADERS[name]
  if (headers) {
    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    headerRange.setValues([headers])
    headerRange.setFontWeight('bold')
    headerRange.setFontColor('#ffffff')
    headerRange.setBackground(TAB_COLORS[name] || '#1a2744')
    sheet.setFrozenRows(1)

    // Set sensible column widths
    headers.forEach((_, i) => {
      const w = i === 0 ? 160 : i <= 2 ? 130 : i >= headers.length - 3 ? 200 : 150
      sheet.setColumnWidth(i + 1, w)
    })
  }
  return sheet
}

// ─── Convert UTC ISO string to IST formatted string ───────────────────────
function toIST(isoString) {
  const utc = new Date(isoString || new Date())
  return Utilities.formatDate(utc, 'Asia/Kolkata', 'dd-MMM-yyyy HH:mm:ss')
}

// ─── Main entry point ─────────────────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const tabName = resolveSheetName(payload)
    const sheet = getOrCreateSheet(ss, tabName)

    let row
    const now = toIST(payload.timestamp || new Date().toISOString())

    if (tabName === 'Admin Notifications') {
      row = [
        now,
        payload.type     || '',
        payload.severity || '',
        payload.route    || '',
        payload.message  || '',
        payload.detail   || '',
        payload.planNo   || '',
        payload.planName || '',
        '',  // Resolved? — fill manually
      ]
      sheet.appendRow(row)
      // Colour-code by severity
      const lastRow = sheet.getLastRow()
      const color = SEVERITY_COLOR[(payload.severity || '').toUpperCase()] || '#ffffff'
      sheet.getRange(lastRow, 1, 1, row.length).setBackground(color)
      sheet.getRange(lastRow, 5).setFontWeight('bold')

    } else if (payload.row) {
      // Pre-built row from server — replace first cell (timestamp) with IST
      row = payload.row.slice()
      if (row[0] && String(row[0]).includes('T')) row[0] = now
      sheet.appendRow(row)

    } else {
      // Fallback — dump whatever came in
      row = [now, JSON.stringify(payload).slice(0, 1000)]
      sheet.appendRow(row)
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, tab: tabName }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// ─── GET — read chat history for a session (used by /api/chat/history) ────
function doGet(e) {
  try {
    const sid   = e.parameter.sid
    const limit = parseInt(e.parameter.limit || '20')
    if (!sid) return ContentService.createTextOutput(JSON.stringify({ messages: [] })).setMimeType(ContentService.MimeType.JSON)

    const ss    = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName('Chat Logs')
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ messages: [] })).setMimeType(ContentService.MimeType.JSON)

    const data = sheet.getDataRange().getValues()
    const messages = []
    for (let i = data.length - 1; i >= 1 && messages.length < limit; i--) {
      const [ts, sessionId, userMsg, botReply] = data[i]
      if (String(sessionId) === String(sid)) {
        messages.unshift({ ts, userMsg, botReply })
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ messages }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ messages: [], error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
