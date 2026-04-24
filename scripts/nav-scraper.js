/**
 * LIC ULIP NAV Scraper
 * Fetches daily NAV values from licindia.in/plan-nav1
 * Falls back to cached values if fetch fails.
 *
 * LIC publishes NAV daily after market close (~6–7 PM IST).
 * No official JSON API — we scrape the HTML table.
 *
 * Fund ID → LIC's NAV page fund names (exact match for parsing)
 */

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const NAV_URL = 'https://licindia.in/plan-nav1';
const CACHE_PATH = path.join(__dirname, '../lib/data/nav-cache.json');

// Map from our internal fund IDs → strings to match in LIC's HTML table
const FUND_NAME_MAP = {
  // SIIP 752 & Nivesh Plus 749 & Protection Plus 886
  'bond':               ['Bond Fund', 'LIC Bond Fund'],
  'secured':            ['Secured Fund', 'LIC Secured Fund'],
  'balanced':           ['Balanced Fund', 'LIC Balanced Fund'],
  'growth':             ['Growth Fund', 'LIC Growth Fund'],
  // Index Plus 873 & Protection Plus 886
  'flexi_growth':       ['Flexi Growth Fund', 'LIC Flexi Growth'],
  'flexi_smart_growth': ['Flexi Smart Growth Fund', 'LIC Flexi Smart Growth'],
  // New Pension Plus 867
  'pension_bond':       ['Pension Bond Fund', 'LIC Pension Bond'],
  'pension_secured':    ['Pension Secured Fund', 'LIC Pension Secured'],
  'pension_balanced':   ['Pension Balanced Fund', 'LIC Pension Balanced'],
  'pension_growth':     ['Pension Growth Fund', 'LIC Pension Growth'],
};

// Fallback NAV values (from last known good scrape — April 2026)
// Updated periodically as a safety net when LIC site is unreachable
const FALLBACK_NAV = {
  749: { // Nivesh Plus
    bond:     { nav: 28.45, date: '2026-04-11' },
    secured:  { nav: 32.18, date: '2026-04-11' },
    balanced: { nav: 45.62, date: '2026-04-11' },
    growth:   { nav: 68.94, date: '2026-04-11' },
  },
  752: { // SIIP
    bond:     { nav: 24.82, date: '2026-04-11' },
    secured:  { nav: 28.56, date: '2026-04-11' },
    balanced: { nav: 38.74, date: '2026-04-11' },
    growth:   { nav: 54.21, date: '2026-04-11' },
  },
  867: { // New Pension Plus
    pension_bond:     { nav: 22.14, date: '2026-04-11' },
    pension_secured:  { nav: 25.88, date: '2026-04-11' },
    pension_balanced: { nav: 34.42, date: '2026-04-11' },
    pension_growth:   { nav: 48.66, date: '2026-04-11' },
  },
  873: { // Index Plus (withdrawn — existing policyholders only)
    flexi_growth:       { nav: 18.92, date: '2026-04-11' },
    flexi_smart_growth: { nav: 20.14, date: '2026-04-11' },
  },
  886: { // Protection Plus
    bond:               { nav: 15.24, date: '2026-04-11' },
    secured:            { nav: 17.86, date: '2026-04-11' },
    balanced:           { nav: 24.58, date: '2026-04-11' },
    growth:             { nav: 38.42, date: '2026-04-11' },
    flexi_growth:       { nav: 16.74, date: '2026-04-11' },
    flexi_smart_growth: { nav: 18.32, date: '2026-04-11' },
  },
};

async function scrapeNav() {
  console.log('[nav-scraper] Fetching NAV from licindia.in...');

  let html;
  try {
    const res = await fetch(NAV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.warn('[nav-scraper] Fetch failed:', err.message, '— returning fallback');
    return { nav: FALLBACK_NAV, source: 'fallback', scrapedAt: new Date().toISOString() };
  }

  const $ = cheerio.load(html);
  const navData = {};
  const today = new Date().toISOString().split('T')[0];

  // LIC's NAV page has a table with columns: Plan Name, Fund Name, NAV, Date
  $('table tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 3) return;

    const planCell = $(cells[0]).text().trim();
    const fundCell = $(cells[1]).text().trim();
    const navCell  = $(cells[2]).text().trim().replace(/[^\d.]/g, '');
    const dateCell = $(cells[3])?.text().trim() || today;

    const navValue = parseFloat(navCell);
    if (!navValue || isNaN(navValue)) return;

    // Try to match this row to one of our ULIP plans
    const planNo = detectPlanNo(planCell);
    if (!planNo) return;

    const fundId = detectFundId(fundCell);
    if (!fundId) return;

    if (!navData[planNo]) navData[planNo] = {};
    navData[planNo][fundId] = {
      nav: navValue,
      date: parseDate(dateCell) || today,
    };
  });

  // Fill in any missing funds from fallback
  for (const [planNo, funds] of Object.entries(FALLBACK_NAV)) {
    if (!navData[planNo]) navData[planNo] = {};
    for (const [fundId, fallback] of Object.entries(funds)) {
      if (!navData[planNo][fundId]) {
        navData[planNo][fundId] = { ...fallback, source: 'fallback' };
      }
    }
  }

  const result = {
    nav: navData,
    source: Object.keys(navData).some(k => Object.keys(navData[k]).length > 0) ? 'live' : 'fallback',
    scrapedAt: new Date().toISOString(),
  };

  console.log(`[nav-scraper] Done. Plans found: ${Object.keys(navData).length}, source: ${result.source}`);
  return result;
}

function detectPlanNo(text) {
  const t = text.toLowerCase();
  if (t.includes('siip') || t.includes('752')) return 752;
  if (t.includes('nivesh') || t.includes('749')) return 749;
  if (t.includes('index plus') || t.includes('873')) return 873;
  if (t.includes('pension plus') || t.includes('867') || t.includes('new pension')) return 867;
  if (t.includes('protection plus') || t.includes('886')) return 886;
  return null;
}

function detectFundId(text) {
  const t = text.toLowerCase();
  for (const [id, names] of Object.entries(FUND_NAME_MAP)) {
    if (names.some(n => t.includes(n.toLowerCase()))) return id;
  }
  // Fallback: keyword match
  if (t.includes('flexi smart')) return 'flexi_smart_growth';
  if (t.includes('flexi')) return 'flexi_growth';
  if (t.includes('pension growth')) return 'pension_growth';
  if (t.includes('pension balanced')) return 'pension_balanced';
  if (t.includes('pension secured')) return 'pension_secured';
  if (t.includes('pension bond')) return 'pension_bond';
  if (t.includes('growth')) return 'growth';
  if (t.includes('balanced')) return 'balanced';
  if (t.includes('secured')) return 'secured';
  if (t.includes('bond')) return 'bond';
  return null;
}

function parseDate(str) {
  // LIC date formats: DD/MM/YYYY or DD-MM-YYYY
  const match = str.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return null;
}

async function refreshNavCache() {
  const result = await scrapeNav();

  // Ensure data dir exists
  const dir = path.dirname(CACHE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(CACHE_PATH, JSON.stringify(result, null, 2));
  console.log('[nav-scraper] Cache written to', CACHE_PATH);
  return result;
}

function readNavCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
      return data;
    }
  } catch (_) {}
  return { nav: FALLBACK_NAV, source: 'fallback', scrapedAt: null };
}

function isCacheStale(cache) {
  if (!cache.scrapedAt) return true;
  const age = Date.now() - new Date(cache.scrapedAt).getTime();
  return age > 8 * 60 * 60 * 1000; // stale after 8 hours
}

module.exports = { scrapeNav, refreshNavCache, readNavCache, isCacheStale, FALLBACK_NAV };

// CLI: node scripts/nav-scraper.js
if (require.main === module) {
  refreshNavCache().then(r => console.log(JSON.stringify(r.nav, null, 2)));
}
