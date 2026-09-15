import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add state for Lichess validation
state_injection = """
  const [lichessVerified, setLichessVerified] = useState(false);
  const [isVerifyingLichess, setIsVerifyingLichess] = useState(false);
  
  // Watch for auth changes and pull global user profile
  useEffect(() => {
    const fetchGlobalProfile = async () => {
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, 'users', user.email));
        if (docSnap.exists()) {
          const globalData = docSnap.data();
          setPlayerData(prev => ({
            ...prev,
            name: globalData.name || prev.name || user.displayName || '',
            rollNumber: globalData.rollNumber || prev.rollNumber,
            course: globalData.course || prev.course,
            branch: globalData.branch || prev.branch,
            year: globalData.year || prev.year,
            lichessId: globalData.lichessId || prev.lichessId
          }));
          if (globalData.lichessId) {
            setLichessVerified(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchGlobalProfile();
  }, [user]);

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
"""

content = content.replace("  const [roomData, setRoomData] = useState(null);", state_injection + "\n  const [roomData, setRoomData] = useState(null);")

# Update handleRegister to save to global users
register_start = """  const handleRegister = async () => {
    if (!playerData.name || !playerData.rollNumber) {
      alert("Name and Roll Number are required.");
      return;
    }"""
    
register_new = """  const handleRegister = async () => {
    if (!playerData.name || !playerData.rollNumber) {
      alert("Name and Roll Number are required.");
      return;
    }
    if (roomData?.isOnline && !lichessVerified) {
      alert("This is an online tournament. You must provide and verify a valid Lichess ID.");
      return;
    }"""
content = content.replace(register_start, register_new)

# Inside handleRegister try block
try_start = """      await setDoc(doc(db, 'chess_tournaments', roomData.id, 'players', playerId), {"""
try_new = """      
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

      await setDoc(doc(db, 'chess_tournaments', roomData.id, 'players', playerId), {"""
content = content.replace(try_start, try_new)

# Add Lichess Field to UI
input_section = """<div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Hostel / PG / Local Address (Optional)</label>"""

lichess_ui = """
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
"""

content = content.replace(input_section, lichess_ui + "\n" + input_section)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessPlayerEntry")
