const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE_URL = 'https://licindia.in';

// LIC India current portal URLs (Liferay CMS structure)
const PLAN_PAGES = [
  { url: `${BASE_URL}/web/guest/insurance-plans`,   category: null },   // multi-category page
  { url: `${BASE_URL}/web/guest/pension-plans`,     category: 'pension' },
  { url: `${BASE_URL}/web/guest/unit-linked-plans`, category: 'ulip' },
  { url: `${BASE_URL}/web/guest/micro-insurance-plans`, category: 'micro' },
  // Fallback: old URL format
  { url: `${BASE_URL}/insurance-plan`,   category: null },
  { url: `${BASE_URL}/pension-plan`,     category: 'pension' },
  { url: `${BASE_URL}/unit-linked-plans`, category: 'ulip' },
];

const CATEGORY_KEYWORDS = {
  endowment:  ['endowment', 'bima jyoti', 'dhan sanchay', 'dhan vriddhi', 'jeevan labh', 'jeevan anand'],
  wholeLife:  ['whole life', 'jeevan umang', 'jeevan utsav'],
  moneyBack:  ['money back', 'bima ratna', 'jeevan azad', 'jeevan lakshya'],
  term:       ['tech-term', 'jeevan amar', 'saral jeevan bima', 'term assurance'],
  child:      ['children', 'child', 'jeevan tarun', 'amritbaal'],
  pension:    ['pension', 'annuity', 'jeevan akshay', 'jeevan shanti', 'saral pension'],
  ulip:       ['unit linked', 'ulip', 'siip', 'endowment plus'],
  micro:      ['micro', 'bhagya lakshmi', 'jeevan mangal'],
};

async function scrapeLicPlans() {
  const allPlans = [];
  const seen = new Set();

  for (const page of PLAN_PAGES) {
    try {
      const html = await fetchPage(page.url);
      if (!html) continue;

      const $ = cheerio.load(html);
      const tablesFound = [];

      // Strategy 1: find tables inside accordion/panel groups (old LIC layout)
      $('table').each((_, table) => {
        tablesFound.push({ el: table, hint: null });
      });

      // Strategy 2: look for plan links directly (new LIC layout has links without tables)
      if (tablesFound.length === 0) {
        $('a[href*="lic-s-"], a[href*="plan"]').each((_, link) => {
          const name = $(link).text().trim();
          const href = $(link).attr('href') || '';
          if (name.toLowerCase().includes('lic') && name.length > 5) {
            const planNo = extractPlanNoFromUrl(href);
            const cat = page.category || guessCategoryFromName(name);
            const id = planNo ? `lic-${planNo}` : `lic-${slugify(name)}`;
            if (!seen.has(id)) {
              seen.add(id);
              allPlans.push({
                id, slug: slugify(name), name, planNo: planNo || '',
                uin: '', category: cat || 'endowment',
                officialUrl: href.startsWith('http') ? href : BASE_URL + href,
                status: 'active'
              });
            }
          }
        });
      }

      // Parse each found table
      for (const { el } of tablesFound) {
        const rows = $(el).find('tr').toArray();
        if (rows.length < 2) continue;

        // Detect column order from header row
        const colOrder = detectColumnOrder($, rows[0]);

        for (let j = 1; j < rows.length; j++) {
          const cols = $(rows[j]).find('td');
          if (cols.length < 2) continue;

          const { name, planNo, uin, url } = extractPlanData($, cols, colOrder);
          if (!name || name.length < 3) continue;
          if (!planNo && !name.toLowerCase().includes('lic')) continue;

          const cat = page.category || guessCategoryFromName(name);
          const id = planNo ? `lic-${planNo}` : `lic-${slugify(name)}`;

          if (seen.has(id)) continue;
          seen.add(id);

          allPlans.push({
            id, slug: slugify(name), name, planNo, uin,
            category: cat || 'endowment',
            officialUrl: url ? (url.startsWith('http') ? url : BASE_URL + url) : null,
            status: 'active'
          });
        }
      }
    } catch (err) {
      console.warn(`[scraper] Failed on ${page.url}:`, err.message);
    }
  }

  console.log(`[scraper] Found ${allPlans.length} plans across all pages`);
  return allPlans;
}

/**
 * Detect column order from a header row.
 * Returns { nameCol, planNoCol, uinCol } indices.
 */
function detectColumnOrder($, headerRow) {
  const headers = $(headerRow).find('th, td').toArray().map((el, i) => ({
    i, text: $(el).text().trim().toLowerCase()
  }));

  let nameCol = 0, planNoCol = 1, uinCol = 2;

  for (const h of headers) {
    if (h.text.includes('plan no') || h.text.includes('plan number') || h.text === 'no.') {
      planNoCol = h.i;
    } else if (h.text.includes('uin') || h.text.includes('unique')) {
      uinCol = h.i;
    } else if (h.text.includes('name') || h.text.includes('plan')) {
      nameCol = h.i;
    }
  }

  // Sanity: if planNoCol === nameCol, swap
  if (planNoCol === nameCol) planNoCol = nameCol === 0 ? 1 : 0;

  return { nameCol, planNoCol, uinCol };
}

/**
 * Extract plan data from a row, validating that planNo is numeric.
 */
function extractPlanData($, cols, { nameCol, planNoCol, uinCol }) {
  const getCell = (idx) => $(cols[idx] || cols[0]);

  const nameCell = getCell(nameCol);
  let name = nameCell.find('a').text().trim() || nameCell.text().trim();
  let url  = nameCell.find('a').attr('href') || null;

  let planNo = getCell(planNoCol).text().trim().replace(/\D/g, ''); // digits only
  let uin    = cols[uinCol] ? getCell(uinCol).text().trim() : '';

  // If planNo looks like a serial number (1, 2, 3...) try adjacent cell
  if (planNo.length <= 2) {
    // Try all remaining cols for a 3-digit number
    for (let i = 0; i < cols.length; i++) {
      const candidate = $(cols[i]).text().trim().replace(/\D/g, '');
      if (candidate.length >= 3 && candidate.length <= 4) {
        planNo = candidate;
        break;
      }
    }
  }

  // If name looks like a number, swap name & planNo
  if (/^\d+$/.test(name.trim()) && planNo.length >= 3) {
    const tmp = name;
    name = getCell(planNoCol).find('a').text().trim() || getCell(planNoCol).text().trim();
    if (/^\d+$/.test(name)) name = tmp; // still a number — give up, skip row
  }

  return { name, planNo, uin, url };
}

function extractPlanNoFromUrl(href) {
  const match = href.match(/-(\d{3,4})[-/]/);
  return match ? match[1] : null;
}

function guessCategoryFromName(name) {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return null;
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000
    });
    if (!res.ok) {
      console.warn(`[scraper] HTTP ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`[scraper] Network error for ${url}:`, err.message);
    return null;
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
}

if (require.main === module) {
  scrapeLicPlans().then(plans => {
    console.log(JSON.stringify(plans, null, 2));
  });
}

module.exports = { scrapeLicPlans };
