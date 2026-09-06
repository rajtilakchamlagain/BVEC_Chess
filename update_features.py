import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add edit name state
content = content.replace(
    "const [selectedPlayer, setSelectedPlayer] = useState(null);",
    "const [selectedPlayer, setSelectedPlayer] = useState(null);\n  const [editingName, setEditingName] = useState(false);\n  const [newName, setNewName] = useState('');"
)

# Reset newName when a player is selected
content = content.replace(
    "onClick={() => setSelectedPlayer(p)}",
    "onClick={() => { setSelectedPlayer(p); setEditingName(false); setNewName(p.name); }}"
)

# Function to update player name
update_name_func = """
  const handleUpdateName = async () => {
    if (!newName.trim() || newName.trim() === selectedPlayer.name) {
      setEditingName(false);
      return;
    }
    try {
      await updateDoc(doc(db, 'chess_tournaments', roomCode, 'players', selectedPlayer.id), { name: newName.trim() });
      setSelectedPlayer({ ...selectedPlayer, name: newName.trim() });
      setEditingName(false);
    } catch (e) {
      console.error(e);
      alert('Failed to update name');
    }
  };
"""

content = content.replace(
    "const exportParticipantsToCSV = () => {",
    update_name_func + "\n\n  const exportParticipantsToCSV = () => {"
)

# Update UI for name editing
name_ui = """
                  {editingName ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold' }}
                      />
                      <button onClick={handleUpdateName} style={{ background: '#10b981', border: 'none', color: '#000', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                      <button onClick={() => setEditingName(false)} style={{ background: 'var(--border-color)', border: 'none', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  ) : (
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {selectedPlayer.name}
                      <button onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    </h2>
                  )}
"""

content = content.replace(
    "<h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{selectedPlayer.name}</h2>",
    name_ui
)

# Share Pairings functionality
share_func = """
  const sharePairings = async () => {
    if (!activeRoundData) return;
    
    let text = `🏆 *ROUND ${activeRoundData.roundNumber} PAIRINGS* 🏆\\n`;
    if (activeRoundData.label) text += `*${activeRoundData.label}*\\n`;
    text += `\\n`;

    activeRoundData.pairings.forEach((p, idx) => {
      text += `*Board ${idx + 1}*\\n`;
      text += `⚪ ${p.player1Name}\\n`;
      text += `⚫ ${p.player2Name}\\n\\n`;
    });

    if (activeRoundData.byePlayers && activeRoundData.byePlayers.length > 0) {
      text += `*BYE (1 Point)*\\n`;
      activeRoundData.byePlayers.forEach(b => text += `🌟 ${b.name}\\n`);
      text += `\\n`;
    }
    
    text += `Follow live at: https://bvecchess.vercel.app/room?room=${roomCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Round ${activeRoundData.roundNumber} Pairings`,
          text: text
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Pairings copied to clipboard! You can now paste them in WhatsApp.');
      }
    } catch (e) {
      console.error(e);
      await navigator.clipboard.writeText(text);
      alert('Pairings copied to clipboard! You can now paste them in WhatsApp.');
    }
  };
"""

content = content.replace(
    "const exportParticipantsToCSV = () => {",
    share_func + "\n\n  const exportParticipantsToCSV = () => {"
)

# Add share button to Top Control Bar
share_btn = """
                <button 
                  onClick={sharePairings}
                  style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Share2 size={18} /> Share Pairings
                </button>
"""

content = content.replace(
    "Trash2, Edit2, UserX, CheckCircle2, MoreVertical, ShieldAlert, RotateCcw, Settings, X, Download } from 'lucide-react';",
    "Trash2, Edit2, UserX, CheckCircle2, MoreVertical, ShieldAlert, RotateCcw, Settings, X, Download, Share2 } from 'lucide-react';"
)

content = content.replace(
    "<button \n                  onClick={() => setShowSwissModal(true)}",
    share_btn + "\n\n              <button \n                  onClick={() => setShowSwissModal(true)}"
)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
