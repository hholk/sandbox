import { computeMaxPain, parseInstrumentName, filterByDate } from '@/lib/maxpain';
import type { BookSummary } from '@/lib/deribit';

test('parseInstrumentName parses correctly', () => {
  const p = parseInstrumentName('BTC-1JAN25-50000-C');
  expect(p).toEqual({ dateISO: '2025-01-01', strike: 50000, type: 'C' });
  expect(parseInstrumentName('invalid')).toBeNull();
});

test('computeMaxPain simple grid', () => {
  const items = [
    { dateISO: '2025-01-01', strike: 100, type: 'C', oi: 1 },
    { dateISO: '2025-01-01', strike: 200, type: 'P', oi: 1 },
  ];
  const res = computeMaxPain(items);
  expect(res.maxPain).toBe(100);
});

const mockBook: BookSummary[] = [
  { instrument_name: 'BTC-1JAN25-100-C', open_interest: 1 },
  { instrument_name: 'BTC-1JAN25-100-P', open_interest: 2 },
  { instrument_name: 'BTC-8JAN25-200-C', open_interest: 3 },
];

test('filterByDate filters instruments', () => {
  const items = filterByDate(mockBook, '2025-01-01');
  expect(items.length).toBe(2);
});
