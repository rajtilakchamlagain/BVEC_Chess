import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add searchQuery state
content = content.replace(
    "const [viewMode, setViewMode] = useState('live'); // 'live' or 'history'",
    "const [viewMode, setViewMode] = useState('live'); // 'live' or 'history'\n  const [searchQuery, setSearchQuery] = useState('');"
)

# 2. Add Search Input above the tabs
content = content.replace(
    "<div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>",
    """<div style={{ marginBottom: '2rem' }}>
              <input 
                type="text" 
                placeholder="Search your name to find your board..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--panel-bg)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>"""
)

# 3. Filter pairings by search query
content = content.replace(
    "{activeRound.pairings.map((pairing, idx) => (",
    "{activeRound.pairings.map((p, i) => ({...p, originalBoard: i+1})).filter(p => p.player1Name.toLowerCase().includes(searchQuery.toLowerCase()) || p.player2Name.toLowerCase().includes(searchQuery.toLowerCase())).map((pairing, idx) => ("
)
# Fix the board number in the mapping (since idx changes after filter)
content = content.replace(
    "BOARD {idx + 1}",
    "BOARD {pairing.originalBoard}"
)

# 4. Filter leaderboard by search query
content = content.replace(
    "{rankedPlayers.map((p, idx) => (",
    "{rankedPlayers.map((p, i) => ({...p, originalRank: i+1})).filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, idx) => ("
)
content = content.replace(
    "{idx + 1}</span>",
    "{p.originalRank}</span>"
)

# 5. Fix mobile layout CSS classes
content = re.sub(
    r"<div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var\(--bg-color\)', color: 'var\(--text-main\)' }}>",
    r'<div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>',
    content
)

content = re.sub(
    r"<div style={{[\s\n]*width: '350px',[\s\n]*borderRight: '1px solid var\(--border-color\)',[\s\n]*background: 'var\(--panel-bg\)',[\s\n]*display: 'flex',[\s\n]*flexDirection: 'column'[\s\n]*}}>",
    r'<div className="spectator-sidebar" style={{ background: "var(--panel-bg)", display: "flex", flexDirection: "column" }}>',
    content
)

content = re.sub(
    r"<div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>",
    r'<div className="spectator-content">',
    content
)

# 6. Decrease font sizes for pairings
content = content.replace("fontSize: '3rem'", "fontSize: '2rem'")
content = content.replace("fontSize: '1.2rem'", "fontSize: '1rem'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Viewer UI successfully.")
