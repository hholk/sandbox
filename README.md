# BTC Max-Pain (Deribit)

Next.js 14 app to compute BTC options max-pain from Deribit public data.

## Development

```bash
pnpm install
pnpm dev
```

## Tests

```bash
pnpm quality
```

## Deploy

Deploy on Vercel. Set build command `pnpm build` and install command `pnpm install`.

## Method

Open interest per strike is aggregated from `get_book_summary_by_currency`.
Max pain is strike minimizing combined loss of puts and calls.
