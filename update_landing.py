import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Import LogIn and UserCircle
if "LogIn" not in content:
    content = content.replace("from 'lucide-react';", ", LogIn, UserCircle } from 'lucide-react';")

# Add Sign In button next to the Chess Club logo
old_nav = """<div className="landing-nav">
            <nav style={{ display: 'flex', gap: '2rem', fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Platform</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Tournaments</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Rules</span>
            </nav>
            <img src="/chesslogo.jpeg" alt="Chess Club" style={{ height: '80px', borderRadius: '8px' }} />
          </div>"""

new_nav = """<div className="landing-nav">
            <nav style={{ display: 'flex', gap: '2rem', fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)', alignItems: 'center' }}>
              <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Platform</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Tournaments</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Rules</span>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button 
                onClick={() => navigate('/chess-owner-entry')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <UserCircle size={20} color="var(--primary)" /> Sign In / Host
              </button>
              <img src="/chesslogo.jpeg" alt="Chess Club" style={{ height: '80px', borderRadius: '8px' }} />
            </div>
          </div>"""

content = content.replace(old_nav, new_nav)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated LandingPage with Sign In button")
