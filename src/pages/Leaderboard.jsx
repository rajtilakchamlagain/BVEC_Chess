import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Trophy, Medal, Star, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const tournamentsSnap = await getDocs(collection(db, 'chess_tournaments'));
        
        const playerStats = {}; // Group by rollNumber or name

        for (const tDoc of tournamentsSnap.docs) {
          const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDoc.id, 'players'));
          
          playersSnap.forEach(pDoc => {
            const p = pDoc.data();
            // Need a unique identifier. rollNumber is best, fallback to name
            const uid = p.email ? p.email.toLowerCase() : `${(p.name || '').trim().toLowerCase()}_${(p.rollNumber || '').trim().toLowerCase()}`;
            
            if (!playerStats[uid]) {
              playerStats[uid] = {
                name: p.name,
                rollNumber: p.rollNumber || '',
                course: p.course || '',
                photoUrl: p.photoUrl || '',
                totalWins: 0,
                matchesPlayed: 0,
                tournamentsPlayed: 0,
                tournamentsWon: 0, // 1st place
                rating: 1200 // Starting Elo
              };
            }
            
            playerStats[uid].totalWins += (p.wins || 0);
            playerStats[uid].matchesPlayed += (p.matchesPlayed || 0);
            playerStats[uid].tournamentsPlayed += 1;
            // A basic mock elo calc based on wins
            playerStats[uid].rating += (p.wins || 0) * 15; 
            
            // Note: we'd need tournament final standings to accurately set tournamentsWon.
            // For now we just aggregate total points/wins.
          });
        }

        const sorted = Object.values(playerStats).sort((a, b) => b.totalWins - a.totalWins || b.rating - a.rating);
        setLeaderboardData(sorted);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '1rem', fontWeight: '500' }}>
          <ArrowLeft size={18} /> Back to platform
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), #3b82f6)', padding: '15px', borderRadius: '16px', color: '#fff' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>College Leaderboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '5px 0 0 0' }}>The undisputed rankings across all BVEC tournaments.</p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            Loading global rankings...
          </div>
        ) : (
          <div style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rank</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Player</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Wins</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Events Played</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((player, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--text-muted)' }}>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {player.photoUrl ? (
                          <img src={player.photoUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Users size={20} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{player.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{player.course} • {player.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {player.rating}
                    </td>
                    <td style={{ padding: '1.5rem', fontWeight: '600', fontSize: '1.1rem' }}>
                      {player.totalWins}
                    </td>
                    <td style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
                      {player.tournamentsPlayed}
                    </td>
                  </tr>
                ))}
                {leaderboardData.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
