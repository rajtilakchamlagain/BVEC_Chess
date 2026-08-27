import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the main tag to use spectator-layout and add the hamburger menu
old_main = "<main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>"
new_main = """<main className="spectator-layout" style={{ position: 'relative' }}>
        {/* Mobile Sidebar Overlay */}
        <div className={`sidebar-overlay ${showSidebar ? 'open' : ''}`} onClick={() => setShowSidebar(false)} />
        
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
          {showSidebar ? 'Close' : 'Leaderboard'}
        </button>"""

if old_main in content:
    content = content.replace(old_main, new_main)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected hamburger menu into main.")
