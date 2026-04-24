/**
 * Google Apps Script — Admin Notifications Tab
 * ─────────────────────────────────────────────
 * SETUP (one-time, 5 minutes):
 *
 * 1. Open your Google Sheet (the one you already use for leads)
 * 2. Click Extensions → Apps Script
 * 3. You'll see an existing doPost(e) function for leads — KEEP IT
 * 4. Paste this entire file below the existing code (don't replace it)
 * 5. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the new Web App URL
 * 7. In Vercel dashboard → Environment Variables → add:
 *    ADMIN_SHEETS_WEBHOOK_URL = <paste the URL here>
 * 8. Done. Alerts will appear in the "Admin Notifications" tab automatically.
 *
 * The sheet tab is created on first use — nothing to set up manually.
 */

// ─── Column headers for the Admin Notifications tab ───────────────────────
const ADMIN_HEADERS = [
  'Timestamp (IST)',
  'Type',
  'Severity',
  'Route / Page',
  'Message',
  'Detail',
  'Plan No.',
  'Plan Name',
  'Resolved?',   // manually tick this once you've acted on the alert
]

// ─── Severity → row background colour ─────────────────────────────────────
const SEVERITY_COLOR = {
  ERROR: '#fce8e6',   // light red
  WARN:  '#fef9e7',   // light yellow
  INFO:  '#e8f5e9',   // light green
}

// ─── Main entry point (called by the website) ─────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents)

    // Route to the right handler based on payload shape
    if (payload.type) {
      // Has a 'type' field → Admin Notification
      return handleAdminNotification(payload)
    } else {
      // Existing leads / blueprint handler — call the original function
      // (keep whatever was already here — this just falls through)
      return handleLead(payload)
    }
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// ─── Write admin notification to the "Admin Notifications" tab ────────────
function handleAdminNotification(payload) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet()
  let sheet  = ss.getSheetByName('Admin Notifications')

  // Create the tab if it doesn't exist yet
  if (!sheet) {
    sheet = ss.insertSheet('Admin Notifications')
    const header = sheet.getRange(1, 1, 1, ADMIN_HEADERS.length)
    header.setValues([ADMIN_HEADERS])
    header.setFontWeight('bold')
    header.setBackground('#1a2744')   // navy, matching brand
    header.setFontColor('#ffffff')
    sheet.setFrozenRows(1)
    sheet.setColumnWidth(1, 160)  // Timestamp
    sheet.setColumnWidth(2, 110)  // Type
    sheet.setColumnWidth(3, 80)   // Severity
    sheet.setColumnWidth(4, 220)  // Route
    sheet.setColumnWidth(5, 340)  // Message
    sheet.setColumnWidth(6, 380)  // Detail
    sheet.setColumnWidth(7, 80)   // Plan No.
    sheet.setColumnWidth(8, 160)  // Plan Name
    sheet.setColumnWidth(9, 90)   // Resolved?
  }

  // Convert UTC timestamp to IST — Utilities.formatDate handles the offset
  const utc = new Date(payload.timestamp || new Date())
  const istStr = Utilities.formatDate(utc, 'Asia/Kolkata', 'dd-MMM-yyyy HH:mm:ss')

  const row = [
    istStr,
    payload.type     || '',
    payload.severity || '',
    payload.route    || '',
    payload.message  || '',
    payload.detail   || '',
    payload.planNo   || '',
    payload.planName || '',
    '',   // Resolved? — filled manually
  ]

  const lastRow  = sheet.getLastRow()
  const newRow   = lastRow + 1
  sheet.appendRow(row)

  // Colour-code the row by severity
  const severity = (payload.severity || '').toUpperCase()
  const color    = SEVERITY_COLOR[severity] || '#ffffff'
  sheet.getRange(newRow, 1, 1, ADMIN_HEADERS.length).setBackground(color)

  // Bold the message cell for easy scanning
  sheet.getRange(newRow, 5).setFontWeight('bold')

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

// ─── Placeholder — replace with your existing lead handler if needed ───────
// If you already have a doPost that handles leads, remove this stub and keep
// your original function. This is only here so the script runs standalone.
function handleLead(_payload) {
  // Your existing lead-writing code goes here (or is already above this file)
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, note: 'lead handler not wired' }))
    .setMimeType(ContentService.MimeType.JSON)
}
