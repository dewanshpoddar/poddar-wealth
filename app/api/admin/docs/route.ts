import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function readFileSafe(p: string): string {
  try { return fs.readFileSync(path.join(process.cwd(), p), 'utf-8'); }
  catch { return '(file not found)'; }
}

export async function GET() {
  return NextResponse.json({
    claudeMd: readFileSafe('CLAUDE.md'),
    envExample: readFileSafe('.env.example'),
    packageJson: readFileSafe('package.json'),
    vercelJson: readFileSafe('vercel.json'),
  }, { headers: { 'Cache-Control': 'private, max-age=60' } });
}
