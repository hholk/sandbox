import { GET } from '@/app/api/maxpain/route';
import { NextRequest } from 'next/server';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://www.deribit.com/api/v2/public/get_book_summary_by_currency', () => {
    const result: Array<{ instrument_name: string; open_interest: number }> = [];
    for (const d of ['1JAN25','8JAN25','15JAN25','22JAN25','29JAN25']) {
      result.push({ instrument_name: `BTC-${d}-100-C`, open_interest: 1 });
      result.push({ instrument_name: `BTC-${d}-100-P`, open_interest: 1 });
    }
    return HttpResponse.json({ result });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('performance under 2s', async () => {
  const dates = ['2025-01-01','2025-01-08','2025-01-15','2025-01-22','2025-01-29'];
  const start = Date.now();
  const req = new NextRequest(`http://localhost/api/maxpain?dates=${dates.join(',')}`);
  await GET(req);
  const dur = Date.now() - start;
  expect(dur).toBeLessThan(2000);
});
