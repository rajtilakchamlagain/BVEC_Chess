import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Eye, ShieldCheck, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: '#f4f6f9', 
      color: '#333333', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'absolute', 
      top: 0, 
      left: 0,
      overflowY: 'auto',
      fontFamily: '"Open Sans", "Helvetica Neue", sans-serif'
    }}>
      
      {/* Top Banner (ePrastuti Style) */}
      <div style={{ background: '#0a3d91', color: '#ffffff', padding: '4px 2rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>Government of Assam | Barak Valley Engineering College</div>
        <div>
          <span style={{ marginRight: '15px', cursor: 'pointer' }}>Skip to main content</span>
          <span style={{ cursor: 'pointer' }}>A- A A+</span>
        </div>
      </div>

      {/* Main Header */}
      <header style={{ 
        padding: '1.5rem 4rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#ffffff',
        borderBottom: '4px solid #e38718', // Saffron highlight
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/logo.jpg" alt="BVEC Logo" style={{ height: '80px', objectFit: 'contain' }} />
          <div style={{ borderLeft: '2px solid #ccc', paddingLeft: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0a3d91', margin: 0 }}>ChessVerse</h1>
            <div style={{ fontSize: '1rem', color: '#555', marginTop: '4px', fontWeight: '600' }}>Barak Valley Engineering College Chess Club</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/chesslogo.jpeg" alt="Chess Club Logo" style={{ height: '80px', objectFit: 'contain' }} />
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ background: '#0a3d91', padding: '0.8rem 4rem', display: 'flex', gap: '2rem', color: '#ffffff', fontSize: '1rem', fontWeight: '500' }}>
        <span style={{ cursor: 'pointer', borderBottom: '2px solid #e38718' }}>Home</span>
        <span style={{ cursor: 'pointer' }}>About Tournament</span>
        <span style={{ cursor: 'pointer' }}>Rules & Guidelines</span>
        <span style={{ cursor: 'pointer' }}>Contact Us</span>
      </nav>

      {/* Hero Content */}
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        maxWidth: '1200px', 
        margin: '0 auto',
      }}>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0a3d91', marginBottom: '1.5rem' }}>
          Welcome to the Official Chess Tournament Portal
        </h2>
        
        <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          A standardized platform for organizing, managing, and viewing professional chess tournaments at Barak Valley Engineering College. Based on the Swiss and Knockout systems.
        </p>

        {/* Action Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Card 1 */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', borderTop: '4px solid #0a3d91', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '300px', textAlign: 'center' }}>
            <ShieldCheck size={48} color="#0a3d91" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#333', marginBottom: '1rem' }}>Host Tournament</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Official administration portal to generate pairings and manage rounds.</p>
            <button 
              onClick={() => navigate('/chess-owner-entry')}
              style={{ background: '#0a3d91', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
            >
              Host Login
            </button>
          </div>

          {/* Card 2 */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', borderTop: '4px solid #e38718', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '300px', textAlign: 'center' }}>
            <Users size={48} color="#e38718" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#333', marginBottom: '1rem' }}>Player Registration</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Register yourself for upcoming official college chess tournaments.</p>
            <button 
              onClick={() => navigate('/chess-player-entry')}
              style={{ background: '#e38718', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
            >
              Join Tournament
            </button>
          </div>

          {/* Card 3 */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', borderTop: '4px solid #0056b3', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '300px', textAlign: 'center' }}>
            <Eye size={48} color="#0056b3" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#333', marginBottom: '1rem' }}>Live Spectator</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>View live standings, current round matches, and pairings.</p>
            <button 
              onClick={() => navigate('/chess-viewer-entry')}
              style={{ background: '#0056b3', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '4px', border: 'none', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
            >
              View Live Status
            </button>
          </div>
          
        </div>
      </div>

      {/* Footer (ePrastuti Style) */}
      <footer style={{ background: '#2c3e50', color: '#ecf0f1', padding: '2rem 4rem', marginTop: 'auto', borderTop: '4px solid #e38718' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>About Portal</h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '300px', lineHeight: '1.5', color: '#bbb' }}>
              Developed in compliance with the standardization guidelines for government educational institution portals. Designed for Barak Valley Engineering College.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', lineHeight: '1.8', color: '#bbb' }}>
              <li><a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>Terms of Use</a></li>
              <li><a href="#" style={{ color: '#bbb', textDecoration: 'none' }}>Accessibility Statement</a></li>
            </ul>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', color: '#bbb' }}>Maintained by <strong>Rajtilak Chamlagain</strong></p>
            <p style={{ fontSize: '0.85rem', color: '#bbb', marginTop: '5px' }}>© {new Date().getFullYear()} BVEC Chess Club. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
