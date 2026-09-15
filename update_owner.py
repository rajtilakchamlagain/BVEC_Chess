import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessOwnerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update initial state
content = content.replace(
    "logoUrl: ''",
    "logoUrl: '',\n    isOnline: false,\n    timeControlLimit: 10,\n    timeControlIncrement: 0"
)

# Render inputs when isOnline is true
online_checkbox = """                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <input 
                          type="checkbox" 
                          id="isOnline"
                          checked={tournamentData.isOnline}
                          onChange={e => setTournamentData({...tournamentData, isOnline: e.target.checked})}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="isOnline" style={{ margin: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Online Tournament</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enable Lichess / Chess.com automated result syncing</span>
                        </label>
                      </div>"""

new_online_section = online_checkbox + """
                      
                      {tournamentData.isOnline && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <div className="input-group" style={{ flex: 1 }}>
                            <label>Time Control (Minutes)</label>
                            <input 
                              type="number" 
                              className="premium-input" 
                              value={tournamentData.timeControlLimit}
                              onChange={e => setTournamentData({...tournamentData, timeControlLimit: parseInt(e.target.value) || 0})}
                              min="1"
                            />
                          </div>
                          <div className="input-group" style={{ flex: 1 }}>
                            <label>Increment (Seconds)</label>
                            <input 
                              type="number" 
                              className="premium-input" 
                              value={tournamentData.timeControlIncrement}
                              onChange={e => setTournamentData({...tournamentData, timeControlIncrement: parseInt(e.target.value) || 0})}
                              min="0"
                            />
                          </div>
                        </div>
                      )}"""

content = content.replace(online_checkbox, new_online_section)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessOwnerEntry")
