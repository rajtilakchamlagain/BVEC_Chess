import os
import re

# We will modify the three entry files to have a 3D Google Form look and read URL params.
files_to_update = [
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx",
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx",
    r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessOwnerEntry.jsx"
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Import useSearchParams if missing
    if "useSearchParams" not in content and "react-router-dom" in content:
        content = content.replace("useNavigate } from 'react-router-dom';", "useNavigate, useSearchParams } from 'react-router-dom';")
        content = content.replace("useNavigate} from 'react-router-dom';", "useNavigate, useSearchParams } from 'react-router-dom';")

    # Add searchParams to component initialization
    if "const [searchParams] = useSearchParams();" not in content:
        content = re.sub(
            r"(const navigate = useNavigate\(\);)",
            r"\1\n  const [searchParams] = useSearchParams();",
            content
        )
        
    # Pre-fill roomCode from URL
    content = re.sub(
        r"const \[roomCode, setRoomCode\] = useState\(''\);",
        r"const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');",
        content
    )
    content = re.sub(
        r"const \[viewerCode, setViewerCode\] = useState\(''\);",
        r"const [viewerCode, setViewerCode] = useState(searchParams.get('code') || '');",
        content
    )

    # Automatically verify code if it exists on mount (only for player and viewer)
    # We will just let the user see the pre-filled code and click "Verify" or we can auto-trigger it.
    # To be safe and avoid infinite loops, we just leave it pre-filled so they just have to click 'Verify'.

    # Apply 3D Google Form aesthetic (Accent top border, soft large shadow, rounder corners)
    # Replace the old rigid styling
    old_style_regex = r"padding:\s*'2\.5rem',\s*background:\s*'var\(--panel-bg\)',\s*borderRadius:\s*'12px',\s*border:\s*'1px solid var\(--border-color\)',\s*boxShadow:\s*'0 20px 40px rgba\(0,0,0,0\.4\)'"
    google_form_style = "padding: '3rem 2.5rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', borderTop: '10px solid var(--primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', transform: 'translateY(-5px)', transition: 'transform 0.3s ease'"
    
    content = re.sub(old_style_regex, google_form_style, content)

    # Some files might have already been changed to className="entry-container". Let's check for entry-container too.
    content = content.replace("className: 'entry-container', style: { width: '400px', padding: '2rem' }", "className: 'entry-container', style: { width: '400px', padding: '3rem 2.5rem', borderTop: '10px solid var(--primary)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }")
    content = content.replace("className=\"entry-container\"", "className=\"entry-container\" style={{ borderTop: '10px solid var(--primary)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', transform: 'translateY(-5px)' }}")

    # Specifically for PlayerEntry, the label says "Join Tournament". We can make the header look more premium.
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated Entry files with URL parameters and 3D Google Form style.")
