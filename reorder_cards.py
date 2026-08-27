import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Use regex to find the entire Action Cards div and replace it
pattern = r"\{/\* Minimalist Action Cards \*/\}(.*?)</motion\.div>\s*</div>\s*</div>\s*\{/\* Footer \*/\}"

new_cards = """{/* Minimalist Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
          
          {/* Main Card: Tournaments (Spectator) */}
          <motion.div 
            className="premium-card"
            style={{ width: '100%', maxWidth: '630px' }}
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#94a3b8' }} title="Access live scores, pairings, and real-time standings as they happen.">
              <Info size={20} />
            </div>
            <div className="premium-card-icon">
              <Eye size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '800' }}>Tournaments</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' }}>Follow live scores, view ongoing match results, and check real-time standings from your phone.</p>
            <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Enter Room <ArrowRight size={16} />
            </div>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', width: '100%', maxWidth: '630px' }}>
            
            {/* Card 2: Host */}
            <motion.div 
              className="premium-card"
              style={{ flex: 1, minWidth: '280px' }}
              onClick={() => navigate('/chess-owner-entry')}
            >
              <div className="premium-card-icon">
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Host Dashboard</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Create a tournament, manage pairings, and update live results.</p>
              <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Open Dashboard <ArrowRight size={16} />
              </div>
            </motion.div>

            {/* Card 3: Player */}
            <motion.div 
              className="premium-card"
              style={{ flex: 1, minWidth: '280px' }}
              onClick={() => navigate('/chess-player-entry')}
            >
              <div className="premium-card-icon">
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Player Registration</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Enter your details to join an active tournament lobby.</p>
              <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Register Here <ArrowRight size={16} />
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Footer */}"""

if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, new_cards, content, flags=re.DOTALL)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced cards layout successfully.")
else:
    print("Could not find the cards block via regex.")
