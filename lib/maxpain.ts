import type { BookSummary } from './deribit';

const MONTHS: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

export interface ParsedInstrument {
  dateISO: string;
  strike: number;
  type: 'C' | 'P';
  oi: number; // in BTC
}

export interface MaxPainResult {
  dateISO: string;
  maxPain: number;
  oiCallsBTC: number;
  oiPutsBTC: number;
  putCallRatio: number;
  topStrikes: Array<{ strike: number; putBTC: number; callBTC: number }>;
  histogram: Array<{ strike: number; oiBTC: number }>;
  sampleSize: number;
  computedAt: string;
}

export function parseInstrumentName(name: string): { dateISO: string; strike: number; type: 'C' | 'P' } | null {
  const m = name.match(/^BTC-(\d{1,2})([A-Z]{3})(\d{2})-(\d+)-(C|P)$/);
  if (!m) return null;
  const [, d, mon, yy, strikeStr, type] = m;
  const monthIdx = MONTHS[mon];
  if (monthIdx === undefined) return null;
  const year = 2000 + parseInt(yy, 10);
  const day = d.padStart(2, '0');
  const date = new Date(Date.UTC(year, monthIdx, parseInt(day, 10)));
  const iso = date.toISOString().slice(0, 10);
  return { dateISO: iso, strike: parseInt(strikeStr, 10), type: type as 'C' | 'P' };
}

export function filterByDate(book: BookSummary[], date: string): ParsedInstrument[] {
  const out: ParsedInstrument[] = [];
  for (const item of book) {
    const parsed = parseInstrumentName(item.instrument_name);
    if (!parsed) continue;
    if (parsed.dateISO === date) {
      out.push({ ...parsed, oi: item.open_interest });
    }
  }
  return out;
}

export function computeMaxPain(items: ParsedInstrument[]): MaxPainResult {
  const byStrike = new Map<number, { call: number; put: number }>();
  for (const it of items) {
    const s = byStrike.get(it.strike) || { call: 0, put: 0 };
    if (it.type === 'C') s.call += it.oi; else s.put += it.oi;
    byStrike.set(it.strike, s);
  }
  const strikes = Array.from(byStrike.keys()).sort((a, b) => a - b);
  const painByStrike = new Map<number, number>();
  for (const S of strikes) {
    let total = 0;
    for (const [K, { call, put }] of byStrike) {
      total += call * Math.max(0, S - K) + put * Math.max(0, K - S);
    }
    painByStrike.set(S, total);
  }
  let minStrike = NaN;
  let minPain = Infinity;
  for (const [S, pain] of painByStrike) {
    if (pain < minPain) {
      minPain = pain;
      minStrike = S;
    }
  }
  let oiCallsBTC = 0;
  let oiPutsBTC = 0;
  const topStrikes = strikes
    .map((strike) => {
      const { call, put } = byStrike.get(strike)!;
      oiCallsBTC += call;
      oiPutsBTC += put;
      return { strike, callBTC: call, putBTC: put, oiBTC: call + put };
    })
    .sort((a, b) => b.oiBTC - a.oiBTC)
    .slice(0, 10);
  const histogram = strikes.map((strike) => {
    const { call, put } = byStrike.get(strike)!;
    return { strike, oiBTC: call + put };
  });
  return {
    dateISO: items[0]?.dateISO ?? '',
    maxPain: minStrike,
    oiCallsBTC,
    oiPutsBTC,
    putCallRatio: oiCallsBTC === 0 ? Infinity : oiPutsBTC / oiCallsBTC,
    topStrikes: topStrikes.map(({ strike, callBTC, putBTC }) => ({ strike, callBTC, putBTC })),
    histogram,
    sampleSize: items.length,
    computedAt: new Date().toISOString(),
  };
}
