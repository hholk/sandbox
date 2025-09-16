# Reader: Montescudaio Roadbook

## Product Snapshot
- **Purpose:** Curated day-trip planner that prioritizes stress-free BTC-funded getaways around Montescudaio.
- **Users:** Travel-savvy planners who expect precise guidance (drive time, ticketing, navigation links) in German.
- **Value:** Aggregates Deribit-inspired discipline with concierge-level editorial curation inside a single scrolling view.

## Data Sources
- Primary JSON datasets live in `data/*.json` with the bundled fallback defined in `data/static-trips.ts`.
- Loader utilities (`loadTrips`, `loadItems`) clone data defensively to preserve immutability and maintain O(n) complexity per request.
- Hero imagery is sourced from authoritative remote hosts (Commons, ticket portals) and cached lazily through `/api/image` so deployments stay lightweight.
- Apple/Google Maps links are synthesized in `lib/trips.ts`; keep new data aligned with the `Item` interface.

## Architecture Overview
- Next.js 15 App Router with a single page composed of server components, styled via Tailwind + custom CSS tokens.
- Shared UI idioms: `glass-panel` shells, sticky horizontal filters, card hover glow, and accent-forward CTAs.
- `resolveImageSrc` in `lib/image-proxy.ts` decides whether to serve local assets or proxy remote hosts through `/api/image`, keeping SSRF guards intact.

## Usage Example
```ts
import { loadItems } from '@/lib/trips';

const items = loadItems();
const shortDrives = items.filter((item) => (item.drive_time_min ?? item.drive_min ?? 0) <= 45);
```
The helper runs in O(n) time, returns cloned objects, and leaves the shared dataset untouched so UI interactions stay deterministic.

## Extension Ideas
- Introduce a client-side tag filter that mirrors the sticky chip styling and respects keyboard navigation.
- Add analytics-safe tracking for link clicks by wrapping anchors in a lightweight client component.
- Offer localized print/PDF exports that keep the hero summary and cards readable in monochrome.
