import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\Leaderboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Inside fetchLeaderboard:
# for (const tDoc of tournamentsSnap.docs) {
#   const tName = tDoc.data().name || 'Unknown Tournament';
content = content.replace(
    "const tName = tDoc.data().name || 'Unknown Tournament';",
    "if (tDoc.data().status !== 'finished') continue;\n          const tName = tDoc.data().name || 'Unknown Tournament';"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Leaderboard to only include finished tournaments")
