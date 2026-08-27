import os

# Fix Dashboard Label Badge
db_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"
with open(db_path, 'r', encoding='utf-8') as f:
    db_content = f.read()

bad_span = "background: 'var(--text-main)', color: '#000'"
good_span = "background: '#3b82f6', color: '#ffffff', letterSpacing: '1px', textTransform: 'uppercase'"
if bad_span in db_content:
    db_content = db_content.replace(bad_span, good_span)

with open(db_path, 'w', encoding='utf-8') as f:
    f.write(db_content)

# Add Finals Badge to Viewer Live View
view_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"
with open(view_path, 'r', encoding='utf-8') as f:
    view_content = f.read()

old_h2 = """                <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', margin: 0 }}>
                  Round {activeRound.roundNumber}
                </h2>"""

new_h2 = """                <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
                  Round {activeRound.roundNumber}
                  {activeRound.label && <span style={{ fontSize: '0.9rem', background: '#3b82f6', color: '#ffffff', padding: '4px 12px', borderRadius: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{activeRound.label}</span>}
                </h2>"""

if old_h2 in view_content:
    view_content = view_content.replace(old_h2, new_h2)

with open(view_path, 'w', encoding='utf-8') as f:
    f.write(view_content)

print("Fixed labels.")
