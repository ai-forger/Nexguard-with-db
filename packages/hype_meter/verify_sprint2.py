import sys
import os
from datetime import datetime, timedelta, timezone
import random
from database import get_db, init_db
from analytics import calculate_hype_ratio

def seed_mock_data():
    """
    Seeds MongoDB with 24 hours of mock data to test analytics.
    """
    print("Seeding mock data...")
    db = get_db()
    
    # Clear existing test data
    db.token_metrics.delete_many({})
    db.social_metrics.delete_many({})
    
    now = datetime.now(timezone.utc)
    
    token_docs = []
    social_docs = []
    
    # Generate data for CLOWN token (High Hype, Flat Price)
    for i in range(1440):
        timestamp = now - timedelta(minutes=i)
        
        # CLOWN: Flat price, High hype
        price_clown = 10.0 + random.uniform(-0.1, 0.1)
        hype_clown = random.randint(50, 100) if i < 60 else random.randint(0, 10)
        
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

        # WHALE: Rising price (Low in past, High now), Low hype
        # i=0 is NOW. i=1439 is 24h ago.
        # We want price to be high at i=0.
        price_whale = 10.0 + ((1440 - i) * 0.05) 
        hype_whale = random.randint(0, 5) # Low hype
        
        token_docs.append({
            "policy_id": "WHALE_TOKEN",
            "price": price_whale,
            "volume": 5000,
            "timestamp": timestamp
        })
        social_docs.append({
            "keywords": ["whale"],
            "hype_score": hype_whale,
            "source": "reddit",
            "timestamp": timestamp
        })
        
    db.token_metrics.insert_many(token_docs)
    db.social_metrics.insert_many(social_docs)
    print(f"Seeded data for CLOWN_TOKEN and WHALE_TOKEN.")

def verify_sprint2():
    print("--- Verifying Sprint 2 (Analytics) ---")
    
    # 1. Seed Data
    seed_mock_data()
    
    # 2. Run Analytics
    print("\nRunning Analytics...")
    
    # Test CLOWN
    print("\n--- Testing CLOWN_TOKEN (Expect: Clown Energy) ---")
    try:
        result = calculate_hype_ratio("CLOWN_TOKEN")
        print("Result:", result)
        if result['status'] == 'success' and result['risk_label'] == 'Clown Energy':
            print("[PASS] Correctly identified Clown Energy.")
        else:
            print(f"[FAIL] Expected Clown Energy, got {result.get('risk_label')}")
    except Exception as e:
        print(f"[FAIL] Error: {e}")

    # Test WHALE
    print("\n--- Testing WHALE_TOKEN (Expect: Whale Accumulation) ---")
    try:
        result = calculate_hype_ratio("WHALE_TOKEN")
        print("Result:", result)
        if result['status'] == 'success' and result['risk_label'] == 'Whale Accumulation':
            print("[PASS] Correctly identified Whale Accumulation.")
        else:
            print(f"[FAIL] Expected Whale Accumulation, got {result.get('risk_label')}")
    except Exception as e:
        print(f"[FAIL] Error: {e}")

if __name__ == "__main__":
    verify_sprint2()
