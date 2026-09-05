import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Save, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    rollNumber: '',
    branch: 'CSE',
    year: '1st',
    chesscomId: '',
    lichessId: '',
    fideId: '',
    aicfId: '',
    bio: '',
    contactNumber: '',
    contactType: 'Phone Only',
    favOpening: ''
  });

  const [verifications, setVerifications] = useState({
    chesscom: null, // null, 'loading', 'valid', 'invalid'
    lichess: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, 'users', currentUser.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData({ ...profileData, ...docSnap.data() });
          } else {
            // Pre-fill name from Google if it's a new profile
            setProfileData({ ...profileData, name: currentUser.displayName || '' });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        navigate('/');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const verifyChesscom = async () => {
    if (!profileData.chesscomId) return;
    setVerifications(prev => ({ ...prev, chesscom: 'loading' }));
    try {
      const res = await fetch(`https://api.chess.com/pub/player/${profileData.chesscomId}`);
      if (res.status === 200) {
        setVerifications(prev => ({ ...prev, chesscom: 'valid' }));
      } else {
        setVerifications(prev => ({ ...prev, chesscom: 'invalid' }));
      }
    } catch (e) {
      setVerifications(prev => ({ ...prev, chesscom: 'invalid' }));
    }
  };

  const verifyLichess = async () => {
    if (!profileData.lichessId) return;
    setVerifications(prev => ({ ...prev, lichess: 'loading' }));
    try {
      const res = await fetch(`https://lichess.org/api/user/${profileData.lichessId}`);
      if (res.status === 200) {
        setVerifications(prev => ({ ...prev, lichess: 'valid' }));
      } else {
        setVerifications(prev => ({ ...prev, lichess: 'invalid' }));
      }
    } catch (e) {
      setVerifications(prev => ({ ...prev, lichess: 'invalid' }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.email), {
        ...profileData,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp()
      });
      alert("Profile Saved Successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)' }}>Loading...</div>;
  }

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to platform
        </button>

        <div style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', borderTop: '10px solid var(--primary)', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--primary)' }} />
            ) : (
              <UserCircle size={80} color="var(--primary)" />
            )}
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700' }}>My Profile</h1>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Academic Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Academic Details</h3>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" className="premium-input" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="input-group">
                <label>Roll Number</label>
                <input type="text" className="premium-input" value={profileData.rollNumber} onChange={e => setProfileData({...profileData, rollNumber: e.target.value})} placeholder="e.g. 23/CSE/001" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Branch</label>
                  <select className="premium-input" value={profileData.branch} onChange={e => setProfileData({...profileData, branch: e.target.value})}>
                    <option value="CSE">CSE</option>
                    <option value="ETE">ETE</option>
                    <option value="CE">CE</option>
                    <option value="ME">ME</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Year</label>
                  <select className="premium-input" value={profileData.year} onChange={e => setProfileData({...profileData, year: e.target.value})}>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chess Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Chess Profiles</h3>
              
              <div className="input-group">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Chess.com ID</span>
                  {verifications.chesscom === 'loading' && <Loader2 size={14} className="spin" />}
                  {verifications.chesscom === 'valid' && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><CheckCircle2 size={12}/> Verified</span>}
                  {verifications.chesscom === 'invalid' && <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><XCircle size={12}/> Not Found</span>}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="premium-input" value={profileData.chesscomId} onChange={e => { setProfileData({...profileData, chesscomId: e.target.value}); setVerifications(prev => ({...prev, chesscom: null}))}} placeholder="username" />
                  <button onClick={verifyChesscom} style={{ padding: '0 12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>Verify</button>
                </div>
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Lichess ID</span>
                  {verifications.lichess === 'loading' && <Loader2 size={14} className="spin" />}
                  {verifications.lichess === 'valid' && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><CheckCircle2 size={12}/> Verified</span>}
                  {verifications.lichess === 'invalid' && <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><XCircle size={12}/> Not Found</span>}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="premium-input" value={profileData.lichessId} onChange={e => { setProfileData({...profileData, lichessId: e.target.value}); setVerifications(prev => ({...prev, lichess: null}))}} placeholder="username" />
                  <button onClick={verifyLichess} style={{ padding: '0 12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>Verify</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>FIDE ID (if any)</label>
                  <input type="text" className="premium-input" value={profileData.fideId} onChange={e => setProfileData({...profileData, fideId: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>AICF ID (if any)</label>
                  <input type="text" className="premium-input" value={profileData.aicfId} onChange={e => setProfileData({...profileData, aicfId: e.target.value})} />
                </div>
              </div>
            </div>
            
            {/* Extras */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label>Favorite Opening</label>
                <input type="text" className="premium-input" value={profileData.favOpening} onChange={e => setProfileData({...profileData, favOpening: e.target.value})} placeholder="e.g. Sicilian Defense, Queen's Gambit" />
              </div>
              <div className="input-group">
                <label>Short Bio</label>
                <textarea className="premium-input" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} placeholder="Tell us a bit about your playstyle..." rows="3" style={{ resize: 'vertical' }}></textarea>
              </div>
            </div>

          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
          
        </div>
      </div>
    </div>
  );
}
