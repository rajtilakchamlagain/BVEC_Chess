import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace inline card styles with class
old_card_1 = """          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'var(--primary)' }}
            style={{ background: 'var(--panel-bg)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '300px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease-in-out', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            onClick={() => navigate('/chess-owner-entry')}
          >
            <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={30} color="var(--primary)" />
            </div>"""

new_card_1 = """          <motion.div 
            className="premium-card"
            onClick={() => navigate('/chess-owner-entry')}
          >
            <div className="premium-card-icon">
              <ShieldCheck size={28} />
            </div>"""
content = content.replace(old_card_1, new_card_1)

old_card_2 = """          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'var(--primary)' }}
            style={{ background: 'var(--panel-bg)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '300px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease-in-out', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            onClick={() => navigate('/chess-player-entry')}
          >
            <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Users size={30} color="var(--primary)" />
            </div>"""

new_card_2 = """          <motion.div 
            className="premium-card"
            onClick={() => navigate('/chess-player-entry')}
          >
            <div className="premium-card-icon">
              <Users size={28} />
            </div>"""
content = content.replace(old_card_2, new_card_2)

old_card_3 = """          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'var(--primary)' }}
            style={{ background: 'var(--panel-bg)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '300px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease-in-out', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--primary)' }} title="Access live scores, pairings, and real-time standings as they happen.">
              <Info size={20} />
            </div>
            <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Eye size={30} color="var(--primary)" />
            </div>"""

new_card_3 = """          <motion.div 
            className="premium-card"
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#94a3b8' }} title="Access live scores, pairings, and real-time standings as they happen.">
              <Info size={20} />
            </div>
            <div className="premium-card-icon">
              <Eye size={28} />
            </div>"""
content = content.replace(old_card_3, new_card_3)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LandingPage with premium card classes.")
