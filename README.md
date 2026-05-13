# Threat Detection & Automated IR Pipeline

Cloudflare-native threat detection and automated incident response pipeline.

## Status
In Progress

## Architecture
- **Ingestion:** Cloudflare Workers receive and normalize logs from multiple sources
- **Detection:** MITRE ATT&CK rule-based engine + ML anomaly detection (Isolation Forest)
- **Enrichment:** AbuseIPDB, WHOIS, GeoIP, VirusTotal
- **Triage:** LLM summarization via Claude API
- **Playbook:** RAG-powered response retrieval via LlamaIndex
- **Dashboard:** React frontend on Cloudflare Pages, gated by Zero Trust

## Stack
Cloudflare Workers · D1 · KV · Pages · Access · Python · TypeScript · scikit-learn · Claude API
