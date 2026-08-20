import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

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
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* Premium Header */}
      <header style={{ 
        padding: '1.5rem 4rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.jpg" alt="BVEC Logo" style={{ height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
              ChessVerse
            </h1>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Platform</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Tournaments</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Rules</span>
        </nav>
      </header>

      {/* Hero Section */}
      <div style={{ 
        padding: '8rem 2rem 6rem', 
        textAlign: 'center', 
        maxWidth: '900px', 
        margin: '0 auto',
      }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', marginBottom: '2rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)', background: 'var(--panel-bg)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }} />
            Barak Valley Engineering College
          </div>
          
          <h2 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            The definitive platform <br />
            <span style={{ color: 'var(--text-muted)' }}>
              for competitive chess.
            </span>
          </h2>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.6' }}>
            Streamlined tournament management, intelligent Swiss pairings, and real-time live spectating. Built exclusively for our chess community.
          </p>
        </motion.div>

        {/* Minimalist Action Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -4, borderColor: '#444' }}
            style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '280px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => navigate('/chess-owner-entry')}
          >
            <ShieldCheck size={24} color="var(--text-main)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '600' }}>Host Arena</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>Manage brackets, generate rounds, and control the leaderboard.</p>
            <div style={{ color: 'var(--secondary)', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Enter dashboard <ArrowRight size={14} />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -4, borderColor: '#444' }}
            style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '280px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => navigate('/chess-player-entry')}
          >
            <Users size={24} color="var(--text-main)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '600' }}>Player Entry</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>Register with your FIDE/AICF ID and join the active tournament.</p>
            <div style={{ color: 'var(--secondary)', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Join lobby <ArrowRight size={14} />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -4, borderColor: '#444' }}
            style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '280px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <Eye size={24} color="var(--text-main)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '600' }}>Spectator Mode</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>Watch live match results and leaderboard standings in real-time.</p>
            <div style={{ color: 'var(--secondary)', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Watch live <ArrowRight size={14} />
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '3rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/chesslogo.jpeg" alt="Chess Logo" style={{ height: '30px', borderRadius: '4px', opacity: 0.8 }} />
          <span>© {new Date().getFullYear()} BVEC Chess Club.</span>
        </div>
        <div>
          Engineered by Rajtilak Chamlagain
        </div>
      </footer>

    </div>
  );
}
