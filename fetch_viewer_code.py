import requests
import json

project_id = "pitchbid-efd24"
room_code = "7IRTGN"

# Fetch tournament
url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/chess_tournaments/{room_code}"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    fields = data.get('fields', {})
    viewer_code = fields.get('viewerCode', {}).get('stringValue', 'Not found')
    player_code = fields.get('playerCode', {}).get('stringValue', 'Not found')
    print(f"Viewer Code: {viewer_code}")
    print(f"Player Code: {player_code}")
else:
    print(f"Error: {response.status_code} - {response.text}")
