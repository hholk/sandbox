# BTC Max-Pain (Deribit)

Next.js 14 app to compute BTC options max-pain from Deribit public data.

## Start

```bash
pnpm install
pnpm dev
```

## Tests

```bash
pnpm quality
```

## Deploy

Deploy on [Vercel](https://vercel.com). Use the Node.js runtime. Install command `pnpm install` and build command `pnpm build`. Optional cron warmup is defined in `vercel.json`.

Trip data is bundled for hobby-tier deployments. When the read-only file system blocks access to `/data`, the loader falls back to the compiled dataset and keeps every call immutable.

## Limits

- Deribit public API is cached on the server for 30s and revalidated on the client every 60s.
- Exponential backoff with two retries guards against 429 and network errors.
- Data units are in BTC; max pain strike is reported in USD.

## Known Pitfalls

- If no instruments exist for a date, the API returns `maxPain: NaN` with an issue message.
- Bypassing cache may hit Deribit rate limits.

## Method

Open interest per strike is aggregated from `get_book_summary_by_currency`. Max pain is the strike `S` minimizing
`Σ[OI_call(K)*max(0,S−K)+OI_put(K)*max(0,K−S)]`.

## Trip Item Template

Use this snippet to add new entries in `data/*.json`. The Apple Maps link
provides driving directions in CarPlay and is derived from `map_query`.

```json
{
  "id": "example_id",
  "name": "Example Name",
  "category": ["Stadt & Kultur"],
  "popularity": 0,
  "drive_min": 0,
  "description": "Kurzbeschreibung.",
  "planning": "Planungshinweise.",
  "organizing": "Organisationshinweise.",
  "links": [
    {
      "title": "Apple Maps",
      "url": "https://maps.apple.com/?daddr=Example%20Place&dirflg=d"
    }
  ],
  "image": "https://example.com/image.jpg",
  "map_query": "Example Place"
}
```

## Usage Example

```ts
import { loadItems } from '@/lib/trips';

const items = loadItems();
const scenicTrips = items.filter((item) => item.tags?.includes('Strand'));
```

`loadItems` clones the dataset on each call in O(n) time, so mutating `items` does not impact subsequent renders.

```tsx
<nav className="flex w-full items-center gap-3 overflow-x-auto rounded-full flex-nowrap lg:flex-wrap">
  {/* Trip shortcuts */}
</nav>
```

The horizontal overflow keeps the sticky navigation compact on small screens while preserving wrapped chips on larger viewports.

```ts
const remoteUrl = 'https://upload.wikimedia.org/path/to/image.jpg';
const response = await fetch(`/api/image?src=${encodeURIComponent(remoteUrl)}`);
const cachedBlob = await response.blob();
```

The proxy validates hosts in O(1) time and returns cached binaries with long-lived cache headers for CDNs.
