import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add the new fields to the selectedPlayer modal
old_block = """<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AICF ID</span>
                  <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.aicfId || 'None'}</span>
                </div>
              </div>"""

new_block = """<div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AICF ID</span>
                  <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.aicfId || 'None'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Chess.com</span>
                  <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.chesscomId || 'None'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Lichess</span>
                  <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.lichessId || 'None'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fav Opening</span>
                  <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.favOpening || 'None'}</span>
                </div>
                {selectedPlayer.bio && (
                  <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Bio</span>
                    <span style={{ fontWeight: '500', fontSize: '0.9rem', lineHeight: '1.4' }}>{selectedPlayer.bio}</span>
                  </div>
                )}
              </div>"""

if "selectedPlayer.chesscomId" not in content:
    content = content.replace(old_block, new_block)
    
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ChessDashboard.jsx with new player fields")
