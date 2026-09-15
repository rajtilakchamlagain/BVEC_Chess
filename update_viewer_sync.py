import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

challenge_ui = """
                        {roomData?.isOnline && pairing.result === 'pending' && (
                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
                            <a href={`https://lichess.org/?user=${players.find(p => p.id === pairing.player2)?.lichessId}#friend`} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', background: '#3b82f6', color: '#fff', padding: '6px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>Challenge Black</a>
                            <a href={`https://lichess.org/?user=${players.find(p => p.id === pairing.player1)?.lichessId}#friend`} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', background: '#fff', color: '#000', padding: '6px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' }}>Challenge White</a>
                          </div>
                        )}
                      </motion.div>
"""

content = content.replace(
    "                      </motion.div>",
    challenge_ui
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessViewerRoom")
