import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Eye, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: '#050505', 
      color: '#ededed', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'absolute', 
      top: 0, 
      left: 0,
      overflowY: 'auto',
      fontFamily: '"Inter", "SF Pro Display", sans-serif',
      backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(0, 85, 255, 0.15) 0%, rgba(0,0,0,0) 70%)'
    }}>
      
      {/* Top Banner (Modern Gen-Z / Govt blend) */}
      <div style={{ 
        background: 'rgba(0, 229, 255, 0.1)', 
        color: '#00e5ff', 
        padding: '6px 2rem', 
        fontSize: '0.8rem', 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        <Sparkles size={14} style={{ marginRight: '8px' }} />
        Official Tournament Portal • Barak Valley Engineering College
        <Sparkles size={14} style={{ marginLeft: '8px' }} />
      </div>

      {/* Header */}
      <header style={{ 
        padding: '1.5rem 4rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(5, 5, 5, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.jpg" alt="BVEC" style={{ height: '50px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
              ChessVerse
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>
              BVEC Chess Club
            </div>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: '600', color: '#888' }}>
          <span style={{ color: '#fff', cursor: 'pointer', borderBottom: '2px solid #00e5ff', paddingBottom: '4px' }}>Tournaments</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>Leaderboard</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>Rules</span>
        </nav>
      </header>

      {/* Hero Section */}
      <div style={{ 
        padding: '6rem 2rem 4rem', 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto',
      }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 10px #00e5ff' }} />
            Swiss & Knockout Pairing Engine Live
          </div>
          
          <h2 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: '1', letterSpacing: '-0.04em', marginBottom: '1.5rem', color: '#fff' }}>
            Dominate the <br />
            <span style={{ background: 'linear-gradient(135deg, #0055ff 0%, #00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              64 Squares.
            </span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: '#888', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.6' }}>
            The official ultra-modern tournament platform for Barak Valley Engineering College. Real-time pairings, automated standings, and live spectating.
          </p>
        </motion.div>

        {/* Floating Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 85, 255, 0.2)' }}
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', width: '300px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => navigate('/chess-owner-entry')}
          >
            <div style={{ background: 'linear-gradient(135deg, #0055ff, #00e5ff)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(0, 229, 255, 0.3)' }}>
              <ShieldCheck size={32} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', fontWeight: '700' }}>Host Arena</h3>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>Generate Swiss pairings, report results, and control the live tournament.</p>
            <div style={{ color: '#00e5ff', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              Access Dashboard <Zap size={16} />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(255, 0, 128, 0.2)' }}
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', width: '300px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => navigate('/chess-player-entry')}
          >
            <div style={{ background: 'linear-gradient(135deg, #ff0080, #ff8c00)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(255, 0, 128, 0.3)' }}>
              <Users size={32} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', fontWeight: '700' }}>Player Entry</h3>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>Register for upcoming events with your FIDE/AICF ID and climb the ranks.</p>
            <div style={{ color: '#ff8c00', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              Join Lobby <Zap size={16} />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)' }}
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', padding: '2.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', width: '300px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => navigate('/chess-viewer-entry')}
          >
            <div style={{ background: 'rgba(255,255,255,0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Eye size={32} color="#fff" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', fontWeight: '700' }}>Live Spectator</h3>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>Watch the tournament unfold in real-time. Standings, stats, and live matchups.</p>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              Watch Live <Zap size={16} />
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '4rem' }}>
        <img src="/chesslogo.jpeg" alt="Chess Logo" style={{ height: '40px', borderRadius: '8px', opacity: 0.5, marginBottom: '1rem' }} />
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Built with ⚡ by Rajtilak Chamlagain <br/>
          © {new Date().getFullYear()} BVEC Chess Club. Powering the next generation of grandmasters.
        </p>
      </footer>

    </div>
  );
}
