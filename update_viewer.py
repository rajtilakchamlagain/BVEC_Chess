import re

def update_viewer_room():
    path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(
        "<FinalResults rankedPlayers={rankedPlayers} />",
        "<FinalResults rankedPlayers={rankedPlayers} roomData={roomData} />"
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_viewer_room()
print("Updated ChessViewerRoom")
