import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

load_dotenv()

def get_db():
    """
    Returns the MongoDB database instance.
    """
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("Warning: MONGO_URI not found in environment variables.")
    
    client = MongoClient(mongo_uri)
    return client.nexguard_hype_meter

def init_db():
    """
    Initializes the database with necessary collections and indexes.
    """
    try:
        db = get_db()
        
        # Create indexes for efficient time-series querying
        print("Creating indexes...")
        db.token_metrics.create_index([("timestamp", ASCENDING)])
        db.social_metrics.create_index([("timestamp", ASCENDING)])
        
        print("Database initialized successfully. Indexes created on 'timestamp'.")
    except Exception as e:
        print(f"Database initialization failed: {e}")

if __name__ == "__main__":
    init_db()
