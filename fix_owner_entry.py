import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessOwnerEntry.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace handleCopy to copy full links
old_handle_copy = """  const handleCopy = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };"""

new_handle_copy = """  const handleCopy = (code, type) => {
    const baseUrl = window.location.origin;
    let textToCopy = code;
    if (type === 'player') textToCopy = `${baseUrl}/chess-player-entry?code=${code}`;
    else if (type === 'viewer') textToCopy = `${baseUrl}/chess-viewer-entry?code=${code}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };"""

content = content.replace(old_handle_copy, new_handle_copy)

# Add clear instructions on the buttons
content = content.replace(
    """<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Player Join Code</div>""",
    """<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Player Registration Link</div>"""
)
content = content.replace(
    """<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Spectator / Viewer Code</div>""",
    """<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Spectator / Viewer Link</div>"""
)

# Optional: Add "Link Copied!" text or make the button wider to say "Copy Link"
content = re.sub(
    r"""<button className="btn-outline" onClick={\(\) => handleCopy\(generatedCodes\.player, 'player'\)} style={{ padding: '8px' }}>\s*\{copiedCode === 'player' \? <CheckCircle2 size=\{16\} /> : <Copy size=\{16\}/>\}\s*</button>""",
    """<button className="btn-outline" onClick={() => handleCopy(generatedCodes.player, 'player')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {copiedCode === 'player' ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16}/> Copy Link</>}
                </button>""",
    content
)

content = re.sub(
    r"""<button className="btn-outline" onClick={\(\) => handleCopy\(generatedCodes\.viewer, 'viewer'\)} style={{ padding: '8px' }}>\s*\{copiedCode === 'viewer' \? <CheckCircle2 size=\{16\} /> : <Copy size=\{16\}/>\}\s*</button>""",
    """<button className="btn-outline" onClick={() => handleCopy(generatedCodes.viewer, 'viewer')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {copiedCode === 'viewer' ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16}/> Copy Link</>}
                </button>""",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ChessOwnerEntry.jsx with full copy links")
