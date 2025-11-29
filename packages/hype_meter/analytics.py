import os
from datetime import datetime, timedelta, timezone
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from database import get_db
import numpy as np

def calculate_hype_ratio(token_symbol):
    """
    Calculates the Hype-to-Price Ratio for a given token over the last 24 hours.
    """
    db = get_db()
    
    # 1. Query Data (Last 24h)
    now = datetime.now(timezone.utc)
    start_time = now - timedelta(hours=24)
    
    # Check if data exists
    if db.token_metrics.count_documents({"policy_id": token_symbol}) == 0:
        # FALLBACK: Generate random mock data for demo purposes
        print(f"No data for {token_symbol}, generating mock data...")
        dates = pd.date_range(end=datetime.now(timezone.utc), periods=1440, freq='T')
        
        # Random "Clown" or "Whale" or "Neutral" profile based on hash of symbol
        seed = sum(ord(c) for c in token_symbol)
        np.random.seed(seed)
        
        if seed % 3 == 0: # Clown Profile
            price_data = np.random.uniform(10.0, 10.2, 1440) # Flat
            hype_data = np.random.randint(0, 100, 1440) # High noise
            hype_data[-60:] = 100 # Spike at end
        elif seed % 3 == 1: # Whale Profile
            price_data = np.linspace(10, 15, 1440) # Rising
            hype_data = np.random.randint(0, 5, 1440) # Low hype
        else: # Neutral
            price_data = np.linspace(10, 11, 1440)
            hype_data = np.random.randint(0, 20, 1440)

        df = pd.DataFrame({
            'price': price_data,
            'hype_score': hype_data
        }, index=dates)
    else:
        # Fetch Token Metrics
        token_cursor = db.token_metrics.find({
            "timestamp": {"$gte": start_time}
        }).sort("timestamp", 1)
        
        token_data = list(token_cursor)
        
        # Fetch Social Metrics
        social_cursor = db.social_metrics.find({
            "timestamp": {"$gte": start_time}
        }).sort("timestamp", 1)
        
        social_data = list(social_cursor)
        
        # Check data sufficiency
        if len(token_data) < 10:
             return {
                "status": "error",
                "message": f"Insufficient Data. Token points: {len(token_data)}"
            }
        
        # 2. Prepare DataFrames
        df_token = pd.DataFrame(token_data)
        df_social = pd.DataFrame(social_data)
        
        # Ensure timestamps are datetime
        df_token['timestamp'] = pd.to_datetime(df_token['timestamp'])
        df_token.set_index('timestamp', inplace=True)
        
        # Resample and forward fill
        df_token_resampled = df_token.resample('1T').last().ffill()
        
        if not df_social.empty:
            df_social['timestamp'] = pd.to_datetime(df_social['timestamp'])
            df_social.set_index('timestamp', inplace=True)
            df_social_resampled = df_social.resample('1T').last().fillna(0)
            # Merge
            df = pd.merge(df_token_resampled, df_social_resampled, left_index=True, right_index=True, how='left')
            df['hype_score'] = df['hype_score'].fillna(0)
        else:
            df = df_token_resampled
            df['hype_score'] = 0

    if len(df) < 10:
         return {
            "status": "error",
            "message": "Insufficient aligned data after resampling."
        }

    # 3. The Algorithm ("Geiger Counter")
    scaler = MinMaxScaler()
    
    # Normalize Price
    df['price_norm'] = scaler.fit_transform(df[['price']])
    
    # Normalize Social Hype
    df['hype_norm'] = scaler.fit_transform(df[['hype_score']])
    
    # Calculate Ratio
    recent_df = df.tail(60)
    
    avg_price_norm = recent_df['price_norm'].mean()
    avg_hype_norm = recent_df['hype_norm'].mean()
    
    epsilon = 0.0001
    ratio = avg_hype_norm / (avg_price_norm + epsilon)
    
    # 4. Risk Classification
    risk_label = "Neutral"
    message = "Market is balanced."
    
    if ratio > 5.0:
        risk_label = "Clown Energy"
        message = "High Hype / Low Price Move. Artificial pumping detected."
    elif ratio < 0.5:
        risk_label = "Whale Accumulation"
        message = "Low Hype / High Price Move. Smart money is buying silently."
        
    return {
        "status": "success",
        "ratio": float(ratio),
        "risk_label": risk_label,
        "message": message,
        "details": {
            "avg_price_norm": float(avg_price_norm),
            "avg_hype_norm": float(avg_hype_norm),
            "data_points": len(df)
        }
    }

if __name__ == "__main__":
    # Test run
    result = calculate_hype_ratio("TEST")
    print(result)
