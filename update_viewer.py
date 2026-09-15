import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { db } from '../firebase';",
    "import { db, auth } from '../firebase';\nimport { onAuthStateChanged } from 'firebase/auth';"
)
content = content.replace(
    "import { Trophy, ArrowLeft, LayoutGrid, Users, Menu, X } from 'lucide-react';",
    "import { Trophy, ArrowLeft, LayoutGrid, Users, Menu, X, BellRing } from 'lucide-react';"
)

# 2. Add State inside component
state_injection = """
  const [user, setUser] = useState(null);
  const [showLiveAlert, setShowLiveAlert] = useState(false);
  const [lastAlertRoundId, setLastAlertRoundId] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Monitor for new rounds published
  useEffect(() => {
    if (!rounds || rounds.length === 0) return;
    const activeRound = rounds[0];
    if (activeRound.status === 'published' && activeRound.id !== lastAlertRoundId) {
      // It's a newly published round!
      setShowLiveAlert(true);
      setLastAlertRoundId(activeRound.id);
    }
  }, [rounds, lastAlertRoundId]);
"""
content = content.replace("const [showSidebar, setShowSidebar] = useState(false);", "const [showSidebar, setShowSidebar] = useState(false);" + state_injection)

# 3. Add the Modal JSX at the very end before the last </div>
modal_jsx = """
      <AnimatePresence>
        {showLiveAlert && roomData?.isOnline && user && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            {(() => {
              const activeRound = rounds[0];
              const me = players.find(p => p.email === user.email);
              if (!me) return (
                <div style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                  <h2>Round {activeRound.roundNumber} Started!</h2>
                  <button onClick={() => setShowLiveAlert(false)} className="btn-primary" style={{ marginTop: '1rem' }}>Dismiss</button>
                </div>
              );
              
              const myPairing = activeRound.pairings.find(p => p.player1 === me.id || p.player2 === me.id);
              if (!myPairing) return (
                <div style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                  <h2>Round {activeRound.roundNumber} Started!</h2>
                  <p>You have a BYE or are not paired this round.</p>
                  <button onClick={() => setShowLiveAlert(false)} className="btn-primary" style={{ marginTop: '1rem' }}>Dismiss</button>
                </div>
              );

              const isWhite = myPairing.player1 === me.id;
              const opponentId = isWhite ? myPairing.player2 : myPairing.player1;
              const opponent = players.find(p => p.id === opponentId);
              const limit = (roomData.timeControlLimit || 10) * 60;
              const inc = roomData.timeControlIncrement || 0;
              const lichessUrl = opponent?.lichessId ? `https://lichess.org/?user=${opponent.lichessId}&clock.limit=${limit}&clock.increment=${inc}#friend` : '#';

              return (
                <motion.div 
                  initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                  style={{ background: 'var(--panel-bg)', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', width: '100%', border: '2px solid #10b981', boxShadow: '0 20px 40px rgba(16,185,129,0.2)' }}
                >
                  <BellRing size={48} color="#10b981" style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
                  <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#10b981' }}>Match Ready!</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    You are playing <strong>{isWhite ? 'White' : 'Black'}</strong> against <br/>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{opponent?.name}</strong>
                  </p>

                  <a 
                    href={lichessUrl} 
                    target="_blank" rel="noreferrer"
                    onClick={(e) => { 
                      setShowLiveAlert(false);
                      if (lichessUrl === '#') { e.preventDefault(); alert('Opponent has no Lichess ID!'); }
                    }}
                    style={{ display: 'block', width: '100%', background: '#10b981', color: '#000', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'none', marginBottom: '1rem' }}
                  >
                    Play on Lichess Now
                  </a>
                  <button onClick={() => setShowLiveAlert(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Dismiss
                  </button>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
"""

content = content.replace("    </div>\n  );\n}\n", modal_jsx + "    </div>\n  );\n}\n")

# 4. Update the Lichess buttons to also use the time controls!
url_white = "players.find(p => p.id === pairing.player2)?.lichessId ? `https://lichess.org/?user=${players.find(p => p.id === pairing.player2)?.lichessId}&clock.limit=${(roomData.timeControlLimit || 10)*60}&clock.increment=${roomData.timeControlIncrement || 0}#friend` : '#'"
content = content.replace("players.find(p => p.id === pairing.player2)?.lichessId ? `https://lichess.org/?user=${players.find(p => p.id === pairing.player2)?.lichessId}#friend` : '#'", url_white)

url_black = "players.find(p => p.id === pairing.player1)?.lichessId ? `https://lichess.org/?user=${players.find(p => p.id === pairing.player1)?.lichessId}&clock.limit=${(roomData.timeControlLimit || 10)*60}&clock.increment=${roomData.timeControlIncrement || 0}#friend` : '#'"
content = content.replace("players.find(p => p.id === pairing.player1)?.lichessId ? `https://lichess.org/?user=${players.find(p => p.id === pairing.player1)?.lichessId}#friend` : '#'", url_black)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessViewerRoom with Live Modals and Time Controls")
