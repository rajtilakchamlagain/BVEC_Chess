import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\Leaderboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update the disclaimer
content = content.replace(
    "<span><strong>Note:</strong> Players who registered anonymously (without signing in) are hidden from the Global Leaderboard, but they still appear in their specific tournament's local standings.</span>",
    "<span><strong>Note:</strong> Ongoing tournaments and anonymous players (without Google Sign-In) are hidden from the Global Leaderboard. Tournaments are added here only after they have officially concluded!</span>"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated disclaimer")
