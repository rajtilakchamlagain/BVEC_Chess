import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Info } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ChessViewerEntry() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
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
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        
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
              <strong>What is this?</strong> Enter the tournament code provided by the host. This will give you read-only access to view live scores, current round pairings, and real-time leaderboard standings as the tournament progresses!
            </p>
          </div>

          <div className="input-group">
            <label>Tournament Code</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="e.g. A1B2C3"
              style={{ textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}
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
      </div>
    </div>
  );
}
