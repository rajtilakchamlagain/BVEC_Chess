import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Trophy, Users, Eye, ShieldCheck, ArrowRight, Info , LogIn, UserCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  return (
    <div style={{ 
      background: 'var(--bg-color)', 
      color: 'var(--text-main)', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'absolute', 
      top: 0, 
      left: 0,
      overflowY: 'auto',
      fontFamily: '"Inter", sans-serif',
      backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(37, 99, 235, 0.05) 0%, rgba(255,255,255,0) 70%)'
    }}>
      
      {/* Premium Header */}
      <header className="landing-header" style={{ 
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/logo.jpg" alt="BVEC Logo" style={{ height: '80px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
              ChessVerse
            </h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>
              Barak Valley Engineering College
            </div>
          </div>
        </div>
        
        <div className="landing-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <nav style={{ display: 'flex', gap: '2rem', fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)', alignItems: 'center' }}>
            <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/')}>Platform</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'} onClick={() => navigate('/chess-viewer-entry')}>Tournaments</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'} onClick={() => setShowRulesModal(true)}>Rules</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'} onClick={() => setShowAboutModal(true)}>About</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {user ? (
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setShowUserMenu(!showUserMenu)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--panel-bg)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Account</span>
                  </div>
                  {showUserMenu && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: '160px', zIndex: 100 }}>
                      <div 
                        onClick={() => { setShowUserMenu(false); navigate('/profile'); }} 
                        style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        My Profile
                      </div>
                      <div 
                        onClick={() => { setShowUserMenu(false); navigate('/chess-owner-entry'); }} 
                        style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Host Arena
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/chess-owner-entry')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <UserCircle size={20} color="var(--primary)" /> Sign In
                </button>
              )}
              <img src="/chesslogo.jpeg" alt="Chess Club" style={{ height: '80px', borderRadius: '8px' }} />
            </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="landing-main" style={{ 
        flex: 1, 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto',
      }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem', border: '1px solid var(--border-color)', color: 'var(--primary)', background: 'rgba(37, 99, 235, 0.05)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
            BVEC Chess Portal
          </div>
          
          <h2 className="landing-hero-title">
            Tournament Management <br />
            <span style={{ color: 'var(--text-muted)' }}>
              Done Right.
            </span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 4rem', lineHeight: '1.6' }}>
            Host and manage college chess tournaments with live pairings, automated matching, and real-time standings.
          </p>
        </motion.div>

        {/* Minimalist Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
          
          {/* Main Card: Tournaments (Spectator) */}
          <motion.div 
            className="premium-card"
            style={{ width: '100%', maxWidth: '630px' }}
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#94a3b8' }} title="Access live scores, pairings, and real-time standings as they happen.">
              <Info size={20} />
            </div>
            <div className="premium-card-icon">
              <Eye size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '800' }}>Tournaments</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' }}>Follow live scores, view ongoing match results, and check real-time standings from your phone.</p>
            <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Enter Room <ArrowRight size={16} />
            </div>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', width: '100%', maxWidth: '630px' }}>
            
            {/* Card 2: Host */}
            <motion.div 
              className="premium-card"
              style={{ flex: 1, minWidth: '280px' }}
              onClick={() => navigate('/chess-owner-entry')}
            >
              <div className="premium-card-icon">
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Host Dashboard</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Create a tournament, manage pairings, and update live results.</p>
              <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Open Dashboard <ArrowRight size={16} />
              </div>
            </motion.div>

            {/* Card 3: Player */}
            <motion.div 
              className="premium-card"
              style={{ flex: 1, minWidth: '280px' }}
              onClick={() => navigate('/chess-player-entry')}
            >
              <div className="premium-card-icon">
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Player Registration</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Enter your details to join an active tournament lobby.</p>
              <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Register Here <ArrowRight size={16} />
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ height: '40px', borderRadius: '6px' }} />
          <span>© {new Date().getFullYear()} Barak Valley Engineering College. All rights reserved.</span>
        </div>
        <div style={{ fontWeight: '500' }}>
          Developed by Rajtilak Chamlagain
        </div>
      </footer>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRulesModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowRulesModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', maxHeight: '80vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowRulesModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck /> FIDE Standard Rules
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>1. Touch-Move Rule</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>If a player touches one of their own pieces, they must move it if it has a legal move. If they touch an opponent's piece, they must capture it if legal.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>2. Castling</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>The king must be touched and moved first. If the rook is touched first, castling is not allowed and the rook must move.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>3. En Passant</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>If a pawn moves two squares forward from its starting position and lands beside an opponent's pawn, the opponent can capture it as if it had only moved one square (only on the very next turn).</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>4. Pawn Promotion</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>When a pawn reaches the opposite end of the board, it must be exchanged for a Queen, Rook, Bishop, or Knight of the same color.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>5. Time Controls & Clocks</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Players must press the clock with the same hand used to move the piece. Running out of time results in a loss, provided the opponent has enough material to checkmate.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowAboutModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', maxWidth: '450px', width: '100%', padding: '2.5rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowAboutModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #a855f7)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
                RC
              </div>
              
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Rajtilak Chamlagain</h2>
              <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '1.5rem' }}>Full Stack Developer & Creator</p>
              
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                I built ChessVerse to provide a seamless, real-time tournament management experience for the BVEC Chess Club. Passionate about creating modern, scalable web applications.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <a href="https://github.com/rajtilakchamlagain" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', transition: 'all 0.2s', border: '1px solid var(--border-color)' }} onMouseEnter={e => {e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black';}} onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-main)';}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/rajtilakchamlagain" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: '#0a66c2', transition: 'all 0.2s', border: '1px solid var(--border-color)' }} onMouseEnter={e => {e.currentTarget.style.background = '#0a66c2'; e.currentTarget.style.color = 'white';}} onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#0a66c2';}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://instagram.com/rajtilak_chamlagain" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: '#e1306c', transition: 'all 0.2s', border: '1px solid var(--border-color)' }} onMouseEnter={e => {e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'; e.currentTarget.style.color = 'white';}} onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e1306c';}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
