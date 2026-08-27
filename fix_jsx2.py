import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Revert the wrong replacement in loading state
wrong_block = """<div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>
      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${showSidebar ? 'open' : ''}`} onClick={() => setShowSidebar(false)} />
      
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setShowSidebar(!showSidebar)}>
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
        {showSidebar ? 'Close' : 'Leaderboard'}
      </button>"""

content = content.replace(wrong_block, '<div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>')

# Now inject it into the MAIN return block.
# The main return block is:
# return (
#     <div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>
main_return = """return (
    <div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>"""

correct_block = """return (
    <div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>
      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${showSidebar ? 'open' : ''}`} onClick={() => setShowSidebar(false)} />
      
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setShowSidebar(!showSidebar)}>
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
        {showSidebar ? 'Close' : 'Leaderboard'}
      </button>"""

content = content.replace(main_return, correct_block)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed JSX overlay placement.")
