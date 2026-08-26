import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2 } from 'lucide-react';
import { doc, getDoc, collection, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';

export default function ChessPlayerEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');
  const [roomData, setRoomData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

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
    favOpening: ''
  });

  const toTitleCase = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && code.length >= 4) {
      const autoVerify = async () => {
        setIsLoading(true);
        try {
          const upperCode = code.toUpperCase();
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
      const upperCode = roomCode.toUpperCase();
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
    setIsLoading(true);
    try {
      const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
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
