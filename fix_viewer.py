import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace hardcoded dark colors
    replacements = {
        "'#050505'": "'var(--bg-color)'",
        "'rgba(255,255,255,0.02)'": "'var(--panel-bg)'",
        "'rgba(255,255,255,0.01)'": "'var(--panel-bg)'",
        "'rgba(255,255,255,0.03)'": "'var(--panel-bg)'",
        "'rgba(0,0,0,0.2)'": "'var(--bg-color)'",
        "'rgba(255,255,255,0.2)'": "'var(--border-color)'",
        "'#111'": "'var(--border-color)'",
        "'#333'": "'var(--text-main)'",
        "'#1a1a1a'": "'var(--text-main)'",
        "'#555'": "'var(--border-color)'",
        "rgba(255,215,0,0.1)": "rgba(255,215,0,0.3)" # Make gold gradient more visible in light mode
    }

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Also add "Last Updated" text
    # Search for <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' ... Current Matches</div>
    if "Current Matches</div>" in content:
        content = content.replace(
            "Current Matches</div>",
            "Current Matches</div>\n                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>Live • Auto-updating</div>"
        )
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Replaced colors successfully.")
else:
    print("File not found.")
