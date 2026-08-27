import requests

project_id = "pitchbid-efd24"

# 1. Fetch all tournaments
url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/chess_tournaments"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    documents = data.get('documents', [])
    
    for doc in documents:
        fields = doc.get('fields', {})
        name = fields.get('name', {}).get('stringValue', '')
        doc_id = doc.get('name').split('/')[-1]
        
        # 2. Check if name is one of the ones to delete
        if name in ["DEMO2", "dfgh", "DEMO1"]:
            delete_url = f"https://firestore.googleapis.com/v1/{doc.get('name')}"
            del_resp = requests.delete(delete_url)
            if del_resp.status_code == 200:
                print(f"Deleted tournament '{name}' (ID: {doc_id})")
            else:
                print(f"Failed to delete '{name}': {del_resp.status_code} - {del_resp.text}")
else:
    print(f"Error fetching: {response.status_code} - {response.text}")
