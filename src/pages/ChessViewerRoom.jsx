import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, ArrowLeft, LayoutGrid, Users, Menu, X } from 'lucide-react';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateRankings } from '../utils/chessLogic';

export default function ChessViewerRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');
  
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [viewMode, setViewMode] = useState('live'); // 'live' or 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const rankedPlayers = useMemo(() => {
    const format = rounds.length > 0 ? rounds[0].format : 'staircase';
    return calculateRankings(players, rounds, format);
  }, [players, rounds]);
  
  useEffect(() => {
    if (!roomCode) {
      navigate('/');
      return;
    }

    const roomRef = doc(db, 'chess_tournaments', roomCode);
    const unsubRoom = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        setRoomData(doc.data());
      }
    });

    const playersRef = collection(db, 'chess_tournaments', roomCode, 'players');
    const unsubPlayers = onSnapshot(playersRef, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(p);
    });

    const roundsRef = collection(db, 'chess_tournaments', roomCode, 'rounds');
    const unsubRounds = onSnapshot(roundsRef, (snapshot) => {
      const r = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      r.sort((a, b) => b.roundNumber - a.roundNumber); // Latest round first
      setRounds(r);
    });

    return () => {
      unsubRoom();
      unsubPlayers();
      unsubRounds();
    };
  }, [roomCode, navigate]);

  if (!roomData) {
    return (
      <div className="spectator-layout" style={{ background: "var(--bg-color)", color: "var(--text-main)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Trophy size={48} color="#aaa" />
        </motion.div>
      </div>
    );
  }

  // Find the most recent published round
  const activeRound = rounds.find(r => r.status === 'published' || r.status === 'completed');

  return (
    <div style={{ 
      background: 'var(--bg-color)', 
      color: 'var(--text-main)', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header */}
      <header style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--border-color)', 
        background: 'var(--panel-bg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {roomData.logoUrl ? (
              <img src={roomData.logoUrl} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #111, #333)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} color="#fff" />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{roomData.name}</h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                Live Broadcast
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="spectator-layout" style={{ position: 'relative' }}>
        {/* Mobile Sidebar Overlay */}
        <div className={`sidebar-overlay ${showSidebar ? 'open' : ''}`} onClick={() => setShowSidebar(false)} />
        
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
          {showSidebar ? 'Close' : 'Leaderboard'}
        </button>
        
        {/* Standings Sidebar */}
        <div className={`spectator-sidebar ${showSidebar ? 'open' : ''}`}>
          <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} color="#aaa" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Live Leaderboard</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 8px', fontSize: '0.75rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span style={{flex: 1}}>Player</span>
              <div style={{ display: 'flex', gap: '10px', width: '90px', justifyContent: 'flex-end', paddingRight: '15px' }}>
                <span title="Buchholz Score">BUC</span>
                <span title="Sonneborn-Berger">SB</span>
                <span>Pts</span>
              </div>
            </div>
            
            <AnimatePresence>
              {rankedPlayers.map((p, i) => ({...p, originalRank: i+1})).filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, idx) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1rem', 
                    background: idx === 0 ? 'linear-gradient(90deg, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 100%)' : 'var(--panel-bg)', 
                    borderRadius: '12px', 
                    marginBottom: '8px',
                    borderLeft: idx === 0 ? '3px solid #ffd700' : idx === 1 ? '3px solid #c0c0c0' : idx === 2 ? '3px solid #cd7f32' : '3px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '20px', fontWeight: 'bold' }}>{p.originalRank}</span>
                    {p.photoUrl ? (
                      <img src={p.photoUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: idx === 0 ? '2px solid #ffd700' : '2px solid transparent' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={16} color="#555" />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '140px' }}>
                      <span style={{ fontWeight: '500', fontSize: '1.05rem', color: idx < 3 ? 'var(--text-main)' : '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      {p.course && <span style={{ fontSize: '0.7rem', color: '#52525b' }}>{p.course} {p.branch && `- ${p.branch.includes('(') ? p.branch.match(/\((.*?)\)/)[1] : p.branch}`} ({p.year} YR)</span>}
                      {p.designation && <span style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>{p.designation}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', width: '20px', textAlign: 'right' }}>{p.BUC || 0}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', width: '20px', textAlign: 'right' }}>{p.SB || 0}</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1rem', width: '25px', textAlign: 'right' }}>{p.wins || 0}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {players.length === 0 && (
              <div style={{ textAlign: 'center', color: '#52525b', padding: '3rem 0' }}>Waiting for players...</div>
            )}
            
            {players.length > 0 && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <div style={{ fontWeight: 'bold', color: '#aaa', marginBottom: '8px' }}>Tiebreak Legend (FIDE Rules):</div>
                <div style={{ marginBottom: '4px' }}><strong>BUC (Buchholz):</strong> Sum of all opponents' scores. Rewards players who faced tougher opponents.</div>
                <div><strong>SB (Sonneborn-Berger):</strong> Sum of defeated opponents' scores + half of drawn opponents' scores. Rewards players who beat high-scoring opponents.</div>
              </div>
            )}
          </div>
        </div>

        {/* Pairings Area */}
        <div className="spectator-content">
          
          <div style={{ marginBottom: '2rem' }}>
              <input 
                type="text" 
                placeholder="Search your name to find your board..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--panel-bg)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <button onClick={() => setViewMode('live')} style={{ background: 'none', border: 'none', color: viewMode === 'live' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: viewMode === 'live' ? 'bold' : 'normal', fontSize: '1rem', cursor: 'pointer', padding: '0 0 8px 0', borderBottom: viewMode === 'live' ? '2px solid #10b981' : '2px solid transparent' }}>
              Live Matchups
            </button>
            <button onClick={() => setViewMode('history')} style={{ background: 'none', border: 'none', color: viewMode === 'history' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: viewMode === 'history' ? 'bold' : 'normal', fontSize: '1rem', cursor: 'pointer', padding: '0 0 8px 0', borderBottom: viewMode === 'history' ? '2px solid #10b981' : '2px solid transparent' }}>
              Tournament History
            </button>
          </div>

          {viewMode === 'live' ? (
            !activeRound ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <LayoutGrid size={64} style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: '300' }}>Waiting for Pairings</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>The host has not published the first round yet.</p>
            </div>
          ) : (
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: '3rem' }}
              >
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Current Matches</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>Live • Auto-updating</div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', margin: 0 }}>
                  Round {activeRound.roundNumber}
                </h2>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence>
                  {activeRound.pairings.map((p, i) => ({...p, originalBoard: i+1})).filter(p => p.player1Name.toLowerCase().includes(searchQuery.toLowerCase()) || p.player2Name.toLowerCase().includes(searchQuery.toLowerCase())).map((pairing, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      style={{ 
                        background: 'linear-gradient(145deg, var(--border-color) 0%, rgba(255,255,255,0.01) 100%)', 
                        borderRadius: '20px', 
                        border: '1px solid var(--border-color)', 
                        padding: '1.2rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1px' }}>
                          BOARD {pairing.originalBoard} {pairing.matchType && <span style={{ color: 'var(--secondary)', marginLeft: '5px' }}>• {pairing.matchType}</span>}
                        </div>
                        {pairing.result !== 'pending' && (
                          <div style={{ background: 'var(--border-color)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            FINISHED
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        
                        {/* Player 1 (White) */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '1rem', 
                          background: pairing.result === '1-0' ? 'var(--border-color)' : 'var(--bg-color)', 
                          borderRadius: '12px',
                          border: pairing.player1Color === 'white' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: pairing.player1Color === 'white' ? 'var(--text-main)' : 'var(--text-main)', border: '2px solid #555' }} />
                            <span style={{ fontWeight: '600', fontSize: '1rem', color: pairing.result === '0-1' ? '#52525b' : 'var(--text-main)' }}>{pairing.player1Name}</span>
                          </div>
                          {(pairing.result === '1-0' || pairing.result === '0.5-0.5') && (
                            <span style={{ fontWeight: 'bold', color: pairing.result === '1-0' ? '#10b981' : 'var(--text-muted)' }}>
                              {pairing.result === '1-0' ? '1' : '½'}
                            </span>
                          )}
                        </div>

                        {/* Player 2 (Black) */}
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
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {activeRound.byePlayers && activeRound.byePlayers.map((bp, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      background: 'var(--panel-bg)', 
                      borderRadius: '20px', 
                      border: '1px dashed var(--border-color)', 
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: '600', letterSpacing: '1px', marginBottom: '1rem' }}>GOLDEN BYE (1 POINT)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{bp.name}</div>
                  </motion.div>
                ))}

              </div>
            </div>
          )) : viewMode === 'history' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {rounds.filter(r => r.status !== 'draft').map(r => (
                  <div key={r.id}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Round {r.roundNumber} {r.label && <span style={{color: 'var(--text-muted)', fontSize:'1rem'}}>({r.label})</span>}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {r.pairings.map((p, idx) => (
                        <div key={idx} style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Board {idx+1}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: p.result === '1-0' ? '#10b981' : p.result === '0-1' ? '#52525b' : 'var(--text-main)' }}>{p.player1Name}</span>
                            <span style={{ fontWeight: 'bold' }}>{p.result === '1-0' ? '1' : p.result === '0.5-0.5' ? '½' : '0'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: p.result === '0-1' ? '#10b981' : p.result === '1-0' ? '#52525b' : 'var(--text-main)' }}>{p.player2Name}</span>
                            <span style={{ fontWeight: 'bold' }}>{p.result === '0-1' ? '1' : p.result === '0.5-0.5' ? '½' : '0'}</span>
                          </div>
                        </div>
                      ))}
                      {r.byePlayers && r.byePlayers.map((bp, idx) => (
                        <div key={'bye'+idx} style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '12px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#ffd700' }}>{bp.name} (Bye)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {rounds.filter(r => r.status !== 'draft').length === 0 && (
                  <div style={{ textAlign: 'center', color: '#52525b', padding: '3rem' }}>No history available yet.</div>
                )}
              </div>
          ) : null}

        </div>
      </main>
    </div>
  );
}
