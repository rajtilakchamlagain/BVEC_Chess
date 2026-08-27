import requests
import json

project_id = "pitchbid-efd24"
room_code = "7IRTGN"

# Fetch players
url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/chess_tournaments/{room_code}/players"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    if 'documents' in data:
        for doc in data['documents']:
            fields = doc.get('fields', {})
            name = fields.get('name', {}).get('stringValue')
            player_id = doc.get('name').split('/')[-1]
            print(f"ID: {player_id} - Name: {name}")
else:
    print(f"Error: {response.status_code} - {response.text}")
