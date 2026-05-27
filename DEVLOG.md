## Day 1 — May 12, 2026
- Set up Cloudflare Workers project with Wrangler
- Configured Git global user.name and user.email
- Deployed first Worker returning JSON health check
- URL: https://threat-pipeline.hballa.workers.dev/

## Day 2 — May 13-15, 2026
- Created D1 database threat-timeline via Cloudflare dashboard
- Added D1 binding to wrangler.jsonc
- Created schema.sql with events table (9 columns)
- Applied schema to remote D1 database
- Added GET /events and POST /event routing to Worker
- Fixed TypeScript Env type with cf-typegen
- Implemented POST /event — reads JSON body, inserts to D1 with prepared statement
- Implemented GET /events — queries D1, returns all rows as JSON
- Verified end-to-end: POSTed test event, confirmed in D1 console, confirmed via GET

## Day 3 — May 15, 2026
- Built normalize() function in Worker
- Extracts timestamp, src_ip, user, event_type from raw Linux auth log lines using regex and split()
- POST /event now accepts raw + source only, normalizes internally before storing
- Deliberate decision: port not added to schema — not universal across all log sources, captured in raw field
- Verified end to end — raw log line in, parsed structured event stored in D1
- Next: Python collector for Linux auth logs

## Day 4 — May 16-26, 2026
- Built linux_auth.py collector
- Added threading with ThreadPoolExecutor (max_workers=10) — 10x speed improvement
- Processed full Elastic auth.log dataset — 7121 events ingested (link: https://github.com/elastic/examples/blob/master/Machine%20Learning/Security%20Analytics%20Recipes/suspicious_login_activity/data/auth.log)
- Timeline breakdown: 713 failed_login, 557 sudo_command, 190 successful_login, 5661 unknown
- Normalizer correctly handles "invalid user" lines via fromIndex - 1
- Next: Cloudflare WAF log collector