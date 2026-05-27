import requests

def collect_linux_auth_logs():
    worker_url = "https://threat-pipeline.hballa.workers.dev/event"
    
    with open("auth.log", "r") as log_file:
        for line in log_file:
            data = {"raw": line.strip(), "source": "linux_auth"}
            try:
                response = requests.post(worker_url, json=data)
                response.raise_for_status()
                print(f"Sent: {line.strip()[:50]}")

            except requests.exceptions.RequestException as e:
                print(f"Failed to send log: {e}")
collect_linux_auth_logs()
