import os
import re

files = [
    r"C:\Users\rajti\.gemini\antigravity\scratch\ChessVerse\src\pages\ChessDashboard.jsx",
    r"C:\Users\rajti\.gemini\antigravity\scratch\ChessVerse\src\pages\ChessViewerRoom.jsx"
]

replacements = [
    (r"'#09090b'", "'var(--bg-color)'"),
    (r"'#111'", "'var(--panel-bg)'"),
    (r"'#111111'", "'var(--panel-bg)'"),
    (r"'#00e5ff'", "'var(--secondary)'"),
    (r"'#0055ff'", "'var(--secondary)'"),
    (r"'#ff0080'", "'var(--secondary)'"),
    (r"'#ff8c00'", "'var(--primary)'"),
    (r"'#00b35f'", "'var(--primary)'"),
    (r"'#00ff88'", "'var(--primary)'"),
    (r"rgba\(0,229,255,0\.[0-9]+\)", "var(--border-color)"),
    (r"rgba\(255,255,255,0\.05\)", "var(--border-color)"),
    (r"rgba\(255,255,255,0\.1\)", "var(--border-color)"),
    (r"rgba\(255,255,255,0\.02\)", "rgba(255,255,255,0.02)"), # keep subtle
    (r"rgba\(255,255,255,0\.03\)", "rgba(255,255,255,0.03)"),
    (r"'#fff'", "'var(--text-main)'"),
    (r"'#ededed'", "'var(--text-main)'"),
    (r"'#888'", "'var(--text-muted)'"),
    (r"'#666'", "'#52525b'"),
    (r"borderRadius: '24px'", "borderRadius: '12px'"),
    (r"borderRadius: '16px'", "borderRadius: '8px'"),
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old, new in replacements:
            content = re.sub(old, new, content)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
