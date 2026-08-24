import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Info } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function ChessViewerEntry() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
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

  const handleJoin = async () => {
    if (roomCode.length >= 4) {
      setIsLoading(true);
      try {
        const upperCode = roomCode.toUpperCase();
        const q = query(collection(db, 'chess_tournaments'), where('viewerCode', '==', upperCode));
        const qSnap = await getDocs(q);
        
        if (!qSnap.empty) {
          navigate(`/chess-viewer-room?room=${qSnap.docs[0].id}`);
        } else {
          // Fallback check if they entered host code
          const docRef = doc(db, 'chess_tournaments', upperCode);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            navigate(`/chess-viewer-room?room=${docSnap.id}`);
          } else {
            alert("Tournament not found.");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="entry-container">
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to platform
        </button>

        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Eye size={20} color="var(--text-main)" /> Spectator Mode
          </h2>

          <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <Info size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              <strong>What is this?</strong> Enter the 6-character tournament code to follow live match results and leaderboard standings.
            </p>
          </div>

          <div className="input-group">
            <label>Tournament Code</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Enter 6-digit code"
              style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <button 
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
        </div>
      </div>
    </div>
  );
}
