import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <header> with class
content = re.sub(
    r"<header style={{[\s\S]*?padding: '1\.5rem 4rem',[\s\S]*?display: 'flex',[\s\S]*?justifyContent: 'space-between',[\s\S]*?alignItems: 'center',[\s\S]*?background: 'rgba\(255,255,255,0\.9\)',[\s\S]*?backdropFilter: 'blur\(10px\)',[\s\S]*?zIndex: 10[\s\S]*?}}>",
    '<header className="landing-header" style={{ background: \'rgba(255,255,255,0.9)\', backdropFilter: \'blur(10px)\', zIndex: 10 }}>',
    content
)

# Replace <main> with class
content = re.sub(
    r"<main style={{ flex: 1, padding: '6rem 2rem', textAlign: 'center' }}>",
    '<main className="landing-main" style={{ flex: 1, textAlign: \'center\' }}>',
    content
)

# Also check for grid if it was multiline
content = re.sub(
    r"<div style={{ display: 'grid', gridTemplateColumns: 'repeat\(3, 1fr\)', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>",
    '<div className="landing-grid">',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed header and main tags.")
