import re

with open('src/pages/ChessPlayerEntry.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'lichessAuth' not in content:
    content = content.replace("import { doc, setDoc, getDoc } from 'firebase/firestore';", "import { doc, setDoc, getDoc } from 'firebase/firestore';\nimport { startLichessAuth, finishLichessAuth } from '../utils/lichessAuth.js';")

# Add useEffect for Lichess return
if 'finishLichessAuth' not in content.split('useEffect')[1]: # Very basic check
    use_effect_logic = """
  // Check for Lichess OAuth return code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const savedRoom = localStorage.getItem('lichess_room_code');
    
    if (code && savedRoom && !playerData.lichessId) {
      setIsLoading(true);
      finishLichessAuth(code).then(user => {
        if (user) {
          setPlayerData(prev => ({
            ...prev,
            name: user.username, // Auto-fill their username
            lichessId: user.username,
            rating: user.perfs?.blitz?.rating || user.perfs?.rapid?.rating || 1500
          }));
          setLichessVerified(true);
          setRoomCode(savedRoom);
          
          // Clean up URL so they don't refresh and re-trigger
          window.history.replaceState({}, document.title, window.location.pathname + '?room=' + savedRoom);
          
          alert('Lichess Account Verified Successfully!');
        }
        setIsLoading(false);
      });
    }
  }, []);
"""
    # Insert it right before const fetchTournamentData = async () => {
    content = content.replace("const fetchTournamentData = async () => {", use_effect_logic + "\n  const fetchTournamentData = async () => {")

# Update button
button_replacement = """
                    onClick={() => {
                        startLichessAuth(roomCode);
                    }} 
"""
content = re.sub(r"onClick=\{\(\) => \{\s*const clientId = 'chessverse-app';.*?\}\}", button_replacement, content, flags=re.DOTALL)

with open('src/pages/ChessPlayerEntry.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully injected Lichess Auth logic into ChessPlayerEntry.jsx')
