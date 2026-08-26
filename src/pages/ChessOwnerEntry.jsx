import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, CheckCircle2, Copy, Lock, ShieldAlert, MailCheck, ShieldCheck } from 'lucide-react';
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';

export default function ChessOwnerEntry() {
  const navigate = useNavigate();
  const [step, setStep] = useState('auth'); // auth, loading, create, success
  const [mode, setMode] = useState('create');
  
  // Auth & Admin State
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  
  // Admin Panel State
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);

  const [tournamentData, setTournamentData] = useState({
    name: '',
    hostName: '',
    logoUrl: ''
  });
  
  const [generatedCodes, setGeneratedCodes] = useState({
    host: '',
    player: '',
    viewer: ''
  });
  const [copiedCode, setCopiedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Constants
  const SUPER_ADMIN = 'rjtiksrm@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(true);
        try {
          if (currentUser.email === SUPER_ADMIN) {
            setIsSuperAdmin(true);
            setHasAccess(true);
            fetchAccessRequests();
          } else {
            // Check if they are an approved admin
            const docRef = doc(db, 'allowed_admins', currentUser.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setHasAccess(true);
            } else {
              setHasAccess(false);
              // Check if they already requested
              const reqRef = doc(db, 'access_requests', currentUser.email);
              const reqSnap = await getDoc(reqRef);
              if (reqSnap.exists()) {
                setAccessRequested(true);
              }
            }
          }
        } catch (error) {
          console.error("Error checking permissions:", error);
        }
        setIsLoading(false);
        setStep('create');
      } else {
        setUser(null);
        setHasAccess(false);
        setStep('auth');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in. Please try again.");
    }
    setIsLoading(false);
  };

  const handleRequestAccess = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'access_requests', user.email), {
        email: user.email,
        name: user.displayName,
        requestedAt: serverTimestamp()
      });
      
      // Attempt to open mailto link to notify admin
      const subject = encodeURIComponent("ChessVerse Hosting Access Request");
      const body = encodeURIComponent(`Hi Admin,\n\nI would like to request hosting access for ChessVerse.\n\nMy details:\nName: ${user.displayName}\nEmail: ${user.email}\n\nPlease approve my request in the Host Portal.\n\nThanks!`);
      window.open(`mailto:${SUPER_ADMIN}?subject=${subject}&body=${body}`, '_blank');
      
      setAccessRequested(true);
    } catch (error) {
      console.error("Error requesting access:", error);
      alert("Something went wrong requesting access.");
    }
    setIsLoading(false);
  };

  const fetchAccessRequests = async () => {
    try {
      const qSnap = await getDocs(collection(db, 'access_requests'));
      const requests = [];
      qSnap.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      setAccessRequests(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const approveRequest = async (email) => {
    try {
      await setDoc(doc(db, 'allowed_admins', email), {
        email,
        approvedAt: serverTimestamp(),
        approvedBy: SUPER_ADMIN
      });
      await deleteDoc(doc(db, 'access_requests', email));
      fetchAccessRequests();
      alert(`Access granted to ${email}`);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const declineRequest = async (email) => {
    try {
      await deleteDoc(doc(db, 'access_requests', email));
      fetchAccessRequests();
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const generateCode = (length = 6) => {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  };

  const handleCreate = async () => {
    if (!tournamentData.name || !tournamentData.hostName) {
      alert("Please fill in required fields");
      return;
    }
    setIsLoading(true);
    try {
      const hostCode = generateCode(6);
      const playerCode = generateCode(6);
      const viewerCode = generateCode(6);

      await setDoc(doc(db, 'chess_tournaments', hostCode), {
        ...tournamentData,
        hostCode,
        playerCode,
        viewerCode,
        status: 'pending',
        currentRound: 0,
        createdAt: serverTimestamp(),
        createdBy: user.email
      });

      setGeneratedCodes({ host: hostCode, player: playerCode, viewer: viewerCode });
      localStorage.setItem('pitchbid_chess_host', hostCode);
      setStep('success');
    } catch (err) {
      console.error("Error creating tournament", err);
      alert("Failed to initialize arena.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (code, type) => {
    const baseUrl = window.location.origin;
    let textToCopy = code;
    if (type === 'player') textToCopy = `${baseUrl}/chess-player-entry?code=${code}`;
    else if (type === 'viewer') textToCopy = `${baseUrl}/chess-viewer-entry?code=${code}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="entry-container" style={{ width: '100%', maxWidth: '600px', padding: '3rem 2.5rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', borderTop: '10px solid var(--primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', transform: 'translateY(-5px)', transition: 'transform 0.3s ease' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to platform
          </button>
          
          {user && (
            <button onClick={() => signOut(auth)} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
              Sign Out ({user.email.split('@')[0]})
            </button>
          )}
        </div>

        {step === 'auth' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: 'var(--bg-color)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border-color)' }}>
              <Lock size={32} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '600' }}>Host Arena Security</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Hosting tournaments is restricted to authorized personnel only. Please sign in with your Google account to verify your identity.
            </p>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '1rem' }} 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        )}

        {step === 'create' && !hasAccess && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: '#fef2f2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldAlert size={32} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '600' }}>Access Denied</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Logged in as <strong>{user.email}</strong>.<br/>You do not have permissions to host tournaments.
            </p>
            
            {accessRequested ? (
              <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <MailCheck size={28} color="#22c55e" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#166534', margin: '0 0 0.5rem 0' }}>Request Sent</h3>
                <p style={{ fontSize: '0.9rem', color: '#15803d', margin: 0 }}>The Admin has been notified. Please wait for them to approve your access.</p>
              </div>
            ) : (
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem' }} 
                onClick={handleRequestAccess}
                disabled={isLoading}
              >
                {isLoading ? 'Requesting...' : 'Request Hosting Access'}
              </button>
            )}
          </div>
        )}

        {step === 'create' && hasAccess && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Trophy size={20} color="var(--text-main)" /> Host Arena
              </h2>
              {isSuperAdmin && (
                <button 
                  onClick={() => setShowAdminPanel(!showAdminPanel)} 
                  style={{ background: 'var(--bg-color)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={16} /> {showAdminPanel ? 'Exit Admin' : 'Admin Panel'}
                  {accessRequests.length > 0 && !showAdminPanel && (
                    <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{accessRequests.length}</span>
                  )}
                </button>
              )}
            </div>

            {showAdminPanel ? (
              <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Pending Access Requests</h3>
                {accessRequests.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No pending requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {accessRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{req.name || 'Unknown User'}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => declineRequest(req.email)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', cursor: 'pointer' }}>Decline</button>
                          <button onClick={() => approveRequest(req.email)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer' }}>Approve</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-color)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => setMode('create')}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: 'none', background: mode === 'create' ? 'var(--bg-color)' : 'transparent', color: mode === 'create' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' }}
                  >
                    Create New
                  </button>
                  <button 
                    onClick={() => setMode('join')}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: 'none', background: mode === 'join' ? 'var(--bg-color)' : 'transparent', color: mode === 'join' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' }}
                  >
                    Manage Existing
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
                        style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}
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
              </>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} color="var(--bg-color)" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>Tournament Active</h2>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Your tournament has been initialized. Distribute the links below to participants.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-color)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Host Access Code</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px', color: 'var(--text-main)' }}>{generatedCodes.host}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.host, 'host')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {copiedCode === 'host' ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16}/> Copy Code</>}
                </button>
              </div>
              
              <div style={{ background: 'var(--bg-color)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Player Registration Link</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px', color: 'var(--secondary)' }}>{generatedCodes.player}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.player, 'player')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {copiedCode === 'player' ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16}/> Copy Link</>}
                </button>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Spectator / Viewer Link</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px', color: 'var(--primary)' }}>{generatedCodes.viewer}</div>
                </div>
                <button className="btn-outline" onClick={() => handleCopy(generatedCodes.viewer, 'viewer')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {copiedCode === 'viewer' ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16}/> Copy Link</>}
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
