/**
 * Poddar Wealth Management — Google Apps Script
 * Deploy as: Web App → Execute as: Me → Who has access: Anyone
 *
 * POST — write a row (leads, chat logs)
 * GET  — read chat history by session ID
 */

// ── Tab routing ────────────────────────────────────────────────────────────
var INTENT_TAB = {
  'All Leads':           'All Leads',
  'Agent Recruitment':   'Agent Recruitment',
  'LIC Plans':           'LIC Plans',
  'Popup Inquiry':       'Popup Inquiries',
  'Chat Lead Capture':   'Chat Lead Capture',
  'Chat Log':            'Chat Logs',
  'Chat Log (fallback)': 'Chat Logs',
};

var TAB_HEADERS = {
  'All Leads':          ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'Agent Recruitment':  ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'LIC Plans':          ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'Popup Inquiries':    ['Timestamp','Name','Mobile','Email','City','Profession','Want To','I Am','Intent','Experience','Message'],
  'Chat Lead Capture':  ['Timestamp','Session ID','Name','Mobile','Intent'],
  'Chat Logs':          ['Timestamp','Session ID','User Message','Bot Reply','Intent'],
};

function getOrCreateTab(ss, name) {
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

function ok(tabName) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', tab: tabName }))
    .setMimeType(ContentService.MimeType.JSON);
}

function err(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST handler ───────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var ss      = SpreadsheetApp.getActiveSpreadsheet();
    var data    = JSON.parse(e.postData.contents);
    var intent  = data.intent || 'All Leads';
    var tabName = INTENT_TAB[intent] || 'All Leads';
    var sheet   = getOrCreateTab(ss, tabName);
    var now     = new Date().toISOString();
    var row     = data.row || [];

    if (tabName === 'Chat Logs') {
      sheet.appendRow([
        row[0] || now,
        row[1] || '',
        row[2] || '',
        row[3] || '',
        intent,
      ]);
    } else if (tabName === 'Chat Lead Capture') {
      sheet.appendRow([
        row[0] || now,
        row[1] || '',
        row[2] || data.name    || '',
        row[3] || data.mobile  || '',
        intent,
      ]);
    } else {
      sheet.appendRow([
        row[0]  || now,
        row[1]  || data.name       || '',
        row[2]  || data.mobile     || '',
        row[3]  || data.email      || '',
        row[4]  || data.city       || '',
        row[5]  || data.profession || '',
        row[6]  || data.wantTo     || '',
        row[7]  || data.iAm        || '',
        intent,
        row[9]  || data.experience || '',
        row[10] || data.message    || '',
      ]);
    }

    return ok(tabName);
  } catch (e) {
    return err(e.toString());
  }
}

// ── GET handler — fetch chat history by session ID ─────────────────────────
function doGet(e) {
  try {
    var sid   = (e.parameter && e.parameter.sid)   ? e.parameter.sid   : '';
    var limit = (e.parameter && e.parameter.limit) ? parseInt(e.parameter.limit, 10) : 20;

    if (!sid) return err('sid required');

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Chat Logs');
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', messages: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getDataRange().getValues();
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]) === sid) {
        rows.push({ userMsg: data[i][2], botReply: data[i][3] });
      }
    }

    var recent   = rows.slice(-limit);
    var messages = [];
    for (var j = 0; j < recent.length; j++) {
      if (recent[j].userMsg)  messages.push({ from: 'user', text: String(recent[j].userMsg) });
      if (recent[j].botReply) messages.push({ from: 'bot',  text: String(recent[j].botReply) });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', messages: messages }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return err(e.toString());
  }
}

// ── Local test helper (run from editor to verify) ──────────────────────────
function testWebhook() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        intent: 'Chat Log',
        row: [new Date().toISOString(), 'test_sid_123', 'Test question?', 'Test answer.', '', '', '', '', '', 'Chat Log', '', '']
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
