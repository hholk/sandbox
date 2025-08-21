import { GET } from '@/app/api/maxpain/route';
import { NextRequest } from 'next/server';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://www.deribit.com/api/v2/public/get_book_summary_by_currency', () =>
    HttpResponse.json({
      result: [
        { instrument_name: 'BTC-1JAN25-100-C', open_interest: 1 },
        { instrument_name: 'BTC-1JAN25-100-P', open_interest: 2 },
      ],
    })
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('API returns max pain', async () => {
  const req = new NextRequest('http://localhost/api/maxpain?dates=2025-01-01');
  const res = await GET(req);
  const json = await res.json();
  expect(json.results[0].maxPain).toBe(100);
});
