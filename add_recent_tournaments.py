import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add useEffect to imports
if "import { useState }" in content:
    content = content.replace("import { useState }", "import { useState, useEffect }")

# Add limit, orderBy, onSnapshot to firestore imports
if "import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';" in content:
    content = content.replace(
        "import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';",
        "import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, onSnapshot } from 'firebase/firestore';"
    )

# Add state and useEffect for recent tournaments
state_anchor = "  const [isLoading, setIsLoading] = useState(false);"
state_injection = """  const [isLoading, setIsLoading] = useState(false);
  const [recentTournaments, setRecentTournaments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'chess_tournaments'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tours = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentTournaments(tours);
    });
    
    return () => unsubscribe();
  }, []);
"""
if state_anchor in content:
    content = content.replace(state_anchor, state_injection)

# Add the UI for recent tournaments
ui_anchor = """          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }} 
            onClick={handleJoin} 
            disabled={roomCode.length < 4 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Enter Spectator View'}
          </button>
        </div>"""

ui_injection = """          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }} 
            onClick={handleJoin} 
            disabled={roomCode.length < 4 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Enter Spectator View'}
          </button>
        </div>
        
        {/* Recent Tournaments Section */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Recent Tournaments</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal', background: 'var(--border-color)', padding: '2px 8px', borderRadius: '12px' }}>Live</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {recentTournaments.length === 0 ? (
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>Loading recent tournaments...</p>
            ) : (
              recentTournaments.map(tour => (
                <div 
                  key={tour.id} 
                  onClick={() => navigate(`/chess-viewer-room?room=${tour.id}`)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    background: 'var(--bg-color)', 
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{tour.name || 'Unnamed Arena'}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: tour.status === 'live' ? 'rgba(34, 197, 94, 0.1)' : (tour.status === 'finished' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
                      color: tour.status === 'live' ? '#22c55e' : (tour.status === 'finished' ? 'var(--text-muted)' : 'var(--primary)')
                    }}>
                      {tour.status === 'live' ? 'Ongoing' : (tour.status === 'finished' ? 'Concluded' : 'Pending')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Format: {tour.format ? tour.format.charAt(0).toUpperCase() + tour.format.slice(1) : 'Swiss'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>"""

if ui_anchor in content:
    content = content.replace(ui_anchor, ui_injection)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added Recent Tournaments to ChessViewerEntry.jsx")
