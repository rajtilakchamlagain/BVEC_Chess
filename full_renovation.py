import os
import re
import glob

pages_dir = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages"
jsx_files = glob.glob(os.path.join(pages_dir, "*.jsx"))

for file_path in jsx_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix inputs: replace all inline dark mode inputs with premium-input
    content = re.sub(
        r"style={{[^}]*background:\s*['\"]#000['\"][^}]*}}", 
        r'className="premium-input"', 
        content
    )
    content = re.sub(
        r"style={{[^}]*background:\s*['\"]#1a1a1a['\"][^}]*}}", 
        r'className="premium-input"', 
        content
    )
    # Generic inputs with padding and border
    content = re.sub(
        r"style={{[^}]*padding:\s*['\"]10px['\"][^}]*border:\s*['\"]1px solid #ccc['\"][^}]*}}",
        r'className="premium-input"',
        content
    )
    
    # Fix dark modals / panel backgrounds that still use hardcoded dark colors
    content = re.sub(
        r"background:\s*['\"]#111['\"]",
        r"background: 'var(--panel-bg)'",
        content
    )
    content = re.sub(
        r"background:\s*['\"]#222['\"]",
        r"background: 'var(--bg-color)'",
        content
    )

    # Standardize buttons
    # Any button with background: 'var(--primary)' -> we add a class or just keep it but ensure color is white
    # Let's just fix the dark text on dark inputs by ensuring all inputs use premium-input where possible.
    content = content.replace("background: '#000'", "background: '#fff'")
    content = content.replace("border: '1px solid #333'", "border: '1px solid var(--border-color)'")
    content = content.replace("border: '1px solid #444'", "border: '1px solid var(--border-color)'")
    content = content.replace("color: '#fff'", "color: 'var(--text-main)'")
    content = content.replace("color: '#ccc'", "color: 'var(--text-muted)'")
    content = content.replace("color: '#aaa'", "color: 'var(--text-muted)'")
    
    # Convert old inline panel styles to premium-card or entry-container if they have massive box shadows
    content = content.replace(
        "background: 'var(--panel-bg)', width: '400px', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)'",
        "className: 'entry-container', style: { width: '400px', padding: '2rem' }"
    )
    
    # Fix the generic Table headers (th) and cells (td) inline styling in Dashboard
    content = content.replace(
        "borderBottom: '1px solid #333'", 
        "borderBottom: '1px solid var(--border-color)'"
    )
    content = content.replace(
        "borderBottom: '1px solid #444'", 
        "borderBottom: '1px solid var(--border-color)'"
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied full light theme & premium renovations to all inner pages.")
