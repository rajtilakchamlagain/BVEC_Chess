import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace minmax(450px, 1fr) with minmax(280px, 1fr)
content = content.replace("minmax(450px, 1fr)", "minmax(280px, 1fr)")

# Replace minmax(300px, 1fr) with minmax(280px, 1fr)
content = content.replace("minmax(300px, 1fr)", "minmax(280px, 1fr)")

# Reduce some internal padding on the cards from 1.5rem / 1rem to slightly smaller for mobile
content = content.replace("padding: '1.5rem',", "padding: '1.2rem',")
content = content.replace("padding: '2rem',", "padding: '1.5rem',")

# Ensure the header doesn't overflow
# header padding is '1.5rem 3rem'
content = content.replace("padding: '1.5rem 3rem'", "padding: '1rem'")

# Optional: Add box-sizing border-box explicitly if it's missing (though Vite/Tailwind/Reset usually handles it)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Viewer UI widths successfully.")
