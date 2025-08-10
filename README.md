# LLM Dashboard

Minimal Next.js app that visualizes LLM models.

## Features
- Bubble chart of Elo score (x) vs inverse price per token (y).
- Bubble size reflects context window; legend shows common sizes.
- Color legend distinguishes open, closed and hybrid weights; icons mark image, speech and reasoning capabilities.
- Data loaded from CSV (`data/models.csv`) and mirrored in a table beneath the chart.
- `/api/models?source=URL` allows switching to other CSV/JSON sources.
- Inline form lets you append models during a session (no persistence).

## Development
```bash
npm install
npm run dev
```

## Deployment to Vercel (Hobby plan)
1. Push this repo to GitHub.
2. In Vercel, choose **Import Project** → select the repo.
3. Framework Preset: **Next.js**. Build command and output stay default.
4. No disk writes at runtime; data updates require editing the CSV and redeploying.
5. Optional: set `LEADERBOARD_SOURCE` env var with a remote CSV/JSON URL.
