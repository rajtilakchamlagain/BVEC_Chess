import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace `{step === 2 && roomData && (` with the login wall logic
new_step_2 = """
        {step === 2 && roomData && (
          <div className="animate-fade-in">
            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Registering for</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{roomData.name}</div>
            </div>

            {!user ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Authentication Required</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You must sign in with your Google account to register for this tournament.</p>
                <button 
                  onClick={handleAutofillLogin}
                  style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px' }} />
                  Sign in with Google
                </button>
              </div>
            ) : (
              <>
"""

content = content.replace(
    """        {step === 2 && roomData && (
          <div className="animate-fade-in">
            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Registering for</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{roomData.name}</div>
            </div>""",
    new_step_2
)

# And close the fragment where step 2 ends
# Let's find the end of step 2. It ends right before `{step === 3 && (`
content = content.replace(
    """              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          )}

        {step === 3 && (""",
    """              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </button>
              </>
            )}
            </div>
          )}

        {step === 3 && ("""
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
