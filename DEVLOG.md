## Day 1 — 2026-05-12
- Set up Cloudflare Workers project with Wrangler
- Configured Git global user.name and user.email
- Deployed first Worker returning JSON health check
- URL: https://threat-pipeline.hballa.workers.dev/
- Next: D1 database setup

## Day 2 — 2026-05-13
- Created D1 database threat-timeline via Cloudflare dashboard
- Added D1 binding to wrangler.jsonc
- Created schema.sql with events table (9 columns)
- Applied schema to remote D1 database
- Added GET /events and POST /event routing to Worker
- Confirmed all three routes return correct responses
- Next: implement actual D1 read/write logic in both routes