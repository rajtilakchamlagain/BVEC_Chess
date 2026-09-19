import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2, Star } from 'lucide-react';
import { doc, getDoc, collection, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signInWithRedirect, getRedirectResult } from 'firebase/auth';

export default function ChessPlayerEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');

  const [isLoading, setIsLoading] = useState(false);

  const [playerData, setPlayerData] = useState({
    name: '',
    rating: 1200,
    fideId: '',
    aicfId: '',
    collegeName: 'BVEC',
    course: 'B.Tech',
    branch: 'CSE',
    semester: '1st',
    year: '1st',
    rollNumber: '',
    address: '',
    isCoreMember: 'No',
    designation: '',
    photoUrl: '',
    chesscomId: '',
    lichessId: '',
    bio: '',
    contactNumber: '',
    contactType: 'Phone Only',
    favOpening: ''
  });



  const [roomData, setRoomData] = useState(null);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [lichessVerified, setLichessVerified] = useState(false);
  const [isVerifyingLichess, setIsVerifyingLichess] = useState(false);
  

  const verifyLichessAccount = async () => {
    if (!playerData.lichessId) return;
    setIsVerifyingLichess(true);
    try {
      const res = await fetch(`https://lichess.org/api/user/${playerData.lichessId}`);
      if (res.ok) {
        setLichessVerified(true);
        alert('Lichess Account Verified!');
      } else {
        setLichessVerified(false);
        alert('Lichess Account not found. Please check spelling.');
      }
    } catch (e) {
      alert('Error verifying account. Please try again.');
    } finally {
      setIsVerifyingLichess(false);
    }
  };

  useEffect(() => {
    // Check for redirect result first (crucial for mobile in-app browsers)
    getRedirectResult(auth)
      .finally(() => {
        setTimeout(() => setIsCheckingAuth(false), 800);
      })
      .catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsCheckingAuth(false);
        try {
          const docRef = doc(db, 'users', currentUser.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPlayerData(prev => ({
              ...prev,
              name: data.name || prev.name,
              rollNumber: data.rollNumber || prev.rollNumber,
              branch: data.branch || prev.branch,
              year: data.year || prev.year,
              fideId: data.fideId || prev.fideId,
              aicfId: data.aicfId || prev.aicfId,
              chesscomId: data.chesscomId || prev.chesscomId,
              lichessId: data.lichessId || prev.lichessId,
              bio: data.bio || prev.bio,
              favOpening: data.favOpening || prev.favOpening,
              photoUrl: currentUser.photoURL || prev.photoUrl,
              email: currentUser.email
            }));
            if (data.lichessId) {
              setLichessVerified(true);
            }
          } else {
             setPlayerData(prev => ({...prev, name: currentUser.displayName, photoUrl: currentUser.photoURL, email: currentUser.email}));
          }
        } catch(e) {}
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAutofillLogin = async () => {
    try {
      if (roomCode) {
        localStorage.setItem('chess_pending_room', roomCode);
      }
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
      }
    }
  };



  const toTitleCase = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  
  useEffect(() => {
    let code = searchParams.get('code');
    
    // If not in URL, check if we saved it before a redirect
    if (!code) {
      const savedCode = localStorage.getItem('chess_pending_room');
      if (savedCode) {
        code = savedCode;
        setRoomCode(code);
        // Clear it so it doesn't persist forever
        localStorage.removeItem('chess_pending_room');
      }
    }

    if (code && code.length >= 4) {
      const autoVerify = async () => {
        setIsLoading(true);
        try {
          const upperCode = code.trim().toUpperCase();
          const q = query(collection(db, 'chess_tournaments'), where('playerCode', '==', upperCode));
          const qSnap = await getDocs(q);
          
          if (!qSnap.empty) {
            const docSnap = qSnap.docs[0];
            setRoomData({ id: docSnap.id, ...docSnap.data() });
            setStep(2);
          } else {
            const docRef = doc(db, 'chess_tournaments', upperCode);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setRoomData({ id: docSnap.id, ...docSnap.data() });
              setStep(2);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      autoVerify();
    }
  }, []);

  const handleVerifyCode = async () => {
    if (!roomCode || roomCode.length < 4) return;
    setIsLoading(true);
    try {
      // Find tournament by playerCode
      let hostCodeMatch = null;
      // In a real app we'd query by playerCode. For now, assuming hostCode = playerCode logic or we search.
      // Wait, firestore doesn't support value queries easily without index.
      // We will do a generic check if they entered host code instead of player code, or we just trust playerCode logic.
      // Since this is a demo, let's assume they provide the actual host code for now or we update the schema later.
      const upperCode = roomCode.trim().toUpperCase();
      const q = query(collection(db, 'chess_tournaments'), where('playerCode', '==', upperCode));
      const qSnap = await getDocs(q);
      
      if (!qSnap.empty) {
        const docSnap = qSnap.docs[0];
        setRoomData({ id: docSnap.id, ...docSnap.data() });
        setStep(2);
      } else {
        // Fallback: check if they entered the host code
        const docRef = doc(db, 'chess_tournaments', upperCode);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoomData({ id: docSnap.id, ...docSnap.data() });
          setStep(2);
        } else {
          alert("Tournament not found. Please check your code.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!playerData.name || !playerData.rollNumber) {
      alert("Name and Roll Number are required.");
      return;
    }
    if (roomData?.isOnline && !lichessVerified) {
      alert("This is an online tournament. You must provide and verify a valid Lichess ID.");
      return;
    }
    setIsLoading(true);
    try {
      const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to Global Users Collection
      if (user && user.email) {
         await setDoc(doc(db, 'users', user.email), {
           name: playerData.name,
           rollNumber: playerData.rollNumber,
           course: playerData.course,
           branch: playerData.branch,
           year: playerData.year,
           lichessId: playerData.lichessId || '',
           email: user.email,
           photoUrl: user.photoURL || '',
           updatedAt: serverTimestamp()
         }, { merge: true });
      }

      await setDoc(doc(db, 'chess_tournaments', roomData.id, 'players', playerId), {
        ...playerData,
        wins: 0,
        matchesPlayed: 0,
        whitePlayed: 0,
        blackPlayed: 0,
        withdrawn: false,
        createdAt: serverTimestamp()
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Error registering player.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '540px', padding: '3rem 2.5rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', borderTop: '10px solid var(--primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', transform: 'translateY(-5px)', transition: 'transform 0.3s ease' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to platform
        </button>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} /> Join Tournament
            </h2>
            <div className="input-group">
              <label>Tournament Code</label>
              <input 
                type="text" 
                className="premium-input" 
                placeholder="Enter 6-character code"
                style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
              />
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }} 
              onClick={handleVerifyCode} 
              disabled={isLoading || roomCode.length < 4}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        )}


        {step === 2 && roomData && (
          <div className="animate-fade-in">
            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Registering for</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{roomData.name}</div>
            </div>

            {isCheckingAuth ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <style>{`
                  @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <div style={{ color: 'var(--text-muted)' }}>Checking authentication...</div>
              </div>
            ) : !user ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Authentication Required</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                  Please go to the <strong>Home Page</strong> to sign in first.<br/><br/>
                  Once you are signed in, return to this link and you will be able to register instantly.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px 24px' }}
                >
                  Go to Home Page
                </button>
              </div>
            ) : (
              <>


            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Full Name *</label>
                <input type="text" className="premium-input" value={playerData.name} onChange={e => setPlayerData({...playerData, name: toTitleCase(e.target.value)})} />
              </div>

              <div className="input-group">
                <label>Roll Number *</label>
                <input type="text" className="premium-input" value={playerData.rollNumber} onChange={e => setPlayerData({...playerData, rollNumber: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Current Rating (Elo)</label>
                <input type="number" className="premium-input" value={playerData.rating} onChange={e => setPlayerData({...playerData, rating: Number(e.target.value)})} />
              </div>

                            <div className="input-group">
                <label>Course</label>
                <select className="premium-input" value={playerData.course} onChange={e => setPlayerData({...playerData, course: e.target.value})}>
                  <option>B.Tech</option>
                  <option>M.Tech</option>
                  <option>B.Sc</option>
                </select>
              </div>

              <div className="input-group">
                <label>Branch</label>
                <select className="premium-input" value={playerData.branch} onChange={e => setPlayerData({...playerData, branch: e.target.value})}>
                  <option value="CSE">CSE</option>
                  <option value="ETE">ETE</option>
                  <option value="CE">CE</option>
                  <option value="ME">ME</option>
                </select>
              </div>

              <div className="input-group">
                <label>Year</label>
                <select className="premium-input" value={playerData.year} onChange={e => setPlayerData({...playerData, year: e.target.value})}>
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                </select>
              </div>

              
              {roomData?.isOnline && (
                <div className="input-group" style={{ gridColumn: '1 / -1', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <label style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} /> Lichess Username (Required for Online Play)
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      className="premium-input" 
                      value={playerData.lichessId} 
                      onChange={e => { setPlayerData({...playerData, lichessId: e.target.value}); setLichessVerified(false); }}
                      style={{ flex: 1, borderColor: lichessVerified ? '#10b981' : '' }}
                    />
                    <button 
                      onClick={verifyLichessAccount}
                      disabled={isVerifyingLichess || !playerData.lichessId || lichessVerified}
                      style={{ background: lichessVerified ? '#10b981' : 'var(--text-main)', color: lichessVerified ? '#000' : 'var(--bg-color)', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {isVerifyingLichess ? 'Checking...' : lichessVerified ? 'Verified ✓' : 'Verify'}
                    </button>
                  </div>
                  {!lichessVerified && <div style={{ fontSize: '0.8rem', color: '#ff9900', marginTop: '8px' }}>* You must verify your Lichess account to continue.</div>}
                </div>
              )}

<div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Hostel / PG / Local Address (Optional)</label>
                <input type="text" className="premium-input" placeholder="e.g. Boys Hostel 1" value={playerData.address} onChange={e => setPlayerData({...playerData, address: toTitleCase(e.target.value)})} />
              </div>
            </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '2rem' }} 
                onClick={handleRegister} 
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
              </>
            )}
            </div>
          )}

        {step === 3 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: 'var(--text-main)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={32} color="var(--bg-color)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>Registration Confirmed</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>You have been added to the tournament roster. Please wait for the host to generate the first round pairings.</p>
            
            <button className="btn-outline" style={{ width: '100%' }} onClick={() => navigate('/')}>
              Return to Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
