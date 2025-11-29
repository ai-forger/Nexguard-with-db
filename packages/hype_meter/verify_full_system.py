import subprocess
import time
import requests
import sys
from datetime import datetime, timedelta, timezone
import random
from database import get_db

def seed_live_data():
    """
    Seeds data representing 'Right Now' so the API returns fresh results.
    """
    print("Seeding FRESH mock data for live verification...")
    db = get_db()
    
    # Clear old data to avoid confusion
    db.token_metrics.delete_many({})
    db.social_metrics.delete_many({})
    
    now = datetime.now(timezone.utc)
    
    token_docs = []
    social_docs = []
    
    # Generate data for CLOWN_TOKEN (Clown Energy)
    for i in range(1440):
        timestamp = now - timedelta(minutes=i)
        
        # CLOWN: Price drops/stays low while hype spikes
        # Past 23h: Price 12.0. Last 1h: Price 10.0.
        if i < 60:
            price_clown = 10.0 + random.uniform(-0.05, 0.05) # Low
            hype_clown = random.randint(80, 100) # High Hype
        else:
            price_clown = 12.0 + random.uniform(-0.1, 0.1) # High
            hype_clown = random.randint(0, 10) # Low Hype
        
        token_docs.append({
            "policy_id": "CLOWN_TOKEN",
            "price": price_clown,
            "volume": 1000,
            "timestamp": timestamp
        })
        social_docs.append({
            "keywords": ["clown"],
            "hype_score": hype_clown,
            "source": "reddit",
            "timestamp": timestamp
        })
        
    db.token_metrics.insert_many(token_docs)
    db.social_metrics.insert_many(social_docs)
    print("Data seeded.")

def verify_full_system():
    print("--- Verifying Full System Operability ---")
    
    # 1. Seed Data
    seed_live_data()
    
    # 2. Start API Server
    print("\nStarting Hype Meter API...")
    process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        time.sleep(5) # Wait for startup
        
        # 3. Simulate Frontend Request
        print("\nSimulating Frontend Request (useHypeMeter hook)...")
        target_url = "http://127.0.0.1:8000/meter/CLOWN_TOKEN"
        print(f"GET {target_url}")
        
        res = requests.get(target_url)
        
        if res.status_code == 200:
            data = res.json()
            print("\n✅ API Response Received (What the UI sees):")
            print("------------------------------------------------")
            print(f"Status:      {data['status']}")
            print(f"Risk Label:  {data['risk_label']} (Should be 'Clown Energy')")
            print(f"Ratio:       {data['ratio']:.4f}")
            print(f"Message:     {data['message']}")
            print("------------------------------------------------")
            
            if data['risk_label'] == 'Clown Energy':
                print("\n[SUCCESS] System is OPERATIONAL. The UI will display the Red 'Clown Energy' alert.")
            else:
                print(f"\n[WARNING] System is running, but logic returned '{data['risk_label']}' instead of 'Clown Energy'.")
        else:
            print(f"\n[FAIL] API Error: {res.status_code} - {res.text}")
            
    except Exception as e:
        print(f"\n[FAIL] System Verification Error: {e}")
        
    finally:
        print("\nStopping API Server...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    verify_full_system()
