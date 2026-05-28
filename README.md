# Threat Detection & Automated IR Pipeline

Cloudflare-native threat detection and automated incident response pipeline.

## Status
In Progress
Infrastructure          (completed)
Ingestion               (completed)
Detection Engine        (In-Progress)
ML Anomaly Detection    (In-Progress)
Alert Enrichment        (In-Progress)
AI Triage               (In-Progress)
RAG Playbook            (In-Progress)
React Dashboard         (In-Progress)
Zero Trust              (In-Progress)


## Live Demo
- All events: https://threat-pipeline.hballa.workers.dev/events
- Linux auth logs: https://threat-pipeline.hballa.workers.dev/events?source=linux_auth
- Cloudflare WAF logs: https://threat-pipeline.hballa.workers.dev/events?source=cloudflare_waf
- IP filter example: https://threat-pipeline.hballa.workers.dev/events?src_ip=185.220.101.238

## Data Sources
- Linux auth logs: [Elastic examples dataset](https://github.com/elastic/examples)
- WAF logs: Simulated DDoS dataset (generated via `generate_mock_ddos.py`)

### What's Built
- Cloudflare Worker deployed at https://threat-pipeline.hballa.workers.dev
- D1 database (threat-timeline) — 12,121 events across 2 sources
- Schema: id, timestamp, source, src_ip, dst_ip, user, event_type, severity, raw, tags, flagged, metadata
- POST /event — accepts raw log line + source, normalizes internally, writes to D1
- GET /events — returns full timeline with optional filters (?source, ?src_ip, ?from/to)
- normalize() — handles linux_auth (split/regex) and cloudflare_waf (JSON.parse) formats
- linux_auth.py — threaded collector, ingested 7121 events from Elastic auth.log
- cloudflare_waf.py — threaded collector, ingested 5000 simulated DDoS events
- generate_mock_ddos.py — generates realistic WAF logs with varied actions/rules

### Next Session
- Detection engine — MITRE ATT&CK rule-based detection
- Isolation Forest ML anomaly detection
- Alert enrichment — AbuseIPDB, WHOIS, GeoIP, VirusTotal

## Architecture
- **Ingestion:** Cloudflare Workers receive and normalize logs from multiple sources
- **Detection:** MITRE ATT&CK rule-based engine + ML anomaly detection (Isolation Forest)
- **Enrichment:** AbuseIPDB, WHOIS, GeoIP, VirusTotal
- **Triage:** LLM summarization via Claude API
- **Playbook:** RAG-powered response retrieval via LlamaIndex
- **Dashboard:** React frontend on Cloudflare Pages, gated by Zero Trust

## Stack
Cloudflare Workers · D1 · KV · Pages · Access · Python · TypeScript · scikit-learn · Claude API
