import { NextRequest, NextResponse } from 'next/server';
import { fetchBookSummary } from '@/lib/deribit';
import { filterByDate, computeMaxPain, MaxPainResult } from '@/lib/maxpain';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('dates');
  if (!search) {
    return NextResponse.json({ issues: ['missing dates'] }, { status: 400 });
  }
  const dates = search.split(',');
  let book;
  try {
    book = await fetchBookSummary();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ issues: [msg] }, { status: 502 });
  }
  const results: MaxPainResult[] = [];
  const issues: string[] = [];
  for (const d of dates) {
    const items = filterByDate(book, d);
    if (items.length === 0) {
      issues.push(`no data for ${d}`);
      results.push({
        dateISO: d,
        maxPain: NaN,
        oiCallsBTC: 0,
        oiPutsBTC: 0,
        putCallRatio: NaN,
        topStrikes: [],
        histogram: [],
        sampleSize: 0,
        computedAt: new Date().toISOString(),
      });
      continue;
    }
    results.push(computeMaxPain(items));
  }
  return NextResponse.json({ results, issues });
}
