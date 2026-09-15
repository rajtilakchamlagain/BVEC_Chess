import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\Leaderboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Emojis and bullets might have been corrupted.
# Let's replace getBadgeIcon entirely
badge_func = """
  const getBadgeIcon = (type) => {
    if (type === 'gold') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' }}>Gold</span>;
    if (type === 'silver') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(192,192,192,0.4))' }}>Silver</span>;
    if (type === 'bronze') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(205,127,50,0.4))' }}>Bronze</span>;
  };
"""

# We'll just replace the whole function block. It's safer.
# We will use regex to find it.
content = re.sub(r"const getBadgeIcon = \(type\) => \{[\s\S]*?\};\n", badge_func, content)

# And replace the bullet point
content = re.sub(r"\{player\.course \|\| 'B\.Tech'\} .*? \{player\.rollNumber", "{player.course || 'B.Tech'} - {player.rollNumber", content)

# Also, there's a risk that some player has an email that is not a string, causing `.toLowerCase()` to crash.
# Let's make the uid generation safer.
content = content.replace(
    "const uid = p.email.toLowerCase();",
    "if (typeof p.email !== 'string') return;\n            const uid = p.email.toLowerCase();"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Leaderboard")
