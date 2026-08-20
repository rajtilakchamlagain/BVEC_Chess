import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowLeft } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function ChessViewerEntry() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const verifyCode = async () => {
    if (!code) return;
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const q = query(collection(db, 'chess_tournaments'), where('playerCode', '==', code.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setErrorMsg("Invalid Tournament Code");
        setIsLoading(false);
        return;
      }
      
      const roomDoc = snap.docs[0];
      navigate(`/chess-viewer-room?room=${roomDoc.id}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Eye size={24} color="#00e5ff" /> Watch Tournament Live
          </h2>
          
          <div className="input-group">
            <label>Tournament Code</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="ENTER CODE"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              style={{ fontSize: '1.5rem', letterSpacing: '0.3em', textAlign: 'center', borderColor: errorMsg ? 'red' : '' }}
              onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
            />
            {errorMsg && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>{errorMsg}</p>}
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem', border: 'none' }} 
            onClick={verifyCode} 
            disabled={isLoading || !code}
          >
            {isLoading ? 'Connecting...' : 'Join Broadcast'}
          </button>
        </div>
      </div>
    </div>
  );
}
