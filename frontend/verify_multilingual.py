import requests
import json
import asyncio

API_URL = "http://127.0.0.1:8000/api/verify"

# Test Case: Hindi Claim (False)
# "Earth is flat" in Hindi
hindi_text = "पृथ्वी चपटी है।"

payload = {"text": hindi_text}

try:
    print(f"Sending Hindi text: {hindi_text}")
    print("Waiting for response...")
    response = requests.post(API_URL, json=payload, timeout=60)
    
    if response.status_code == 200:
        data = response.json()
        print("\n--- Response ---")
        print(f"Overall Score: {data.get('overallScore')}")
        for claim in data.get('claims', []):
            print(f"\nClaim: {claim.get('text')}")
            print(f"Status: {claim.get('status')}")
            print(f"Explanation: {claim.get('explanation')}")
            
        print("\n--- Verification ---")
        # Simple check if explanation contains Hindi characters or is in Hindi
        explanation = data.get('claims', [])[0].get('explanation', '') if data.get('claims') else ""
        # Check against English 'flat' just to see if it translated back or kept hindi context
        print(f"Explanation received: {explanation}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

except Exception as e:
    print(f"Request Failed: {e}")
