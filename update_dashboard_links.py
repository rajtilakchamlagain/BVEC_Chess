import os
import re

dashboard_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure Copy icon is imported
if "Copy" not in content and "lucide-react" in content:
    content = content.replace("import { Users,", "import { Users, Copy, Check,")
    content = content.replace("import { Trophy,", "import { Trophy, Copy, Check,")

# Add state for copy status
if "const [copiedLink, setCopiedLink] = useState(null);" not in content:
    content = content.replace(
        "const [activeTab, setActiveTab] = useState('matchups');",
        "const [activeTab, setActiveTab] = useState('matchups');\n  const [copiedLink, setCopiedLink] = useState(null);"
    )

# Add copy handler
copy_handler = """
  const handleCopyLink = (code, type) => {
    const baseUrl = window.location.origin;
    const url = type === 'player' ? `${baseUrl}/chess-player-entry?code=${code}` : `${baseUrl}/chess-viewer-entry?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };
"""
if "handleCopyLink" not in content:
    content = content.replace("const handleSignOut", copy_handler + "\n  const handleSignOut")

# Replace the player/viewer code display
old_display = "<div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Player Code: <span style={{ color: 'var(--text-main)' }}>{roomData.playerCode}</span> &nbsp;|&nbsp; Viewer Code: <span style={{ color: 'var(--text-main)' }}>{roomData.viewerCode}</span></div>"

new_display = """<div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    Player Code: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{roomData.playerCode}</span>
                    <button onClick={() => handleCopyLink(roomData.playerCode, 'player')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: copiedLink === 'player' ? '#10b981' : 'var(--text-muted)' }} title="Copy Player Link">
                      {copiedLink === 'player' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    Viewer Code: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{roomData.viewerCode}</span>
                    <button onClick={() => handleCopyLink(roomData.viewerCode, 'viewer')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: copiedLink === 'viewer' ? '#10b981' : 'var(--text-muted)' }} title="Copy Viewer Link">
                      {copiedLink === 'viewer' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>"""

content = content.replace(old_display, new_display)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Dashboard updated with Copy Links")
