import os

files = [
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessOwnerEntry.jsx",
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx",
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add padding to the top level div so it doesn't touch the screen edge on mobile
    old_div = "<div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>"
    new_div = "<div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>"
    
    if old_div in content:
        content = content.replace(old_div, new_div)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Added padding to entry page wrappers.")
