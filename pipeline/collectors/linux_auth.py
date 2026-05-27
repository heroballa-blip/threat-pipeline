from concurrent.futures import ThreadPoolExecutor
import requests

def send_line(line, worker_url):
    data = {"raw": line.strip(), "source": "linux_auth"}
    try:
        response = requests.post(worker_url, json=data)
        response.raise_for_status()
        print(f"Sent: {line.strip()[:50]}")
    except requests.exceptions.RequestException as e:
        print(f"Failed: {e}")

def collect_linux_auth_logs():
    worker_url = "https://threat-pipeline.hballa.workers.dev/event"
    with open("auth.log", "r") as log_file:
        lines = log_file.readlines()
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(lambda line: send_line(line, worker_url), lines)

collect_linux_auth_logs()