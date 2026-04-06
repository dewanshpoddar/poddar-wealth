const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../lib/data/lic-plans.json');
const LOG_PATH = path.join(__dirname, '../lib/data/sync-log.json');

async function runDiff(newPlans) {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Data file not found at:', DATA_PATH);
    return;
  }

  const currentData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const diff = {
    added: [],
    removed: [],
    changed: [],
    unchanged: 0
  };

  const updatedCategories = JSON.parse(JSON.stringify(currentData.categories));
  const seenIds = new Set();

  newPlans.forEach(newPlan => {
    seenIds.add(newPlan.id);
    let found = false;

    // Check all current categories for this plan
    for (const [catKey, catData] of Object.entries(updatedCategories)) {
      const existingPlanIndex = catData.plans.findIndex(p => p.id === newPlan.id || p.planNo === newPlan.planNo);
      
      if (existingPlanIndex !== -1) {
        found = true;
        const existingPlan = catData.plans[existingPlanIndex];
        
        // Check for changes (name, uin, url)
        const hasChanged = 
          existingPlan.name.en !== newPlan.name || 
          existingPlan.uin !== newPlan.uin ||
          existingPlan.officialUrl !== newPlan.officialUrl;

        if (hasChanged) {
          diff.changed.push({ id: existingPlan.id, name: existingPlan.name.en });
          // Update core fields but preserve others
          existingPlan.name.en = newPlan.name;
          existingPlan.uin = newPlan.uin;
          existingPlan.officialUrl = newPlan.officialUrl;
          existingPlan.status = 'active'; // Reset if it was previously withdrawn
        } else {
          diff.unchanged++;
          existingPlan.status = 'active'; // Ensure active
        }
        break;
      }
    }

    // If not found, it's a NEW plan
    if (!found) {
      diff.added.push({ id: newPlan.id, name: newPlan.name });
      const targetCat = updatedCategories[newPlan.category];
      if (targetCat) {
        targetCat.plans.push({
          ...newPlan,
          name: { en: newPlan.name, hi: "" }, // Hindi needs manual fill
          tagline: { en: "", hi: "" },
          keyBenefit: { en: "", hi: "" },
          highlights: [],
          status: 'new'
        });
      }
    }
  });

  // Check for REMOVED plans
  for (const [catKey, catData] of Object.entries(updatedCategories)) {
    catData.plans.forEach(plan => {
      if (!seenIds.has(plan.id) && plan.status !== 'withdrawn') {
        diff.removed.push({ id: plan.id, name: plan.name.en });
        plan.status = 'withdrawn';
      }
    });
  }

  // Update Meta
  currentData.categories = updatedCategories;
  currentData.meta.lastUpdated = new Date().toISOString().split('T')[0];
  currentData.meta.totalPlans = Object.values(updatedCategories).reduce((sum, cat) => sum + cat.plans.length, 0);

  // Write files
  fs.writeFileSync(DATA_PATH, JSON.stringify(currentData, null, 2));
  
  // Log entry
  const logs = fs.existsSync(LOG_PATH) ? JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) : [];
  logs.unshift({
    timestamp: new Date().toISOString(),
    summary: {
      added: diff.added.length,
      removed: diff.removed.length,
      changed: diff.changed.length,
      unchanged: diff.unchanged
    },
    details: diff
  });
  
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs.slice(0, 50), null, 2)); // Keep last 50 runs

  console.log('Sync Complete:', currentData.meta.lastUpdated);
  console.log(`Added: ${diff.added.length}, Removed: ${diff.removed.length}, Changed: ${diff.changed.length}`);
  
  return diff;
}

// If pipe to from scraper
if (require.main === module) {
  let data = '';
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.on('end', () => {
    try {
      const newPlans = JSON.parse(data);
      runDiff(newPlans);
    } catch (e) {
      console.error('Failed to parse scraper output:', e.message);
    }
  });
}

module.exports = { runDiff };
