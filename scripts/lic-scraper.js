const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE_URL = 'https://licindia.in';
const PLAN_URLS = {
  main: `${BASE_URL}/insurance-plan`,
  pension: `${BASE_URL}/pension-plan`,
  ulip: `${BASE_URL}/unit-linked-plans`,
  micro: `${BASE_URL}/micro-insurance-plans`
};

const CATEGORY_MAP = {
  'Endowment Plans': 'endowment',
  'Whole Life Plans': 'wholeLife',
  'Money Back Plans': 'moneyBack',
  'Term Assurance Plans': 'term',
  'Riders': 'riders',
  'Pension Plans': 'pension',
  'Unit Linked Plans': 'ulip',
  'Micro Insurance Plans': 'micro'
};

async function scrapeLicPlans() {
  const allPlans = [];

  try {
    // 1. Main Insurance Plans Page
    const mainHtml = await fetchPage(PLAN_URLS.main);
    if (mainHtml) {
      const $ = cheerio.load(mainHtml);
      // LIC tables are often inside panel-groups or direct tables
      $('table').each((i, table) => {
        // Find the category header (it's often in a <th> or a preceding <h3>/<span>)
        let categoryText = $(table).closest('.panel-default').find('.panel-title, h4, h3').text().trim();
        if (!categoryText) {
          categoryText = $(table).find('th').first().text().trim();
        }

        const categoryKey = CATEGORY_MAP[categoryText] || mapCategoryByHeader(categoryText);
        if (categoryKey) {
          parseTable($, table, categoryKey, allPlans);
        }
      });
    }

    // 2. Additional Category Pages
    for (const [key, url] of Object.entries(PLAN_URLS)) {
      if (key === 'main') continue;
      const html = await fetchPage(url);
      if (html) {
        const $ = cheerio.load(html);
        $('table').each((i, table) => {
          parseTable($, table, key, allPlans);
        });
      }
    }

    return allPlans;

  } catch (error) {
    console.error('Scraping failed:', error);
    return [];
  }
}

function parseTable($, table, category, allPlans) {
  $(table).find('tr').each((j, row) => {
    const cols = $(row).find('td');
    if (cols.length >= 2) {
      const nameCell = $(cols[0]);
      const name = nameCell.find('a').text().trim() || nameCell.text().trim();
      const url = nameCell.find('a').attr('href');
      const planNo = $(cols[1]).text().trim();
      const uin = $(cols[2]).text().trim();

      if (name && planNo) {
        allPlans.push({
          id: `lic-${planNo}`,
          slug: slugify(name),
          name: name,
          planNo: planNo,
          uin: uin,
          category: category,
          officialUrl: url ? (url.startsWith('http') ? url : BASE_URL + url) : null,
          status: 'active'
        });
      }
    }
  });
}

function mapCategoryByHeader(text) {
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (text.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return null;
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    return await response.text();
  } catch (err) {
    console.warn(`Failed to fetch ${url}:`, err.message);
    return null;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Run if called directly
if (require.main === module) {
  scrapeLicPlans().then(plans => {
    console.log(JSON.stringify(plans, null, 2));
  });
}

module.exports = { scrapeLicPlans };
