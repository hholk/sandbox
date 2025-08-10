import { NextRequest, NextResponse } from 'next/server';
import { loadCSV } from '../../../lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source') || undefined;
  try {
    const data = await loadCSV(source);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
