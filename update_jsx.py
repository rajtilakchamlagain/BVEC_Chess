import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Menu to imports
if "Menu" not in content:
    content = content.replace("Trophy, ArrowLeft, LayoutGrid, Users", "Trophy, ArrowLeft, LayoutGrid, Users, Menu, X")

# 2. Add state
if "showSidebar" not in content:
    content = content.replace(
        "const [searchQuery, setSearchQuery] = useState('');",
        "const [searchQuery, setSearchQuery] = useState('');\n  const [showSidebar, setShowSidebar] = useState(false);"
    )

# 3. Add overlay and button to JSX, and dynamic classes to sidebar
content = content.replace(
    '<div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>',
    """<div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>
      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${showSidebar ? 'open' : ''}`} onClick={() => setShowSidebar(false)} />
      
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setShowSidebar(!showSidebar)}>
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
        {showSidebar ? 'Close' : 'Leaderboard'}
      </button>"""
)

content = content.replace(
    '<div className="spectator-sidebar" style={{ background: "var(--panel-bg)", display: "flex", flexDirection: "column" }}>',
    '<div className={`spectator-sidebar ${showSidebar ? \'open\' : \'\'}`}>'
)

# Fix sidebar inline styles since we moved them to CSS class
content = content.replace(
    '<div className={`spectator-sidebar ${showSidebar ? \'open\' : \'\'}`} style={{ background: "var(--panel-bg)", display: "flex", flexDirection: "column" }}>',
    '<div className={`spectator-sidebar ${showSidebar ? \'open\' : \'\'}`}>'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("ViewerRoom JSX updated successfully.")
