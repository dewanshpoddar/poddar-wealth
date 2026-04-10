/**
 * Poddar Wealth Management — Google Apps Script
 * Deploy as: Web App → Execute as: Me → Who has access: Anyone
 *
 * Supports:
 *   POST — write a row (leads, chat logs)
 *   GET  — read chat history by session ID
 *
 * Sheet tabs used:
 *   "All Leads"          — general lead form
 *   "Agent Recruitment"  — agent form
 *   "LIC Plans"          — LIC plans inquiry
 *   "Popup Inquiries"    — popup lead form
 *   "Chat Lead Capture"  — lead captured inside chat
 *   "Chat Logs"          — every Q&A conversation
 */

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── Tab name mapping by intent ─────────────────────────────────────────────
const INTENT_TAB = {
  'All Leads':          'All Leads',
  'Agent Recruitment':  'Agent Recruitment',
  'LIC Plans':          'LIC Plans',
  'Popup Inquiry':      'Popup Inquiries',
  'Chat Lead Capture':  'Chat Lead Capture',
  'Chat Log':           'Chat Logs',
  'Chat Log (fallback)':'Chat Logs',
};

// ── Headers per tab ────────────────────────────────────────────────────────
const TAB_HEADERS = {
  'All Leads':          ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'Agent Recruitment':  ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'LIC Plans':          ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'Popup Inquiries':    ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'Chat Lead Capture':  ['Timestamp','Session ID','Name','Mobile','Intent'],
  'Chat Logs':          ['Timestamp','Session ID','User Message','Bot Reply','Intent'],
};

function getOrCreateTab(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = TAB_HEADERS[name];
    if (headers) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
           .setFontWeight('bold')
           .setBackground('#1a2744')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

// ── POST handler — write a row ─────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var intent = data.intent || 'All Leads';
    var tabName = INTENT_TAB[intent] || 'All Leads';
    var sheet = getOrCreateTab(tabName);

    var row;
    if (tabName === 'Chat Logs') {
      // Chat log row: [timestamp, sessionId, userMsg, botReply, intent]
      row = [
        data.row[0] || new Date().toISOString(),
        data.row[1] || '',
        data.row[2] || '',
        data.row[3] || '',
        intent,
      ];
    } else if (tabName === 'Chat Lead Capture') {
      // Lead captured inside chat: [timestamp, sessionId, name, mobile, intent]
      row = [
        data.row[0] || new Date().toISOString(),
        data.row[1] || '',
        data.row[2] || data.name || '',
        data.row[3] || data.mobile || '',
        intent,
      ];
    } else {
      // Standard lead form row
      row = data.row || [
        new Date().toISOString(),
        data.name    || '',
        data.mobile  || '',
        data.email   || '',
        data.city    || '',
        data.profession || '',
        data.wantTo  || '',
        data.iAm     || '',
        intent,
        data.experience || '',
        data.message || '',
      ];
    }

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', tab: tabName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET handler — read chat history by session ID ─────────────────────────
// Called by /api/chat/history?sid=<sessionId>&limit=20
function doGet(e) {
  try {
    var params = e.parameter;
    var sessionId = params.sid || '';
    var limit = parseInt(params.limit || '20', 10);

    if (!sessionId) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'sid required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Chat Logs');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', messages: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getDataRange().getValues();
    // Headers: [Timestamp, Session ID, User Message, Bot Reply, Intent]
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]) === sessionId) {
        rows.push({
          timestamp:  data[i][0],
          userMsg:    data[i][2],
          botReply:   data[i][3],
        });
      }
    }

    // Return last `limit` exchanges
    var recent = rows.slice(-limit);

    // Convert to message array [{from, text}]
    var messages = [];
    for (var j = 0; j < recent.length; j++) {
      if (recent[j].userMsg) messages.push({ from: 'user', text: String(recent[j].userMsg) });
      if (recent[j].botReply) messages.push({ from: 'bot',  text: String(recent[j].botReply) });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', messages: messages }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
