import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\Leaderboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the grouping UID logic
content = content.replace(
    "const uid = (p.rollNumber && p.rollNumber.trim() !== '') ? p.rollNumber.toUpperCase() : p.name.toUpperCase();",
    "const uid = p.email ? p.email.toLowerCase() : `${(p.name || '').trim().toLowerCase()}_${(p.rollNumber || '').trim().toLowerCase()}`;"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Leaderboard UID grouping")
