import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\App.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if "import Leaderboard from './pages/Leaderboard';" not in content:
    content = content.replace(
        "import ChessPlayerEntry from './pages/ChessPlayerEntry';",
        "import ChessPlayerEntry from './pages/ChessPlayerEntry';\nimport Leaderboard from './pages/Leaderboard';"
    )

# Add route
if "<Route path=\"/leaderboard\" element={<Leaderboard />} />" not in content:
    content = content.replace(
        "<Route path=\"/profile\" element={<ProfilePage />} />",
        "<Route path=\"/profile\" element={<ProfilePage />} />\n        <Route path=\"/leaderboard\" element={<Leaderboard />} />"
    )

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.jsx")
