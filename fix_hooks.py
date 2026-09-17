import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Grab all the states that are down below
states_to_move = """  const [isLoading, setIsLoading] = useState(false);

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
  });"""

# Remove it from the current position
content = content.replace(states_to_move, "")

# Find the insertion point (right after `const [roomCode, setRoomCode] = useState...`)
insert_target = "const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');"

# Insert the states right after roomCode
content = content.replace(insert_target, insert_target + "\n\n" + states_to_move)

# 2. Also, remove the redundant `fetchGlobalProfile` useEffect I added earlier,
# because the file ALREADY had a perfectly good `useEffect` on line 69 handling global auth pull!
redundant_use_effect = """  // Watch for auth changes and pull global user profile
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
  }, [user]);"""

content = content.replace(redundant_use_effect, "")

# 3. Inside the remaining useEffect (Line 69), add the setLichessVerified logic!
auth_effect_target = """              lichessId: data.lichessId || prev.lichessId,
              bio: data.bio || prev.bio,
              favOpening: data.favOpening || prev.favOpening,
              photoUrl: currentUser.photoURL || prev.photoUrl,
              email: currentUser.email
            }));"""
            
auth_effect_new = """              lichessId: data.lichessId || prev.lichessId,
              bio: data.bio || prev.bio,
              favOpening: data.favOpening || prev.favOpening,
              photoUrl: currentUser.photoURL || prev.photoUrl,
              email: currentUser.email
            }));
            if (data.lichessId) {
              setLichessVerified(true);
            }"""

content = content.replace(auth_effect_target, auth_effect_new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Consolidated state and hooks")
