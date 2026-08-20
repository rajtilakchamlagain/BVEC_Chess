import os
import re

files = [
    r"C:\Users\rajti\.gemini\antigravity\scratch\ChessVerse\src\pages\ChessOwnerEntry.jsx",
    r"C:\Users\rajti\.gemini\antigravity\scratch\ChessVerse\src\pages\ChessPlayerEntry.jsx",
    r"C:\Users\rajti\.gemini\antigravity\scratch\ChessVerse\src\pages\ChessViewerEntry.jsx"
]

replacements = [
    (r"'#121212'", "'var(--bg-color)'"),
    (r"'#27272a'", "'var(--border-color)'"),
    (r"'var\(--text-main\)'", "mode === 'create' ? 'var(--primary)' : 'var(--text-muted)'"), # fix owner entry tabs
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # specific fix for OwnerEntry buttons
        content = content.replace("background: mode === 'create' ? '#27272a' : 'transparent', color: mode === 'create' ? 'var(--text-main)' : 'var(--text-muted)'", "background: mode === 'create' ? 'var(--bg-color)' : 'transparent', color: mode === 'create' ? 'var(--primary)' : 'var(--text-muted)'")
        content = content.replace("background: mode === 'join' ? '#27272a' : 'transparent', color: mode === 'join' ? 'var(--text-main)' : 'var(--text-muted)'", "background: mode === 'join' ? 'var(--bg-color)' : 'transparent', color: mode === 'join' ? 'var(--primary)' : 'var(--text-muted)'")
        content = content.replace("'#121212'", "'var(--bg-color)'")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
