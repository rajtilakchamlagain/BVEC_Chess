import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure imports are there
if "signInWithPopup" not in content:
    content = content.replace("import { auth } from '../firebase';", "import { auth, googleProvider } from '../firebase';\nimport { signInWithPopup, onAuthStateChanged } from 'firebase/auth';")
    # If auth isn't there at all:
    if "from '../firebase'" not in content:
        content = content.replace("import { db } from '../firebase';", "import { db, auth, googleProvider } from '../firebase';\nimport { signInWithPopup, onAuthStateChanged } from 'firebase/auth';")
    else:
        content = content.replace("import { db } from '../firebase';", "import { db, auth, googleProvider } from '../firebase';\nimport { signInWithPopup, onAuthStateChanged } from 'firebase/auth';")

# Add missing fields to playerData initial state
if "chesscomId:" not in content:
    content = content.replace("photoUrl: ''\n    });", "photoUrl: '',\n      chesscomId: '',\n      lichessId: '',\n      bio: '',\n      favOpening: ''\n    });")
    content = content.replace("photoUrl: ''\n  });", "photoUrl: '',\n    chesscomId: '',\n    lichessId: '',\n    bio: '',\n    favOpening: ''\n  });")

# Add auth state listener inside component
auth_listener = """  const [user, setUser] = useState(null);

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
"""
if "const handleAutofillLogin" not in content:
    content = content.replace("const [roomData, setRoomData] = useState(null);", "const [roomData, setRoomData] = useState(null);\n" + auth_listener)

# Add "Sign in to autofill" banner in Step 2
banner = """{step === 2 && (
          <div className="animate-fade-in">
            {!user && (
              <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Have a ChessVerse profile?</span>
                <button onClick={handleAutofillLogin} style={{ background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: '14px' }} /> Sign in to Autofill
                </button>
              </div>
            )}
            {user && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                <img src={user.photoURL} alt="" style={{ width: '24px', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.9rem', color: '#166534' }}>Signed in as <strong>{user.email}</strong>. Profile loaded!</span>
              </div>
            )}"""

content = content.replace("{step === 2 && (\n          <div className=\"animate-fade-in\">", banner)
if "Have a ChessVerse profile" not in content:
    # try another match
    content = content.replace("{step === 2 && (\n        <div className=\"animate-fade-in\">", banner)

# Add new inputs to the form
new_inputs = """
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Chess.com ID</label>
                  <input type="text" className="premium-input" value={playerData.chesscomId} onChange={e => setPlayerData({...playerData, chesscomId: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Lichess ID</label>
                  <input type="text" className="premium-input" value={playerData.lichessId} onChange={e => setPlayerData({...playerData, lichessId: e.target.value})} />
                </div>
              </div>
              
              <div className="input-group">
                <label>Favorite Opening</label>
                <input type="text" className="premium-input" value={playerData.favOpening} onChange={e => setPlayerData({...playerData, favOpening: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Bio</label>
                <textarea className="premium-input" value={playerData.bio} onChange={e => setPlayerData({...playerData, bio: e.target.value})} rows="2"></textarea>
              </div>
"""

# inject right before submit button
content = content.replace("<button \n                className=\"btn-primary\" \n                style={{ width: '100%', marginTop: '1.5rem' }} \n                onClick={handleRegister} \n                disabled={isLoading}\n              >", new_inputs + "\n              <button \n                className=\"btn-primary\" \n                style={{ width: '100%', marginTop: '1.5rem' }} \n                onClick={handleRegister} \n                disabled={isLoading}\n              >")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ChessPlayerEntry.jsx")
