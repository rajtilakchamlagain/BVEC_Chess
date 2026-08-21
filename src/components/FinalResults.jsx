import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinalResults({ rankedPlayers }) {
  if (!rankedPlayers || rankedPlayers.length === 0) return null;

  const top3 = rankedPlayers.slice(0, 3);
  const runnersUp = rankedPlayers.slice(3, 10);

  const getMedalColor = (idx) => {
    if (idx === 0) return 'linear-gradient(135deg, #FFDF00, #D4AF37)'; // Gold
    if (idx === 1) return 'linear-gradient(135deg, #E0E0E0, #9E9E9E)'; // Silver
    if (idx === 2) return 'linear-gradient(135deg, #CD7F32, #8B4513)'; // Bronze
    return 'var(--panel-bg)';
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '900', margin: '0 0 1rem', background: 'linear-gradient(90deg, #FFD700, #FDB931)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Tournament Final Results
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Congratulations to the champions!</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', width: '100%', minHeight: '300px', flexWrap: 'wrap' }}>
        {/* 2nd Place */}
        {top3[1] && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: window.innerWidth < 768 ? 2 : 1 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#9E9E9E' }}>2nd Place</div>
            <div style={{ width: '120px', padding: '20px', background: getMedalColor(1), borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#000', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)' }}>
              <Medal size={32} />
              <div style={{ fontWeight: '900', fontSize: '1.2rem', textAlign: 'center', wordBreak: 'break-word' }}>{top3[1].name}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{top3[1].wins} pts</div>
            </div>
            <div style={{ height: '80px', width: '120px', background: 'linear-gradient(to bottom, #9E9E9E, transparent)', opacity: 0.2 }} />
          </motion.div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: window.innerWidth < 768 ? 1 : 2 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#FFDF00', textShadow: '0 0 10px rgba(255,223,0,0.5)' }}>CHAMPION</div>
            <div style={{ width: '140px', padding: '30px 20px', background: getMedalColor(0), borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#000', boxShadow: '0 -10px 40px rgba(255,215,0,0.3)', zIndex: 10 }}>
              <Trophy size={48} />
              <div style={{ fontWeight: '900', fontSize: '1.4rem', textAlign: 'center', wordBreak: 'break-word' }}>{top3[0].name}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{top3[0].wins} pts</div>
            </div>
            <div style={{ height: '120px', width: '140px', background: 'linear-gradient(to bottom, #D4AF37, transparent)', opacity: 0.3 }} />
          </motion.div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order: 3 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: '#CD7F32' }}>3rd Place</div>
            <div style={{ width: '120px', padding: '15px', background: getMedalColor(2), borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#fff', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)' }}>
              <Star size={24} />
              <div style={{ fontWeight: '900', fontSize: '1.1rem', textAlign: 'center', wordBreak: 'break-word' }}>{top3[2].name}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{top3[2].wins} pts</div>
            </div>
            <div style={{ height: '60px', width: '120px', background: 'linear-gradient(to bottom, #8B4513, transparent)', opacity: 0.2 }} />
          </motion.div>
        )}
      </div>

      {runnersUp.length > 0 && (
        <div style={{ width: '100%', marginTop: '2rem' }}>
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
