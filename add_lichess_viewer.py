import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to add the Lichess buttons just below the Player 2 (Black) block.
# Look for where it says:
#                           </div>
#                         </div>
#                       </motion.div>
#                     ))}
#                   </div>
#                 </div>
#               );

# Or just find the Player 2 div end and add the Lichess buttons.
target_block = """                        {/* Player 2 (Black) */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '1rem', 
                          background: pairing.result === '0-1' ? 'var(--border-color)' : 'var(--bg-color)', 
                          borderRadius: '12px',
                          border: pairing.player2Color === 'white' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: pairing.player2Color === 'white' ? 'var(--text-main)' : 'var(--text-main)', border: '2px solid #555' }} />
                            <span style={{ fontWeight: '600', fontSize: '1rem', color: pairing.result === '1-0' ? '#52525b' : 'var(--text-main)' }}>{pairing.player2Name}</span>
                          </div>
                          {(pairing.result === '0-1' || pairing.result === '0.5-0.5') && (
                            <span style={{ fontWeight: 'bold', color: pairing.result === '0-1' ? '#10b981' : 'var(--text-muted)' }}>
                              {pairing.result === '0-1' ? '1' : '½'}
                            </span>
                          )}
                        </div>"""

new_block = target_block + """
                        
                        {roomData?.isOnline && pairing.result === 'pending' && activeRound.status === 'published' && (
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <a 
                              href={`https://lichess.org/?user=${players.find(p => p.id === pairing.player2)?.lichessId}#friend`} 
                              target="_blank" rel="noreferrer" 
                              style={{ flex: 1, padding: '10px', textAlign: 'center', background: '#10b981', color: '#000', textDecoration: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}
                            >
                              Challenge {pairing.player2Name.split(' ')[0]}
                            </a>
                            <a 
                              href={`https://lichess.org/?user=${players.find(p => p.id === pairing.player1)?.lichessId}#friend`} 
                              target="_blank" rel="noreferrer" 
                              style={{ flex: 1, padding: '10px', textAlign: 'center', background: '#10b981', color: '#000', textDecoration: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}
                            >
                              Challenge {pairing.player1Name.split(' ')[0]}
                            </a>
                          </div>
                        )}"""

content = content.replace(target_block, new_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ChessViewerRoom with Lichess Challenge Buttons")
