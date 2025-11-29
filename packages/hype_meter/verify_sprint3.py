import subprocess
import time
import requests
import sys
import os

def verify_sprint3():
    print("--- Verifying Sprint 3 (API) ---")
    
    # 1. Start Server
    print("Starting FastAPI Server...")
    process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        # Wait for server to start
        time.sleep(5)
        
        # 2. Check Health
        print("\nChecking /health...")
        try:
            res = requests.get("http://127.0.0.1:8000/health")
            if res.status_code == 200 and res.json()['status'] == 'online':
                print("   [PASS] Health Check OK")
            else:
                print(f"   [FAIL] Health Check Failed: {res.text}")
        except Exception as e:
            print(f"   [FAIL] Connection Error: {e}")
            
        # 3. Check Meter Endpoint (using CLOWN_TOKEN from Sprint 2 mock data)
        print("\nChecking /meter/CLOWN_TOKEN...")
        try:
            res = requests.get("http://127.0.0.1:8000/meter/CLOWN_TOKEN")
            if res.status_code == 200:
                data = res.json()
                print(f"   [PASS] Meter Response: {data['risk_label']} (Ratio: {data['ratio']:.2f})")
            else:
                print(f"   [FAIL] Meter Error: {res.status_code} - {res.text}")
        except Exception as e:
            print(f"   [FAIL] Connection Error: {e}")

        # 4. Check History Endpoint
        print("\nChecking /history/CLOWN_TOKEN...")
        try:
            res = requests.get("http://127.0.0.1:8000/history/CLOWN_TOKEN")
            if res.status_code == 200:
                data = res.json()
                history_len = len(data['history'])
                print(f"   [PASS] History Response: {history_len} points returned.")
            else:
                print(f"   [FAIL] History Error: {res.status_code} - {res.text}")
        except Exception as e:
            print(f"   [FAIL] Connection Error: {e}")

    finally:
        print("\nStopping Server...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    verify_sprint3()
