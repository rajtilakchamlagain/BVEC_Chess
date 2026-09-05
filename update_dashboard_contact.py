import re

def update_dashboard():
    path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    contact_block = """
              {selectedPlayer.contactNumber && (
                <div style={{ marginBottom: '1.5rem', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contact Info ({selectedPlayer.contactType})</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>{selectedPlayer.contactNumber}</div>
                </div>
              )}
"""

    # Insert it right before the stats grid in the player modal
    content = content.replace(
        '<div style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'1rem\', marginBottom: \'1.5rem\' }}>',
        contact_block + '\n              <div style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'1rem\', marginBottom: \'1.5rem\' }}>'
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_dashboard()
print("Updated ChessDashboard")
