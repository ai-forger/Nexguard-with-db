import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# Try to load .env from backend if not found
env_path = Path('.') / '.env'
if not env_path.exists():
    env_path = Path('../backend/.env')

print(f"Loading .env from: {env_path.resolve()}")
load_dotenv(dotenv_path=env_path)

try:
    from database import get_db, init_db
    from ingestion import fetch_price, fetch_reddit_hype
except ImportError as e:
    print(f"Import Error: {e}")
    print("Make sure you are running this from packages/hype_meter directory")
    sys.exit(1)

def verify_sprint1():
    print("--- Verifying Sprint 1 ---")
    
    # 1. Check MongoDB
    print("\n1. Checking MongoDB Connection...")
    try:
        db = get_db()
        # Try a simple command
        db.command('ping')
        print("   [PASS] MongoDB Connected")
        
        # Check indexes
        print("   Checking Indexes...")
        init_db() # This prints logs
    except Exception as e:
        print(f"   [FAIL] MongoDB Error: {e}")

    # 2. Check Blockfrost
    print("\n2. Checking Blockfrost API...")
    bf_key = os.getenv('BLOCKFROST_API_KEY')
    if not bf_key:
        print("   [WARN] BLOCKFROST_API_KEY not set in .env")
    else:
        try:
            from blockfrost import BlockFrostApi
            api = BlockFrostApi(project_id=bf_key)
            health = api.health()
            print(f"   [PASS] Blockfrost Health: {health}")
            
            # Optional: Check Asset if configured
            policy_id = os.getenv('TARGET_POLICY_ID')
            if policy_id and not policy_id.startswith('asset1...'):
                try:
                    data = fetch_price(policy_id)
                    print(f"   [PASS] Asset Data: {data}")
                except Exception as e:
                    print(f"   [WARN] Asset Lookup Failed: {e}")
            else:
                print("   [INFO] Skipping Asset Lookup (No valid TARGET_POLICY_ID set)")
                
        except Exception as e:
            print(f"   [FAIL] Blockfrost Error: {e}")

    # 3. Check Reddit
    print("\n3. Checking Reddit API...")
    reddit_id = os.getenv('REDDIT_CLIENT_ID')
    if not reddit_id:
        print("   [WARN] REDDIT_CLIENT_ID not set in .env")
    else:
        try:
            count = fetch_reddit_hype(['cardano'])
            print(f"   [PASS] Reddit Hype Score (last hour): {count}")
        except Exception as e:
            print(f"   [FAIL] Reddit Error: {e}")

if __name__ == "__main__":
    verify_sprint1()
