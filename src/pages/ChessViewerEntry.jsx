import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';

export default function ChessViewerEntry() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (roomCode.length >= 4) {
      navigate(`/chess-viewer-room?room=${roomCode.toUpperCase()}`);
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

          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Enter a tournament code to view live pairings, results, and standings in real-time.
          </p>

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
            disabled={roomCode.length < 4}
          >
            Enter Spectator View
          </button>
        </div>
      </div>
    </div>
  );
}
