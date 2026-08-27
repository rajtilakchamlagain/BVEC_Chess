import os

files = [
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessOwnerEntry.jsx",
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx",
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the container div style with className="entry-container"
    old_style = "style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}"
    if old_style in content:
        content = content.replace(old_style, 'className="entry-container"')
    
    old_style_2 = "style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}"
    if old_style_2 in content:
        content = content.replace(old_style_2, 'className="entry-container"')

    # Also make the letterSpacing less dramatic for the codes
    content = content.replace("letterSpacing: '4px'", "letterSpacing: '2px'")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated entry pages to use entry-container class.")
