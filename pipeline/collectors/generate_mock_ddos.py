import json
import random
import time
from datetime import datetime, timezone

def generate_ddos_log(lines=5000):
    # Spoofed botnet components
    bot_ips = [f"185.220.101.{random.randint(1,254)}" for _ in range(50)] + [f"103.242.112.{random.randint(1,254)}" for _ in range(50)]
    colos = ["IAD", "AMS", "HKG", "CDG", "LHR", "SIN"]
    
    logs = []
    base_timestamp = int(time.time() * 1000000) # Microseconds

    actions = ["drop", "block", "challenge", "allow", "log"]
    descriptions = [
        "HTTP Layer 7 Flood Mitigation Engine Triggered",
        "SQLi attack detected",
        "XSS attempt blocked",
        "Rate limit exceeded",
        "Known malicious IP blocked",
        "Bot fingerprint detected"
    ]
    rule_ids = [
        "http_ddos_protection",
        "sqli_rule_001",
        "xss_rule_002", 
        "ratelimit_rule_003",
        "ip_reputation_block",
        "bot_management_rule"
    ]
    for i in range(lines):    
        timestamp = datetime.fromtimestamp((base_timestamp + (i * 100)) / 1000000, tz=timezone.utc).isoformat()
        logs.append({
            "EdgeStartTimestamp": timestamp,
            "ClientIP": random.choice(bot_ips),
            "ClientRequestHost": "://yourdomain.com",
            "ClientRequestMethod": "GET",
            "ClientRequestURI": "/api/v1/resource",
            "ClientRequestUserAgent": "Mozilla/5.0 (Botnet-Simulated-Traffic)",
            "EdgeColoCode": random.choice(colos),
            "EdgeResponseStatus": 403,
            "Kind": "ddos",
            "Action": random.choice(actions),
            "RuleID": random.choice(rule_ids),
            "Description": random.choice(descriptions),
            "Source": "ddos",
            "MatchIndex": 0,
            "Metadata": {"attack_id": "ddos_sim_2026_05"}
        })
        
    with open("pipeline/collectors/samples/cloudflare_ddos_5k.json", "w") as f:
        json.dump(logs, f, indent=2)
    print(f"Successfully generated a 5,000-line realistic DDoS log profile!")

if __name__ == "__main__":
    generate_ddos_log(5000)