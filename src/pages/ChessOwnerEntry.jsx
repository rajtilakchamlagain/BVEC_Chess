import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Copy, CheckCircle2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function ChessOwnerEntry() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('create'); // 'create', 'share'
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const [tournamentData, setTournamentData] = useState({
    name: '',
    hostName: '',
    logoUrl: '',
    organizerLogoUrl: ''
  });

  const [generatedCodes, setGeneratedCodes] = useState({ host: '', player: '', viewer: '' });

  const handleCreate = async () => {
    if (!tournamentData.name || !tournamentData.hostName) {
      alert("Tournament Name and Host Name are required");
      return;
    }

    setIsLoading(true);
    const hostCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const playerCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const viewerCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      await setDoc(doc(db, 'chess_tournaments', hostCode), {
        name: tournamentData.name,
        hostName: tournamentData.hostName,
        logoUrl: tournamentData.logoUrl,
        organizerLogoUrl: tournamentData.organizerLogoUrl,
        hostCode,
        playerCode,
        viewerCode,
        status: 'waiting',
        currentRound: 0,
        createdAt: serverTimestamp()
      });

      localStorage.setItem('pitchbid_chess_host', hostCode);
      
      setGeneratedCodes({ host: hostCode, player: playerCode, viewer: viewerCode });
      setMode('share');
    } catch (err) {
      console.error(err);
      alert("Failed to create tournament.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        {mode === 'create' || mode === 'join' ? (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Trophy size={24} color="#ff0080" /> Host Dashboard
            </h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setMode('create')}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: mode === 'create' ? 'var(--glass-bg)' : 'transparent', color: mode === 'create' ? '#fff' : 'var(--text-muted)', cursor: 'pointer' }}
              >
                Create New
              </button>
              <button 
                onClick={() => setMode('join')}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: mode === 'join' ? 'var(--glass-bg)' : 'transparent', color: mode === 'join' ? '#fff' : 'var(--text-muted)', cursor: 'pointer' }}
              >
                Join Existing
              </button>
            </div>

            {mode === 'create' ? (
              <>
                <div className="input-group">
                  <label>Tournament Name *</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="e.g. Grandmaster Clash"
                    value={tournamentData.name}
                    onChange={e => setTournamentData({...tournamentData, name: e.target.value})}
                  />
                </div>
                
                <div className="input-group">
                  <label>Host / Organizer Name *</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="Your name"
                    value={tournamentData.hostName}
                    onChange={e => setTournamentData({...tournamentData, hostName: e.target.value})}
                  />
                </div>

                <div className="input-group">
                  <label>Tournament Logo URL (Optional)</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="https://..."
                    value={tournamentData.logoUrl}
                    onChange={e => setTournamentData({...tournamentData, logoUrl: e.target.value})}
                  />
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 100%)', border: 'none' }} 
                  onClick={handleCreate} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Tournament'}
                </button>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>Enter Host Code</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="e.g. X8J9L2"
                    style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', fontSize: '1.2rem' }}
                    value={generatedCodes.host}
                    onChange={e => setGeneratedCodes({...generatedCodes, host: e.target.value.toUpperCase()})}
                  />
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #0055ff 0%, #00e5ff 100%)', border: 'none' }} 
                  onClick={() => {
                    if (generatedCodes.host) {
                      localStorage.setItem('pitchbid_chess_host', generatedCodes.host);
                      navigate(`/chess-dashboard?room=${generatedCodes.host}`);
                    }
                  }} 
                >
                  Enter Dashboard
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--success)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={30} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Tournament Created!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Share these codes with your participants.</p>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Host Code (Save this)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>{generatedCodes.host}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.host, 'host')} style={{ padding: '8px' }}>
                  {copiedCode === 'host' ? <CheckCircle2 size={18} color="var(--success)"/> : <Copy size={18}/>}
                </button>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Player Join Code</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--primary)' }}>{generatedCodes.player}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.player, 'player')} style={{ padding: '8px' }}>
                  {copiedCode === 'player' ? <CheckCircle2 size={18} color="var(--success)"/> : <Copy size={18}/>}
                </button>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 100%)', border: 'none' }}
              onClick={() => navigate(`/chess-dashboard?room=${generatedCodes.host}`)}
            >
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
