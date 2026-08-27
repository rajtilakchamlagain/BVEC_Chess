import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\index.css"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

mobile_css = """
@media (max-width: 768px) {
  .premium-card {
    padding: 1.5rem !important;
  }
  
  .premium-card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }
  
  .premium-card-icon svg {
    width: 24px;
    height: 24px;
  }
  
  .entry-container {
    padding: 1.5rem !important;
    border-radius: 16px !important;
  }
  
  .landing-main {
    padding: 3rem 1rem !important;
  }
  
  /* Fix entry pages alignment on small screens */
  .premium-input {
    padding: 0.8rem 1rem !important;
    font-size: 0.95rem !important;
  }
}
"""

if "/* Fix entry pages alignment on small screens */" not in content:
    content += mobile_css

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added mobile responsiveness for premium cards.")
