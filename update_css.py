import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\index.css"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace .premium-input
old_premium_input = """.premium-input {
  background: #ffffff;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.premium-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}"""

new_premium_input = """.premium-input {
  background: #f4f7fb;
  border: 2px solid transparent;
  color: #0f172a;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
}

.premium-input:focus {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12), inset 0 2px 4px rgba(0,0,0,0.01);
}
.premium-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.premium-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.premium-card:hover {
  transform: translateY(-5px);
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
}

.premium-card-icon {
  background: linear-gradient(135deg, var(--primary), #3b82f6);
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
}

.premium-card-icon svg {
  color: #ffffff;
}

.entry-container {
  width: 100%;
  max-width: 480px;
  padding: 3rem;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}
"""

if old_premium_input in content:
    content = content.replace(old_premium_input, new_premium_input)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.css with sleek premium classes")
