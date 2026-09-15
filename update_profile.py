import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ProfilePage.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add new imports
if "from 'firebase/firestore';" in content:
    content = content.replace(
        "import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';",
        "import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';"
    )
if "from 'lucide-react';" in content:
    content = content.replace(
        "ArrowLeft, UserCircle, CheckCircle, XCircle } from 'lucide-react';",
        "ArrowLeft, UserCircle, CheckCircle, XCircle, Trophy, Swords, Medal } from 'lucide-react';"
    )

# Add aggregated stats state
if "const [aggregatedStats, setAggregatedStats]" not in content:
    content = content.replace(
        "const [verifications, setVerifications]",
        "const [aggregatedStats, setAggregatedStats] = useState({ totalWins: 0, tournamentsPlayed: 0, rating: 1200 });\n    const [verifications, setVerifications]"
    )

# Fetch stats inside useEffect
stats_logic = """
            // Fetch aggregated stats
            const tournamentsSnap = await getDocs(collection(db, 'chess_tournaments'));
            let totalWins = 0;
            let tournamentsPlayed = 0;
            let rating = 1200;
            
            for (const tDoc of tournamentsSnap.docs) {
              const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDoc.id, 'players'));
              let playedInThis = false;
              playersSnap.forEach(pDoc => {
                const p = pDoc.data();
                if (p.email === currentUser.email || (p.rollNumber && p.rollNumber.toUpperCase() === docSnap.data()?.rollNumber?.toUpperCase())) {
                  playedInThis = true;
                  totalWins += (p.wins || 0);
                  rating += (p.wins || 0) * 15;
                }
              });
              if (playedInThis) tournamentsPlayed++;
            }
            setAggregatedStats({ totalWins, tournamentsPlayed, rating });
"""

content = content.replace(
    "setProfileData({ ...profileData, name: currentUser.displayName || '' });\n            }",
    "setProfileData({ ...profileData, name: currentUser.displayName || '' });\n            }\n" + stats_logic
)

# Render stats in the UI
stats_ui = """
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>{aggregatedStats.rating}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Elo</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>{aggregatedStats.totalWins}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Wins</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>{aggregatedStats.tournamentsPlayed}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Events</div>
                </div>
              </div>
            </div>
"""

content = content.replace(
    "</div>\n            </div>\n  \n            <div style={{ display: 'grid'",
    "</div>\n" + stats_ui + "\n            <div style={{ display: 'grid'"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ProfilePage")
