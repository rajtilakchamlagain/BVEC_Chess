import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const upperCode = roomCode.toUpperCase();",
    "const upperCode = roomCode.trim().toUpperCase();"
)

content = content.replace(
    "const upperCode = code.toUpperCase();",
    "const upperCode = code.trim().toUpperCase();"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added trim to viewer code")
