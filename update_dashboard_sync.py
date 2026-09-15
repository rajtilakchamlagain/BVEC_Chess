import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

sync_func = """
  const handleSyncResult = async (roundId, idx, p1, p2) => {
    const p1Data = players.find(p => p.id === p1);
    const p2Data = players.find(p => p.id === p2);
    
    if (!p1Data || !p2Data) return;
    
    const p1Id = p1Data.lichessId;
    const p2Id = p2Data.lichessId;
    
    if (!p1Id || !p2Id) {
       alert(`Both players must have Lichess IDs in their profiles.\\n${p1Data.name}: ${p1Id || 'MISSING'}\\n${p2Data.name}: ${p2Id || 'MISSING'}`);
       return;
    }
    
    try {
       const res = await fetch(`https://lichess.org/api/games/user/${p1Id}?vs=${p2Id}&max=1`, { headers: { 'Accept': 'application/x-ndjson' } });
       const text = await res.text();
       if (!text) {
           alert("No recent game found between these players on Lichess.");
           return;
       }
       const game = JSON.parse(text);
       let winner = game.winner; // 'white' or 'black' or undefined
       let resString = '0.5-0.5';
       if (winner === 'white') resString = '1-0';
       else if (winner === 'black') resString = '0-1';
       
       const lichessWhite = game.players.white.user.id.toLowerCase();
       if (lichessWhite === p2Id.toLowerCase()) {
           if (resString === '1-0') resString = '0-1';
           else if (resString === '0-1') resString = '1-0';
       }

       await reportResult(roundId, idx, resString);
       alert("Lichess Game Synced Successfully!");
    } catch(e) {
       console.error(e);
       alert("Failed to sync game from Lichess.");
    }
  };
"""

content = content.replace(
    "const reportResult = async (roundId, pairingIndex, result) => {",
    sync_func + "\n\n  const reportResult = async (roundId, pairingIndex, result) => {"
)

# Also add the UI button in the pending section
ui_btn = """
                  {pairing.result === 'pending' && !swapMode && activeRoundData.status === 'published' && roomData?.isOnline && (
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                      <button style={{ width: '100%', background: '#10b981', border: 'none', color: '#000', padding: '8px', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleSyncResult(activeRoundData.id, idx, pairing.player1, pairing.player2)}>
                        Sync from Lichess
                      </button>
                    </div>
                  )}
                  {pairing.result === 'pending' && !swapMode && activeRoundData.status === 'published' && activeRoundData.format !== 'knockout' && (
"""

content = content.replace(
    "{pairing.result === 'pending' && !swapMode && activeRoundData.status === 'published' && activeRoundData.format !== 'knockout' && (",
    ui_btn
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessDashboard")
