import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the Lichess button URLs to show a helpful message if lichessId is missing
bad_url1 = "`https://lichess.org/?user=${players.find(p => p.id === pairing.player2)?.lichessId}#friend`"
good_url1 = "players.find(p => p.id === pairing.player2)?.lichessId ? `https://lichess.org/?user=${players.find(p => p.id === pairing.player2)?.lichessId}#friend` : '#'"
content = content.replace(bad_url1, good_url1)

bad_url2 = "`https://lichess.org/?user=${players.find(p => p.id === pairing.player1)?.lichessId}#friend`"
good_url2 = "players.find(p => p.id === pairing.player1)?.lichessId ? `https://lichess.org/?user=${players.find(p => p.id === pairing.player1)?.lichessId}#friend` : '#'"
content = content.replace(bad_url2, good_url2)

# Also add onClick to alert if missing
# We can just add an onClick handler
def add_onclick(match):
    return match.group(0) + " onClick={(e) => { if (e.currentTarget.getAttribute('href') === '#') { e.preventDefault(); alert('This player did not provide a Lichess Username during registration.'); } }}"

content = re.sub(r'target="_blank" rel="noreferrer"', add_onclick, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessViewerRoom with safe Lichess URLs")
