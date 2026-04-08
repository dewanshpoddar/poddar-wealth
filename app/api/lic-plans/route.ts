import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'lib/data/lic-plans.json');
const LOG_PATH = path.join(process.cwd(), 'lib/data/sync-log.json');

export async function GET(req: Request) {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return NextResponse.json({ success: false, error: 'Data not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    // ?view=all  → returns everything including withdrawn (for calculators / admin)
    // default    → returns only active + new plans (for customer-facing pages)
    const showAll = searchParams.get('view') === 'all';

    const raw  = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const logs = fs.existsSync(LOG_PATH) ? JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) : [];

    const data = showAll ? raw : filterActiveOnly(raw);

    return NextResponse.json(
      { success: true, data, lastSync: logs[0] || null },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59' } }
    );

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to load plans' }, { status: 500 });
  }
}

/** Strip withdrawn plans from every category, remove empty categories. */
function filterActiveOnly(raw: any) {
  const filtered = JSON.parse(JSON.stringify(raw));
  for (const [key, cat] of Object.entries(filtered.categories) as any) {
    cat.plans = cat.plans.filter((p: any) => p.status === 'active' || p.status === 'new');
  }
  // Remove categories that ended up empty
  for (const key of Object.keys(filtered.categories)) {
    if (filtered.categories[key].plans.length === 0) {
      delete filtered.categories[key];
    }
  }
  filtered.meta.totalPlans = Object.values(filtered.categories)
    .reduce((sum: number, cat: any) => sum + cat.plans.length, 0);
  return filtered;
}
