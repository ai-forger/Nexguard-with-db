import time
import os
from datetime import datetime, timezone
from blockfrost import BlockFrostApi, ApiError
import praw
from dotenv import load_dotenv
from database import get_db

# Load environment variables
load_dotenv()

# --- Configuration ---
BLOCKFROST_API_KEY = os.getenv('BLOCKFROST_API_KEY')
REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT', 'NexGuard/1.0')
TARGET_POLICY_ID = os.getenv('TARGET_POLICY_ID', 'asset1...') # Default placeholder

# --- API Initialization ---
blockfrost = None
if BLOCKFROST_API_KEY:
    try:
        blockfrost = BlockFrostApi(project_id=BLOCKFROST_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Blockfrost: {e}")

reddit = None
if REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET:
    try:
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT
        )
    except Exception as e:
        print(f"Failed to initialize Reddit: {e}")

# --- Helper Functions ---

def fetch_price(policy_id):
    """
    Get current price/volume. 
    Note: Blockfrost Asset API returns supply, not market price in ADA.
    For Sprint 1, we will store the supply/quantity as a metric.
    """
    if not blockfrost:
        return None
    
    try:
        # Fetch asset details
        # If policy_id is actually an asset ID (concatenation of policy_id and hex-encoded asset_name), this works.
        # If it's just policy_id, we might need to list assets.
        # Assuming the user provides a full Asset ID (e.g. 'asset1...')
        asset = blockfrost.asset(policy_id)
        
        return {
            "price": 0, # Placeholder: Needs DEX integration for real price
            "volume": asset.quantity, # Using quantity/supply as available metric
            "asset_id": asset.asset
        }
    except ApiError as e:
        print(f"Blockfrost API Error: {e}")
        return None
    except Exception as e:
        print(f"Error fetching price: {e}")
        return None

def fetch_reddit_hype(keywords):
    """
    Count posts in the last 1 hour containing the keywords in 'cardano' or 'cryptocurrency'.
    """
    if not reddit:
        return 0
    
    try:
        count = 0
        query = ' OR '.join(keywords)
        # Search recent posts
        subreddit = reddit.subreddit('cardano+cryptocurrency')
        
        # 'time_filter' in search() filters by creation time (hour, day, etc.)
        for submission in subreddit.search(query, sort='new', time_filter='hour', limit=100):
            count += 1
            
        return count
    except Exception as e:
        print(f"Reddit API Error: {e}")
        return 0

def run_ingestion():
    db = get_db()
    print(f"Starting Ingestion Loop... (Target: {TARGET_POLICY_ID})")
    
    keywords = ['cardano', 'ada', 'nexguard']
    
    while True:
        try:
            now = datetime.now(timezone.utc)
            
            # 1. Fetch Data
            price_data = fetch_price(TARGET_POLICY_ID)
            hype_score = fetch_reddit_hype(keywords)
            
            # 2. Insert into MongoDB
            if price_data:
                db.token_metrics.insert_one({
                    "policy_id": TARGET_POLICY_ID,
                    "price": price_data['price'],
                    "volume": price_data['volume'],
                    "timestamp": now
                })
            
            db.social_metrics.insert_one({
                "keywords": keywords,
                "hype_score": hype_score,
                "source": "reddit",
                "timestamp": now
            })
            
            # 3. Log
            price_display = f"${price_data['price']} (Vol: {price_data['volume']})" if price_data else "N/A"
            print(f"[{now.strftime('%H:%M:%S')}] Ingested [{TARGET_POLICY_ID[:10]}...]: Price {price_display} | Hype Score {hype_score}")
            
        except Exception as e:
            print(f"Ingestion Loop Error: {e}")
        
        # Wait 60 seconds
        time.sleep(60)

if __name__ == "__main__":
    run_ingestion()
