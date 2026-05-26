# Threat Detection & Automated IR Pipeline

Cloudflare-native threat detection and automated incident response pipeline.

## Status
In Progress

### What's Built
- Cloudflare Worker deployed at https://threat-pipeline.hballa.workers.dev
- D1 database (threat-timeline) created and schema applied
- Events table: id, timestamp, source, src_ip, user, event_type, raw, tags, flagged
- POST /event — accepts raw log line + source, normalizes internally, writes to D1
- GET /events — queries D1, returns full timeline as JSON
- normalize() function — extracts timestamp, src_ip, user, event_type from raw Linux auth log lines
- Health check at GET /

### Next Session
- Python collector for Linux auth logs — read file line by line, POST to Worker
- Cloudflare WAF log collector

## Architecture
- **Ingestion:** Cloudflare Workers receive and normalize logs from multiple sources
- **Detection:** MITRE ATT&CK rule-based engine + ML anomaly detection (Isolation Forest)
- **Enrichment:** AbuseIPDB, WHOIS, GeoIP, VirusTotal
- **Triage:** LLM summarization via Claude API
- **Playbook:** RAG-powered response retrieval via LlamaIndex
- **Dashboard:** React frontend on Cloudflare Pages, gated by Zero Trust

## Stack
Cloudflare Workers · D1 · KV · Pages · Access · Python · TypeScript · scikit-learn · Claude API
