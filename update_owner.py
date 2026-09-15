import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessOwnerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "hostName: '',\n      logoUrl: ''",
    "hostName: '',\n      logoUrl: '',\n      isOnline: false"
)

toggle_ui = """
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
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
                    </div>
"""

content = content.replace(
    "onChange={e => setTournamentData({...tournamentData, logoUrl: e.target.value})}\n                      />\n                    </div>",
    "onChange={e => setTournamentData({...tournamentData, logoUrl: e.target.value})}\n                      />\n                    </div>\n" + toggle_ui
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessOwnerEntry")
