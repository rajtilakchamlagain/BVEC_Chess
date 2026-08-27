import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure we have useState, useEffect
if "useState" not in content:
    content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';")
elif "useEffect" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")
    
# Import Firebase auth
if "onAuthStateChanged" not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport { auth } from '../firebase';\nimport { onAuthStateChanged } from 'firebase/auth';")

# Add state and effect inside the component
auth_logic = """  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
"""

if "const [user, setUser]" not in content:
    content = content.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n" + auth_logic)

# Replace the static button with dynamic one
regex_button = r'<button\s*onClick=\{\(\) => navigate\(\'/chess-owner-entry\'\)\}\s*style=\{\{ display: \'flex\', alignItems: \'center\', gap: \'8px\', background: \'var\(--panel-bg\)\', border: \'1px solid var\(--border-color\)\', padding: \'10px 16px\', borderRadius: \'12px\', cursor: \'pointer\', color: \'var\(--text-main\)\', fontWeight: \'600\', transition: \'all 0\.2s\', boxShadow: \'0 4px 12px rgba\(0,0,0,0\.05\)\' \}\}\s*onMouseEnter=\{e => e\.currentTarget\.style\.borderColor = \'var\(--primary\)\'\}\s*onMouseLeave=\{e => e\.currentTarget\.style\.borderColor = \'var\(--border-color\)\'\}\s*>\s*<UserCircle size=\{20\} color="var\(--primary\)" /> Sign In\s*</button>'

dynamic_button = """{user ? (
              <div 
                onClick={() => navigate('/chess-owner-entry')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--panel-bg)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Host Arena</span>
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
            )}"""

content = re.sub(regex_button, dynamic_button, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated LandingPage to show Google Profile picture")
