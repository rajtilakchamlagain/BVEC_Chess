import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the header flex layout wrap on mobile
content = content.replace(
    "className=\"landing-header\" style={{",
    "className=\"landing-header\" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',"
)

# And make the nav gap smaller on mobile
content = content.replace(
    "className=\"landing-nav\" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}",
    "className=\"landing-nav\" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '10px' }}"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LandingPage mobile CSS")
