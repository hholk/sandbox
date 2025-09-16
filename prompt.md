# v0 Prompt: BTC Max-Pain Dashboard

## Objective
- Craft generative UI updates for the BTC max-pain planner that merge quant finance clarity with premium travel storytelling.
- Preserve the trip discovery flow: hero summary, sticky chip navigation, and stacked glass panels for itinerary cards.
- Keep responses deterministic, production-ready, and compliant with Next.js 15 + Tailwind conventions already in the repo.

## Deliverables
- Updated or new React Server Components under `app/` with Tailwind utility classes and existing `glass-panel` aesthetic.
- Re-usable helper functions in `lib/` when data shaping is required; never fetch directly from components.
- Copy deck variants (headline, body, CTA) tailored for German-speaking travelers following the calm-but-confident brand voice.

## Tone and Copy
- Voice: pragmatic, empathetic, quietly enthusiastic about road trips.
- Style: short paragraphs, avoid slang, include concrete hints (distance, timing, booking windows).
- Localize units to metric, currency to EUR where needed, and show warnings when data is missing.

## Visual Language
- Respect the dark glassmorphism palette defined in `app/globals.css` (accent `#f97316`, muted slate typography).
- Use rounded-3xl corners, layered gradients, and soft drop shadows consistent with existing hero + card layout.
- Prefer responsive flex/grid combos that keep sticky navigation usable on touch devices.

## Data + APIs
- Source trip content via `loadItems()` / `loadTrips()` from `lib/trips.ts`; never bypass caching logic.
- Highlight key derived stats (count, categories, max drive) in O(n) aggregations only.
- Guard against empty data by surfacing fallback messaging and ensuring deterministic ordering by popularity.

## Interactions
- Keep sticky chip navigation accessible (keyboard focus, ARIA labels on icons as needed).
- Offer CTA buttons linking to Apple/Google Maps when `links` exist; degrade gracefully if URLs are absent.
- Allow optional filters (tags, drive time) without mutating shared state; derive filtered arrays per render.

## Technical Guardrails
- Only use server-safe APIs in Server Components; shift client behavior into isolated Client Components when necessary.
- Avoid experimental dependencies; stick to built-in Next.js routing, fetch, and caching utilities.
- Target O(n) data passes, pre-validate user input, and never rely on `eval`/`Function` or untrusted HTML.

## Out of Scope
- Payment, authentication, or booking integrations.
- Map renderers, 3D globe effects, or heavy canvas work.
- Altering deployment scripts or cron configuration unless explicitly requested.
