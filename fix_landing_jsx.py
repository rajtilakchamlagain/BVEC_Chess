import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Header
content = content.replace(
    "<header style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>",
    '<header className="landing-header">'
)
content = content.replace(
    "<div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>",
    '<div className="landing-nav">'
)

# Replace Main padding
content = content.replace(
    "<main style={{ flex: 1, padding: '6rem 2rem', textAlign: 'center' }}>",
    '<main className="landing-main" style={{ flex: 1, textAlign: \'center\' }}>'
)

# Replace Hero Title
old_h2 = "<h2 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--text-main)' }}>"
new_h2 = '<h2 className="landing-hero-title">'
if old_h2 in content:
    content = content.replace(old_h2, new_h2)

# Replace Grid
old_grid = "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>"
new_grid = '<div className="landing-grid">'
if old_grid in content:
    content = content.replace(old_grid, new_grid)

# Replace Footer
old_footer = "<footer style={{ padding: '3rem 4rem', background: '#f1f5f9', borderTop: '1px solid var(--border-color)', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>"
new_footer = '<footer className="landing-footer" style={{ color: \'var(--text-muted)\', fontSize: \'0.9rem\' }}>'
if old_footer in content:
    content = content.replace(old_footer, new_footer)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LandingPage JSX classes.")
