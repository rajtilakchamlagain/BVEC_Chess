import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\Leaderboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the badges
old_badge = """  const getBadgeIcon = (type) => {
    if (type === 'gold') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' }}>\\u{1F947}</span>;
    if (type === 'silver') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(192,192,192,0.4))' }}>\\u{1F948}</span>;
    if (type === 'bronze') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(205,127,50,0.4))' }}>\\u{1F949}</span>;
  };"""

new_badge = """  const getBadgeIcon = (type) => {
    if (type === 'gold') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' }}>{"\\u{1F947}"}</span>;
    if (type === 'silver') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(192,192,192,0.4))' }}>{"\\u{1F948}"}</span>;
    if (type === 'bronze') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(205,127,50,0.4))' }}>{"\\u{1F949}"}</span>;
  };"""

content = content.replace(old_badge, new_badge)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Leaderboard emojis to valid JSX syntax")
