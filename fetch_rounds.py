import requests
import json

project_id = "pitchbid-efd24"
room_code = "7IRTGN"

# Fetch tournament
url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/chess_tournaments/{room_code}/rounds"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    if 'documents' in data:
        for doc in data['documents']:
            print(f"--- Round {doc.get('name')} ---")
            fields = doc.get('fields', {})
            round_num = fields.get('roundNumber', {}).get('integerValue')
            format_type = fields.get('format', {}).get('stringValue')
            pairings = fields.get('pairings', {}).get('arrayValue', {}).get('values', [])
            status = fields.get('status', {}).get('stringValue')
            print(f"Round {round_num} ({format_type}) - Status: {status}")
            print(f"Pairings Count: {len(pairings)}")
            for p in pairings:
                p_fields = p.get('mapValue', {}).get('fields', {})
                p1 = p_fields.get('player1Name', {}).get('stringValue')
                p2 = p_fields.get('player2Name', {}).get('stringValue')
                res = p_fields.get('result', {}).get('stringValue')
                matchType = p_fields.get('matchType', {}).get('stringValue', 'N/A')
                print(f"  {p1} vs {p2} [{res}] (Type: {matchType})")
else:
    print(f"Error: {response.status_code} - {response.text}")
