import React, { useRef } from 'react';
import { Trophy, Medal, Star, Download, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export default function FinalResults({ rankedPlayers, roomData }) {
  const graphicRef = useRef(null);

  if (!rankedPlayers || rankedPlayers.length === 0) return null;

  const top3 = rankedPlayers.slice(0, 3);
  const runnersUp = rankedPlayers.slice(3, 10);

  const getMedalColor = (idx) => {
    if (idx === 0) return 'linear-gradient(135deg, #FFDF00, #D4AF37)'; // Gold
    if (idx === 1) return 'linear-gradient(135deg, #E0E0E0, #9E9E9E)'; // Silver
    if (idx === 2) return 'linear-gradient(135deg, #CD7F32, #8B4513)'; // Bronze
    return 'var(--panel-bg)';
  };

  const handleDownload = async () => {
    if (!graphicRef.current) return;
    try {
      const canvas = await html2canvas(graphicRef.current, {
        backgroundColor: '#0f172a', // Tailwind slate-900
        scale: 2, // High resolution
        logging: false,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${roomData?.tournamentName?.replace(/\s+/g, '_') || 'Tournament'}_Results.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate graphic.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
      
      {/* The Download Button */}
      <button 
        onClick={handleDownload}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Download size={20} /> Download Premium Graphic
      </button>

      {/* The Actual Shareable Graphic Container */}
      <div 
        ref={graphicRef} 
        style={{ 
          padding: '3rem', 
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', 
          borderRadius: '24px', 
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '3rem', 
          width: '100%', 
          maxWidth: '800px', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />

        {/* Header / Tournament Details */}
        <div style={{ textAlign: 'center', zIndex: 1, width: '100%' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', margin: '0 0 1rem', background: 'linear-gradient(90deg, #FFD700, #FDB931)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
            {roomData?.tournamentName?.toUpperCase() || 'TOURNAMENT'} CHAMPIONS
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', margin: 0, fontWeight: '500' }}>Hosted by: <span style={{ color: '#f8fafc' }}>{roomData?.hostName || 'Admin'}</span></p>
            {roomData?.createdAt && (
              <p style={{ color: '#94a3b8', fontSize: '1.2rem', margin: 0, fontWeight: '500' }}>Date: <span style={{ color: '#f8fafc' }}>{roomData.createdAt.toDate().toLocaleDateString()}</span></p>
            )}
          </div>
        </div>

        {/* Podium */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', width: '100%', minHeight: '300px', flexWrap: 'wrap', zIndex: 1, marginTop: '2rem' }}>
          {/* 2nd Place */}
          {top3[1] && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: window.innerWidth < 768 ? 2 : 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#cbd5e1' }}>2nd Place</div>
              <div style={{ width: '140px', padding: '20px', background: getMedalColor(1), borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#000', boxShadow: '0 -10px 30px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.3)' }}>
                <Medal size={40} />
                <div style={{ fontWeight: '900', fontSize: '1.3rem', textAlign: 'center', wordBreak: 'break-word', lineHeight: '1.2' }}>{top3[1].name}</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.1)', padding: '4px 12px', borderRadius: '20px' }}>{top3[1].wins} pts</div>
              </div>
              <div style={{ height: '100px', width: '140px', background: 'linear-gradient(to bottom, #9E9E9E, transparent)', opacity: 0.2 }} />
            </motion.div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: window.innerWidth < 768 ? 1 : 2 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px', color: '#FFDF00', textShadow: '0 0 20px rgba(255,223,0,0.5)', letterSpacing: '2px' }}>CHAMPION</div>
              <div style={{ width: '180px', padding: '30px 20px', background: getMedalColor(0), borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#000', boxShadow: '0 -15px 50px rgba(255,215,0,0.4)', zIndex: 10, border: '2px solid rgba(255,255,255,0.5)' }}>
                <Trophy size={64} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
                <div style={{ fontWeight: '900', fontSize: '1.6rem', textAlign: 'center', wordBreak: 'break-word', lineHeight: '1.1' }}>{top3[0].name}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', background: 'rgba(0,0,0,0.1)', padding: '6px 16px', borderRadius: '20px' }}>{top3[0].wins} pts</div>
              </div>
              <div style={{ height: '140px', width: '180px', background: 'linear-gradient(to bottom, #D4AF37, transparent)', opacity: 0.3 }} />
            </motion.div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: 3 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: '#d97706' }}>3rd Place</div>
              <div style={{ width: '130px', padding: '15px', background: getMedalColor(2), borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#fff', boxShadow: '0 -10px 30px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.2)' }}>
                <Star size={32} />
                <div style={{ fontWeight: '900', fontSize: '1.2rem', textAlign: 'center', wordBreak: 'break-word', lineHeight: '1.2' }}>{top3[2].name}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '20px' }}>{top3[2].wins} pts</div>
              </div>
              <div style={{ height: '80px', width: '130px', background: 'linear-gradient(to bottom, #8B4513, transparent)', opacity: 0.2 }} />
            </motion.div>
          )}
        </div>

        {/* Branding Footer */}
        <div style={{ 
          marginTop: '2rem', 
          width: '100%', 
          padding: '1.5rem', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1,
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/chesslogo.jpeg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
            <div>
              <div style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '1.1rem' }}>ChessVerse</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tournament Management Platform</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '600', fontSize: '1rem' }}>
            <LinkIcon size={16} /> bvecchess.vercel.app
          </div>
        </div>
      </div>

      {/* Runners up (Outside the graphic so it's not downloaded) */}
      {runnersUp.length > 0 && (
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '1rem' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>Top 10 Runners Up</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {runnersUp.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', width: '20px' }}>{i + 4}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>{p.wins} pts</span>
                  <span>BUC: {p.BUC}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
