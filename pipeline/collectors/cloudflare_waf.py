import json
import requests
from concurrent.futures import ThreadPoolExecutor

def send_line(line, worker_url):
    data = {"raw": json.dumps(line), "source": "cloudflare_waf"}
    try:
        response = requests.post(worker_url, json=data)
        response.raise_for_status()
        print(f"Sent: {line.get('ClientIP', 'unknown')} - {line.get('Action', 'unknown')}")
    except requests.exceptions.RequestException as e:
        print(f"Failed: {e}")

def collect_json():
    worker_url = "https://threat-pipeline.hballa.workers.dev/event"
    with open("samples/cloudflare_ddos_5k.json", "r") as log_file:
        lines = json.load(log_file)
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(lambda line: send_line(line, worker_url), lines)

collect_json()