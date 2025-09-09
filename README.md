# V/S Radar (MVP)

YouTube videos ranked by views/subscribers (V/S ratio). This is an MVP scaffold with mock data and UI for quick iteration.

## Tech

- Next.js (App Router)
- Mock API routes in Next.js (M0)
- Cloudflare Workers BFF planned (M1+)

## Scripts

- `npm run dev` — Start Next.js dev server
- `npm run build` — Build
- `npm run start` — Start production server
- `npm run typecheck` — TypeScript check

Note: Dependencies are declared but not installed yet. Install when ready:

```
npm install
npm run dev
```

## MVP Scope (Aligned to Requirements)

- Search UI (period presets, type, thresholds, sort)
- Results table with mock data and paging
- CSV export (client POST -> `/api/export` => `text/csv`)
- Error shape: `{ "error": { "code", "message" } }`

## API (Mocked)

- `GET /api/search` — Validates/normalizes params; returns mock results
- `POST /api/export` — Returns CSV from mock results
- `GET /api/video/:id` — Sample detail
- `GET /api/channel/:id` — Sample channel

All are placeholders. In M1, Next.js will call a Cloudflare Worker BFF that actually queries YouTube Data API v3, applies V/S ratio logic, and caches results (KV/D1).

## Env Vars

- `NEXT_PUBLIC_API_BASE` (e.g., http://127.0.0.1:8787) — Cloudflare Worker dev URL.
  - Secrets like `YOUTUBE_API_KEY` belong in the Worker (wrangler secret), not here.

## Roadmap

1. M0: UI + mock (done)
2. M1: Cloudflare Worker BFF
   - Endpoints: `/api/search`, `/api/video/:id`, `/api/channel/:id`, `/api/export`
   - YouTube API integration (`videos.list`, `channels.list`, `search.list`)
   - Shorts detection: duration ≤ 60s
   - Hidden subscribers => apply `subsFloor`
3. M2: CSV export on BFF (streamed)
4. M3: KV/D1 cache (SWrV), rate limiting, CORS

## Notes

- Sorting stability: when primary key ties, secondary sort by `views desc`.
- Paging defaults: `page=1`, `pageSize=50`.
- Error and limits mirror the spec; mock enforces basic validation.
# Youtube-Viral-Finder
