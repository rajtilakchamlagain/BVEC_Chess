import requests
import json

project_id = "pitchbid-efd24"
room_code = "7IRTGN"
round_id = "round_4"

# The 4 players
f1_id = "player_cpnglnis9"
f1_name = "Faridul Islam"
f2_id = "player_n3r7pdh17"
f2_name = "Shayon Islam"

b1_id = "player_nz8yx1u86"
b1_name = "Sumit Kumar Roy"
b2_id = "player_ifl0iaocu"
b2_name = "Mrinmoy Deka"

# Construct the PATCH body
payload = {
    "fields": {
        "roundNumber": {"integerValue": "4"},
        "format": {"stringValue": "knockout"},
        "status": {"stringValue": "published"},
        "label": {"stringValue": "Finals"},
        "pairings": {
            "arrayValue": {
                "values": [
                    {
                        "mapValue": {
                            "fields": {
                                "player1": {"stringValue": f1_id},
                                "player1Name": {"stringValue": f1_name},
                                "player1Color": {"stringValue": "white"},
                                "player2": {"stringValue": f2_id},
                                "player2Name": {"stringValue": f2_name},
                                "player2Color": {"stringValue": "black"},
                                "result": {"stringValue": "pending"},
                                "matchType": {"stringValue": "Grand Final"}
                            }
                        }
                    },
                    {
                        "mapValue": {
                            "fields": {
                                "player1": {"stringValue": b1_id},
                                "player1Name": {"stringValue": b1_name},
                                "player1Color": {"stringValue": "white"},
                                "player2": {"stringValue": b2_id},
                                "player2Name": {"stringValue": b2_name},
                                "player2Color": {"stringValue": "black"},
                                "result": {"stringValue": "pending"},
                                "matchType": {"stringValue": "3rd Place Match"}
                            }
                        }
                    }
                ]
            }
        }
    }
}

url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/chess_tournaments/{room_code}/rounds/{round_id}?updateMask.fieldPaths=pairings&updateMask.fieldPaths=label"

response = requests.patch(url, json=payload)

if response.status_code == 200:
    print("Successfully updated Round 4!")
else:
    print(f"Error: {response.status_code} - {response.text}")
