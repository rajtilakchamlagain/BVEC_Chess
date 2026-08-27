import os
import re

player_file = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
viewer_file = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx"

# --- Fix ChessPlayerEntry.jsx ---
if os.path.exists(player_file):
    with open(player_file, 'r', encoding='utf-8') as f:
        p_content = f.read()
    
    # Update imports
    p_content = p_content.replace(
        "import { doc, getDoc, collection, setDoc, serverTimestamp } from 'firebase/firestore';",
        "import { doc, getDoc, collection, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';"
    )
    
    # Update logic
    old_logic = """      const docRef = doc(db, 'chess_tournaments', roomCode.toUpperCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoomData({ id: docSnap.id, ...docSnap.data() });
        setStep(2);
      } else {
        alert("Tournament not found. Please check your code.");
      }"""
      
    new_logic = """      const upperCode = roomCode.toUpperCase();
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
      }"""
      
    p_content = p_content.replace(old_logic, new_logic)
    with open(player_file, 'w', encoding='utf-8') as f:
        f.write(p_content)

# --- Fix ChessViewerEntry.jsx ---
if os.path.exists(viewer_file):
    with open(viewer_file, 'r', encoding='utf-8') as f:
        v_content = f.read()
        
    # Update imports
    if "from 'firebase/firestore'" not in v_content:
        v_content = v_content.replace(
            "import { ArrowLeft, Eye, Info } from 'lucide-react';",
            "import { ArrowLeft, Eye, Info } from 'lucide-react';\nimport { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';\nimport { db } from '../firebase';"
        )
        
    old_join = """  const handleJoin = () => {
    if (roomCode.length >= 4) {
      navigate(`/chess-viewer-room?room=${roomCode.toUpperCase()}`);
    }
  };"""
  
    new_join = """  const [isLoading, setIsLoading] = useState(false);
  const handleJoin = async () => {
    if (roomCode.length >= 4) {
      setIsLoading(true);
      try {
        const upperCode = roomCode.toUpperCase();
        const q = query(collection(db, 'chess_tournaments'), where('viewerCode', '==', upperCode));
        const qSnap = await getDocs(q);
        
        if (!qSnap.empty) {
          navigate(`/chess-viewer-room?room=${qSnap.docs[0].id}`);
        } else {
          // Fallback check if they entered host code
          const docRef = doc(db, 'chess_tournaments', upperCode);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            navigate(`/chess-viewer-room?room=${docSnap.id}`);
          } else {
            alert("Tournament not found.");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };"""
  
    v_content = v_content.replace(old_join, new_join)
    v_content = v_content.replace(
        """<button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }} 
            onClick={handleJoin} 
            disabled={roomCode.length < 4}
          >
            Enter Spectator View
          </button>""",
        """<button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }} 
            onClick={handleJoin} 
            disabled={roomCode.length < 4 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Enter Spectator View'}
          </button>"""
    )
    
    with open(viewer_file, 'w', encoding='utf-8') as f:
        f.write(v_content)

print("Codes fixed.")
