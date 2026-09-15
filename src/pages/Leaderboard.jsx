import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Trophy, Medal, Star, TrendingUp, Users, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const tournamentsSnap = await getDocs(collection(db, 'chess_tournaments'));
        
        const playerStats = {}; 

        for (const tDoc of tournamentsSnap.docs) {
          const tName = tDoc.data().name || 'Unknown Tournament';
          const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDoc.id, 'players'));
          
          // To calculate badges, we sort players in this tournament by wins
          const tPlayers = [];
          playersSnap.forEach(pDoc => tPlayers.push({ id: pDoc.id, ...pDoc.data() }));
          tPlayers.sort((a, b) => (b.wins || 0) - (a.wins || 0));

          tPlayers.forEach((p, index) => {
            // Filter out players without email
            if (!p.email || typeof p.email !== 'string' || p.email.trim() === '') return;
            const uid = p.email.toLowerCase();
            const rankInTourney = index + 1;
            
            if (!playerStats[uid]) {
              playerStats[uid] = {
                name: p.name,
                rollNumber: p.rollNumber || '',
                course: p.course || '',
                photoUrl: p.photoUrl || '',
                email: p.email,
                totalWins: 0,
                matchesPlayed: 0,
                tournamentsPlayed: 0,
                rating: 1200, 
                badges: { gold: 0, silver: 0, bronze: 0 },
                history: []
              };
            }
            
            playerStats[uid].totalWins += (p.wins || 0);
            playerStats[uid].matchesPlayed += (p.matchesPlayed || 0);
            playerStats[uid].tournamentsPlayed += 1;
            playerStats[uid].rating += (p.wins || 0) * 15; 
            
            // Badges
            if (rankInTourney === 1 && (p.wins || 0) > 0) playerStats[uid].badges.gold += 1;
            else if (rankInTourney === 2 && (p.wins || 0) > 0) playerStats[uid].badges.silver += 1;
            else if (rankInTourney === 3 && (p.wins || 0) > 0) playerStats[uid].badges.bronze += 1;

            // History
            playerStats[uid].history.push({
              tournamentName: tName,
              rank: rankInTourney,
              wins: p.wins || 0
            });
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

  
  const getBadgeIcon = (type) => {
    if (type === 'gold') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' }}>{"\u{1F947}"}</span>;
    if (type === 'silver') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(192,192,192,0.4))' }}>{"\u{1F948}"}</span>;
    if (type === 'bronze') return <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(205,127,50,0.4))' }}>{"\u{1F949}"}</span>;
  };

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-main)', minHeight: '100vh', padding: '1rem', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '1rem' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '1rem', fontWeight: '500', padding: 0 }}>
          <ArrowLeft size={18} /> Back to platform
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), #3b82f6)', padding: '15px', borderRadius: '16px', color: '#fff' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Global Leaderboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', margin: '5px 0 0 0' }}>The undisputed rankings across all BVEC tournaments.</p>
          </div>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
          <span><strong>Note:</strong> Players who registered anonymously (without signing in) are hidden from the Global Leaderboard, but they still appear in their specific tournament's local standings.</span>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            Loading global rankings...
          </div>
        ) : (
          <div style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rank</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Player</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Badges</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Wins</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((player, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedPlayer({...player, rank: idx + 1})}
                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} 
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--text-muted)' }}>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {player.photoUrl ? (
                          <img src={player.photoUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Users size={20} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-main)' }}>{player.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.course || 'B.Tech'} - {player.rollNumber || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {player.badges.gold > 0 && <span title="1st Place Finishes">{getBadgeIcon('gold')} <span style={{fontSize:'0.8rem', fontWeight:'bold'}}>x{player.badges.gold}</span></span>}
                        {player.badges.silver > 0 && <span title="2nd Place Finishes">{getBadgeIcon('silver')} <span style={{fontSize:'0.8rem', fontWeight:'bold'}}>x{player.badges.silver}</span></span>}
                        {player.badges.bronze > 0 && <span title="3rd Place Finishes">{getBadgeIcon('bronze')} <span style={{fontSize:'0.8rem', fontWeight:'bold'}}>x{player.badges.bronze}</span></span>}
                        {player.badges.gold === 0 && player.badges.silver === 0 && player.badges.bronze === 0 && <span style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>-</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '900', fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {player.rating}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {player.totalWins}
                    </td>
                  </tr>
                ))}
                {leaderboardData.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No ranked players found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Player Profile Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--panel-bg)', borderRadius: '20px', width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            >
              <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <button onClick={() => setSelectedPlayer(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
                </button>
                
                {selectedPlayer.photoUrl ? (
                  <img src={selectedPlayer.photoUrl} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', margin: '0 auto 1rem' }} />
                ) : (
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', margin: '0 auto 1rem', border: '4px solid var(--primary)' }}>
                    <Users size={40} />
                  </div>
                )}
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '800' }}>{selectedPlayer.name}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Global Rank: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>#{selectedPlayer.rank}</span></div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <div style={{ background: 'var(--bg-color)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>{selectedPlayer.rating}</div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Elo</div>
                  </div>
                  <div style={{ background: 'var(--bg-color)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>{selectedPlayer.totalWins}</div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Wins</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem 2rem', background: 'rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tournament History</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                  {selectedPlayer.history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--panel-bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{h.tournamentName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.wins} Wins</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {h.rank === 1 && getBadgeIcon('gold')}
                        {h.rank === 2 && getBadgeIcon('silver')}
                        {h.rank === 3 && getBadgeIcon('bronze')}
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>#{h.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
