import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Trophy, Users, Eye, ShieldCheck, ArrowRight, Info , LogIn, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
            <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Platform</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Tournaments</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Rules</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user ? (
              <div 
                onClick={() => navigate('/chess-owner-entry')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--panel-bg)', padding: '6px 12px', borderRadius: '30px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Host Arena</span>
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

    </div>
  );
}
