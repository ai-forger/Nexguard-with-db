from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_db
from analytics import calculate_hype_ratio
from datetime import datetime, timedelta, timezone

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "online"}

@app.get("/meter/{token_id}")
def get_hype_meter(token_id: str):
    """
    Returns the Hype-to-Price Ratio and Risk Analysis.
    """
    try:
        result = calculate_hype_ratio(token_id)
        if result['status'] == 'error':
            raise HTTPException(status_code=400, detail=result['message'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{token_id}")
def get_history(token_id: str):
    """
    Returns the last 50 raw data points for charting.
    """
    db = get_db()
    
    # Fetch last 50 token metrics
    token_cursor = db.token_metrics.find(
        {"policy_id": token_id}
    ).sort("timestamp", -1).limit(50)
    
    token_data = list(token_cursor)
    
    # Fetch last 50 social metrics
    # Note: Social metrics might not be strictly 1:1 with token metrics if sources differ,
    # but for simplicity we fetch the latest.
    social_cursor = db.social_metrics.find().sort("timestamp", -1).limit(50)
    social_data = list(social_cursor)
    
    # Format for frontend
    history = []
    # Reverse to show oldest first
    for t in reversed(token_data):
        # Find closest social metric? Or just assume time alignment?
        # For Sprint 3, let's just return the token price history and overlay hype if possible.
        # Or better, return a merged view.
        
        history.append({
            "timestamp": t['timestamp'].isoformat(),
            "price": t['price'],
            "volume": t['volume']
        })
        
    return {
        "token_id": token_id,
        "history": history,
        "social_latest": [
            {"timestamp": s['timestamp'].isoformat(), "hype_score": s['hype_score']} 
            for s in reversed(social_data)
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
