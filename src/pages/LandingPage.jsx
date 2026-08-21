import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Eye, ShieldCheck, ArrowRight, Info } from 'lucide-react';
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
        
        <div className="landing-nav">
          <nav style={{ display: 'flex', gap: '2rem', fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Platform</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Tournaments</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Rules</span>
          </nav>
          <img src="/chesslogo.jpeg" alt="Chess Club" style={{ height: '80px', borderRadius: '8px' }} />
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
            Official Tournament Engine
          </div>
          
          <h2 className="landing-hero-title">
            The definitive platform <br />
            <span style={{ color: 'var(--text-muted)' }}>
              for competitive chess.
            </span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 4rem', lineHeight: '1.6' }}>
            Streamlined tournament management, intelligent Swiss pairings, and real-time live spectating. Built exclusively for our chess community.
          </p>
        </motion.div>

        {/* Minimalist Action Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'var(--primary)' }}
            style={{ background: 'var(--panel-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '300px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/chess-owner-entry')}
          >
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={30} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Host Arena</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Manage brackets, generate rounds, and control the leaderboard.</p>
            <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Enter dashboard <ArrowRight size={16} />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'var(--primary)' }}
            style={{ background: 'var(--panel-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '300px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/chess-player-entry')}
          >
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Users size={30} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Player Entry</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Register with your FIDE/AICF ID and join the active tournament.</p>
            <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Join lobby <ArrowRight size={16} />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'var(--primary)' }}
            style={{ background: 'var(--panel-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '300px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', position: 'relative' }}
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--primary)' }} title="Access live scores, pairings, and real-time standings as they happen.">
              <Info size={20} />
            </div>
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Eye size={30} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '700' }}>Spectator Mode</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>Watch live match results and leaderboard standings in real-time.</p>
            <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Watch live <ArrowRight size={16} />
            </div>
          </motion.div>
          
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

    </div>
  );
}
