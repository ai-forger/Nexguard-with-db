import requests
import random
import string

def verify_fallback():
    # Generate random token ID
    token_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    print(f"Testing Hype Meter for unknown token: {token_id}")
    
    try:
        res = requests.get(f"http://localhost:8000/meter/{token_id}")
        if res.status_code == 200:
            data = res.json()
            print("[PASS] API returned 200 OK")
            print(f"   Status: {data['status']}")
            print(f"   Risk Label: {data['risk_label']}")
            print(f"   Message: {data['message']}")
            
            if data['status'] == 'success':
                print("[SUCCESS] Fallback logic is working. Random token generated valid analysis.")
            else:
                print("[FAIL] API returned error status.")
        else:
            print(f"[FAIL] API returned {res.status_code}: {res.text}")
    except Exception as e:
        print(f"[FAIL] Connection Error: {e}")

if __name__ == "__main__":
    verify_fallback()
