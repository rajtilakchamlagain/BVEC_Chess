import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Copy, CheckCircle2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function ChessOwnerEntry() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('create'); // 'create', 'join'
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
      <div style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to platform
        </button>

        {mode === 'create' || mode === 'join' ? (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy size={20} color="var(--text-main)" /> Host Arena
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-color)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setMode('create')}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: 'none', background: mode === 'create' ? 'var(--bg-color)' : 'transparent', color: mode === 'create' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' }}
              >
                Create
              </button>
              <button 
                onClick={() => setMode('join')}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: 'none', background: mode === 'join' ? 'var(--bg-color)' : 'transparent', color: mode === 'join' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' }}
              >
                Join existing
              </button>
            </div>

            {mode === 'create' ? (
              <>
                <div className="input-group">
                  <label>Tournament Name</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="e.g. Autumn Open"
                    value={tournamentData.name}
                    onChange={e => setTournamentData({...tournamentData, name: e.target.value})}
                  />
                </div>
                
                <div className="input-group">
                  <label>Host Name</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="e.g. John Doe"
                    value={tournamentData.hostName}
                    onChange={e => setTournamentData({...tournamentData, hostName: e.target.value})}
                  />
                </div>

                <div className="input-group">
                  <label>Logo URL (Optional)</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="https://"
                    value={tournamentData.logoUrl}
                    onChange={e => setTournamentData({...tournamentData, logoUrl: e.target.value})}
                  />
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem' }} 
                  onClick={handleCreate} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Initializing...' : 'Create Tournament'}
                </button>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>Host Code</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="XXXXXX"
                    style={{ textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}
                    value={generatedCodes.host}
                    onChange={e => setGeneratedCodes({...generatedCodes, host: e.target.value.toUpperCase()})}
                  />
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem' }} 
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
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} color="var(--bg-color)" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>Tournament Active</h2>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Your tournament has been initialized. Distribute the codes below to participants.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-color)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Host Access Code</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px', color: 'var(--text-main)' }}>{generatedCodes.host}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.host, 'host')} style={{ padding: '8px' }}>
                  {copiedCode === 'host' ? <CheckCircle2 size={16} /> : <Copy size={16}/>}
                </button>
              </div>
              
              <div style={{ background: 'var(--bg-color)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Player Join Code</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px', color: 'var(--secondary)' }}>{generatedCodes.player}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.player, 'player')} style={{ padding: '8px' }}>
                  {copiedCode === 'player' ? <CheckCircle2 size={16} /> : <Copy size={16}/>}
                </button>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
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
