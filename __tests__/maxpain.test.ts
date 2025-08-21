import { computeMaxPain, parseInstrumentName, filterByDate } from '@/lib/maxpain';
import type { BookSummary } from '@/lib/deribit';

describe('instrument parser', () => {
  it('parses valid names', () => {
    expect(parseInstrumentName('BTC-1JAN25-50000-C')).toEqual({
      dateISO: '2025-01-01',
      strike: 50000,
      type: 'C',
    });
    expect(parseInstrumentName('BTC-01FEB25-10000-P')).toEqual({
      dateISO: '2025-02-01',
      strike: 10000,
      type: 'P',
    });
  });
  it('rejects invalid names', () => {
    expect(parseInstrumentName('BTC-1FOO25-100-C')).toBeNull();
    expect(parseInstrumentName('invalid')).toBeNull();
  });
});

describe('max pain computation', () => {
  it('finds analytic minimum on symmetric grid', () => {
    const items = [
      { dateISO: '2025-01-01', strike: 100, type: 'C', oi: 1 },
      { dateISO: '2025-01-01', strike: 200, type: 'C', oi: 1 },
      { dateISO: '2025-01-01', strike: 200, type: 'P', oi: 1 },
      { dateISO: '2025-01-01', strike: 300, type: 'P', oi: 1 },
    ];
    const res = computeMaxPain(items);
    expect(res.maxPain).toBe(200);
    expect(res.oiCallsBTC).toBe(2);
    expect(res.oiPutsBTC).toBe(2);
  });
  it('handles asymmetric puts and calls', () => {
    const items = [
      { dateISO: '2025-01-01', strike: 100, type: 'C', oi: 5 },
      { dateISO: '2025-01-01', strike: 100, type: 'P', oi: 15 },
      { dateISO: '2025-01-01', strike: 200, type: 'P', oi: 10 },
    ];
    const res = computeMaxPain(items);
    expect(res.putCallRatio).toBeCloseTo((15 + 10) / 5);
  });
});

describe('filtering', () => {
  const mockBook: BookSummary[] = [
    { instrument_name: 'BTC-1JAN25-100-C', open_interest: 1 },
    { instrument_name: 'BTC-1JAN25-100-P', open_interest: 2 },
    { instrument_name: 'BTC-8JAN25-200-C', open_interest: 3 },
  ];
  it('filters instruments by ISO date', () => {
    const items = filterByDate(mockBook, '2025-01-01');
    expect(items).toHaveLength(2);
  });
});
