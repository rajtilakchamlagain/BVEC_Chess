import os
import re

# Update Viewer Entry
viewer_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerEntry.jsx"
with open(viewer_path, "r", encoding="utf-8") as f:
    v_content = f.read()

# We need to add auto-verify in useEffect
# We'll just add it to the existing useEffect or add a new one
auto_verify_viewer = """
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && code.length >= 4) {
      // Auto-trigger join
      const autoJoin = async () => {
        setIsLoading(true);
        try {
          const upperCode = code.toUpperCase();
          const q = query(collection(db, 'chess_tournaments'), where('viewerCode', '==', upperCode));
          const qSnap = await getDocs(q);
          
          if (!qSnap.empty) {
            navigate(`/chess-viewer-room?room=${qSnap.docs[0].id}`);
          } else {
            const docRef = doc(db, 'chess_tournaments', upperCode);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              navigate(`/chess-viewer-room?room=${docSnap.id}`);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      autoJoin();
    }
  }, []);
"""
if "autoJoin" not in v_content:
    v_content = v_content.replace("const handleJoin", auto_verify_viewer + "\n  const handleJoin")
    with open(viewer_path, "w", encoding="utf-8") as f:
        f.write(v_content)


# Update Player Entry
player_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
with open(player_path, "r", encoding="utf-8") as f:
    p_content = f.read()

# We need to add auto-verify to PlayerEntry as well
auto_verify_player = """
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
"""
if "autoVerify" not in p_content:
    # Need to make sure useEffect is imported in ChessPlayerEntry
    if "useEffect" not in p_content:
        p_content = p_content.replace("import { useState }", "import { useState, useEffect }")
        
    p_content = p_content.replace("const handleVerifyCode", auto_verify_player + "\n  const handleVerifyCode")
    with open(player_path, "w", encoding="utf-8") as f:
        f.write(p_content)

print("Added auto-verify logic to entry pages.")
