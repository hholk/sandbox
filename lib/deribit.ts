export interface BookSummary {
  instrument_name: string;
  open_interest: number;
}

const API_BASE = 'https://www.deribit.com/api/v2';

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchBookSummary(retries = 2): Promise<BookSummary[]> {
  const url = `${API_BASE}/public/get_book_summary_by_currency?currency=BTC&kind=option`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 30 } });
      if (!res.ok) {
        if (res.status === 429 && attempt < retries) {
          await delay(2 ** attempt * 100);
          continue;
        }
        throw new Error(`Deribit error ${res.status}`);
      }
      const json = await res.json();
      return json.result as BookSummary[];
    } catch (err) {
      if (attempt === retries) throw err;
      await delay(2 ** attempt * 100);
    }
  }
  return [];
}
