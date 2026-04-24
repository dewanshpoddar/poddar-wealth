const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../lib/data/lic-plans.json');
const LOG_PATH  = path.join(__dirname, '../lib/data/sync-log.json');

async function runDiff(newPlans) {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('[diff] Data file not found:', DATA_PATH);
    return null;
  }

  if (!newPlans || newPlans.length === 0) {
    console.warn('[diff] Scraper returned 0 plans — skipping update to avoid wiping data.');
    return null;
  }

  const currentData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const diff = { added: [], removed: [], changed: [], unchanged: 0 };

  // Deep clone categories so we can mutate safely
  const updatedCategories = JSON.parse(JSON.stringify(currentData.categories));

  // Index all existing plans by id and planNo for fast lookup
  const existingById   = {};   // id -> { catKey, planIndex }
  const existingByNo   = {};   // planNo -> { catKey, planIndex }

  for (const [catKey, catData] of Object.entries(updatedCategories)) {
    catData.plans.forEach((plan, idx) => {
      existingById[plan.id]     = { catKey, idx };
      if (plan.planNo) existingByNo[plan.planNo] = { catKey, idx };
    });
  }

  // Track which existing plans we see in this scrape
  const seenIds = new Set();

  for (const scraped of newPlans) {
    // Skip plans without a real name
    if (!scraped.name || scraped.name.length < 3) continue;
    // Skip plans where the "name" is a number (parsing error)
    if (/^\d+$/.test(scraped.name.trim())) continue;

    seenIds.add(scraped.id);

    const match = existingById[scraped.id] || existingByNo[scraped.planNo];

    if (match) {
      // Plan exists — check for changes
      const plan = updatedCategories[match.catKey].plans[match.idx];
      const hasChanged =
        plan.name.en !== scraped.name ||
        (scraped.uin && plan.uin !== scraped.uin) ||
        (scraped.officialUrl && plan.officialUrl !== scraped.officialUrl);

      if (hasChanged) {
        diff.changed.push({ id: plan.id, name: plan.name.en });
        // Update only fields the scraper can verify — preserve rich data we manually curated
        plan.name.en = scraped.name;
        if (scraped.uin) plan.uin = scraped.uin;
        if (scraped.officialUrl) plan.officialUrl = scraped.officialUrl;
      } else {
        diff.unchanged++;
      }

      // Only restore 'active' if it was previously marked 'withdrawn' by automation
      // (never override 'active' plans that are manually curated)
      if (plan.status === 'withdrawn' && scraped.status === 'active') {
        plan.status = 'active';
      }

    } else {
      // Brand new plan not in our data — add it
      diff.added.push({ id: scraped.id, name: scraped.name });

      const targetCat = scraped.category || 'endowment';

      // Create the category if it doesn't exist yet
      if (!updatedCategories[targetCat]) {
        updatedCategories[targetCat] = {
          label: { en: titleCase(targetCat), hi: '' },
          tagline: { en: '', hi: '' },
          icon: '📋',
          color: '#333333',
          plans: []
        };
      }

      updatedCategories[targetCat].plans.push({
        id: scraped.id,
        name: { en: scraped.name, hi: '' },
        planNo: scraped.planNo || '',
        tagline: { en: '', hi: '' },
        keyBenefit: { en: '', hi: '' },
        category: targetCat,
        entryAge: '',
        sumAssured: '',
        premiumPayment: '',
        highlights: [],
        officialUrl: scraped.officialUrl || null,
        uin: scraped.uin || '',
        status: 'new'
      });
    }
  }

  // Mark plans not seen in this scrape as 'withdrawn'
  // BUT only if the scraper actually returned a meaningful result (>5 plans)
  // to prevent false withdrawals when the scraper partially fails
  if (newPlans.length > 5) {
    for (const [catKey, catData] of Object.entries(updatedCategories)) {
      catData.plans.forEach(plan => {
        if (!seenIds.has(plan.id) && plan.status === 'active') {
          diff.removed.push({ id: plan.id, name: plan.name.en });
          plan.status = 'withdrawn';
        }
      });
    }
  } else {
    console.warn(`[diff] Only ${newPlans.length} plans scraped — skipping withdrawn-status update.`);
  }

  // Update meta
  currentData.categories = updatedCategories;
  currentData.meta.lastUpdated = new Date().toISOString().split('T')[0];
  currentData.meta.totalPlans = Object.values(updatedCategories)
    .reduce((sum, cat) => sum + cat.plans.length, 0);
  currentData.meta.categories = Object.keys(updatedCategories);

  fs.writeFileSync(DATA_PATH, JSON.stringify(currentData, null, 2));

  // Write log entry (keep last 50 runs)
  const logs = fs.existsSync(LOG_PATH)
    ? JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'))
    : [];

  logs.unshift({
    timestamp: new Date().toISOString(),
    plansScraped: newPlans.length,
    summary: {
      added: diff.added.length,
      removed: diff.removed.length,
      changed: diff.changed.length,
      unchanged: diff.unchanged
    },
    details: diff
  });

  fs.writeFileSync(LOG_PATH, JSON.stringify(logs.slice(0, 50), null, 2));

  console.log(`[diff] Sync complete: ${currentData.meta.lastUpdated}`);
  console.log(`[diff] Added: ${diff.added.length} | Removed: ${diff.removed.length} | Changed: ${diff.changed.length} | Unchanged: ${diff.unchanged}`);

  return diff;
}

function titleCase(str) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
}

// CLI: pipe from scraper  →  node scripts/lic-scraper.js | node scripts/lic-diff.js
if (require.main === module) {
  let data = '';
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.on('end', () => {
    try {
      const newPlans = JSON.parse(data);
      runDiff(newPlans);
    } catch (e) {
      console.error('[diff] Failed to parse scraper output:', e.message);
      process.exit(1);
    }
  });
}

module.exports = { runDiff };
