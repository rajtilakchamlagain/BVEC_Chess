import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add showUserMenu state if missing
if "showUserMenu" not in content:
    content = content.replace("const [user, setUser] = useState(null);", "const [user, setUser] = useState(null);\n  const [showUserMenu, setShowUserMenu] = useState(false);")

# Find the entire <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}> block
regex = r'<div style={{ display: \'flex\', alignItems: \'center\', gap: \'1\.5rem\' }}>.*?<img src="/chesslogo\.jpeg" alt="Chess Club" style={{ height: \'80px\', borderRadius: \'8px\' }} />\s*</div>'

new_div = """<div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {user ? (
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setShowUserMenu(!showUserMenu)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--panel-bg)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Account</span>
                  </div>
                  {showUserMenu && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: '160px', zIndex: 100 }}>
                      <div 
                        onClick={() => { setShowUserMenu(false); navigate('/profile'); }} 
                        style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        My Profile
                      </div>
                      <div 
                        onClick={() => { setShowUserMenu(false); navigate('/chess-owner-entry'); }} 
                        style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Host Arena
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/chess-owner-entry')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <UserCircle size={20} color="var(--primary)" /> Sign In
                </button>
              )}
              <img src="/chesslogo.jpeg" alt="Chess Club" style={{ height: '80px', borderRadius: '8px' }} />
            </div>"""

content = re.sub(regex, new_div, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Forced replacement of user button block with dropdown block in LandingPage")
