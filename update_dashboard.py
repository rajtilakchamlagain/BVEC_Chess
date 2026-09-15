import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add autoSyncAll matches function
sync_all_func = """
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const autoSyncAll = async () => {
    if (!activeRoundData || activeRoundData.status !== 'published') return;
    setIsSyncingAll(true);
    let updatedCount = 0;
    
    for (let idx = 0; idx < activeRoundData.pairings.length; idx++) {
      const pairing = activeRoundData.pairings[idx];
      if (pairing.result !== 'pending') continue; // Skip resolved games
      
      const p1Data = players.find(p => p.id === pairing.player1);
      const p2Data = players.find(p => p.id === pairing.player2);
      if (!p1Data?.lichessId || !p2Data?.lichessId) continue;
      
      try {
         const res = await fetch(`https://lichess.org/api/games/user/${p1Data.lichessId}?vs=${p2Data.lichessId}&max=1`, { headers: { 'Accept': 'application/x-ndjson' } });
         const text = await res.text();
         if (text) {
             const game = JSON.parse(text);
             let winner = game.winner; 
             let resString = '0.5-0.5';
             if (winner === 'white') resString = '1-0';
             else if (winner === 'black') resString = '0-1';
             await reportResult(activeRoundData.id, idx, resString, true); // Added true flag to silent alert
             updatedCount++;
         }
      } catch (e) {
        console.error(e);
      }
      // Delay to avoid hitting Lichess rate limits too hard
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsSyncingAll(false);
    if (updatedCount > 0) alert(`Successfully synced ${updatedCount} matches from Lichess!`);
    else alert('No new completed matches found on Lichess.');
  };
"""

content = content.replace("  const finishTournament = async () => {", sync_all_func + "\n  const finishTournament = async () => {")

# To silence alerts during autoSyncAll, update reportResult
content = content.replace(
    "const reportResult = async (roundId, pairingIndex, result) => {",
    "const reportResult = async (roundId, pairingIndex, result, silent = false) => {"
)

# Add button to the top action bar when round is published and isOnline is true
target_button = """              <div className="dashboard-actions">
                {activeRoundData?.status === 'completed' && ("""
new_button = """              <div className="dashboard-actions">
                {roomData?.isOnline && activeRoundData?.status === 'published' && (
                  <button 
                    onClick={autoSyncAll}
                    disabled={isSyncingAll}
                    style={{ background: '#10b981', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', opacity: isSyncingAll ? 0.7 : 1 }}
                  >
                    <RefreshCcw size={18} className={isSyncingAll ? 'spin' : ''} /> {isSyncingAll ? 'Syncing...' : 'Auto-Sync Pending Matches'}
                  </button>
                )}
                {activeRoundData?.status === 'completed' && ("""

# Need to import RefreshCcw
content = content.replace(
    "import { Users, Copy, Check, Clock, Trophy, Settings, ChevronRight, Swords, RefreshCw, AlertCircle, Shuffle, ShieldAlert, ArrowLeft, Download, RotateCcw, CheckCircle2 } from 'lucide-react';",
    "import { Users, Copy, Check, Clock, Trophy, Settings, ChevronRight, Swords, RefreshCw, RefreshCcw, AlertCircle, Shuffle, ShieldAlert, ArrowLeft, Download, RotateCcw, CheckCircle2 } from 'lucide-react';"
)

content = content.replace(target_button, new_button)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessDashboard")
