import { useState } from 'react';
import { X, Users, Search } from 'lucide-react';

export default function RostersModal({ isOpen, onClose, roomData, players }) {
  const [activeTab, setActiveTab] = useState('unsold');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const owners = roomData?.owners || [];
  const soldPlayers = players.filter(p => p.status === 'sold');
  const unsoldPlayers = players.filter(p => p.status === 'unsold');

  // Prepare tabs: Unsold + each Owner
  const tabs = [
    { id: 'unsold', label: `Unsold (${unsoldPlayers.length})` },
    ...owners.map(o => {
      const pCount = soldPlayers.filter(p => p.soldTo === o.name).length;
      return { id: o.name, label: `${o.name || 'Empty Slot'} (${pCount})` };
    })
  ];

  // Get active list
  let activeList = [];
  let budgetStats = null;

  if (activeTab === 'unsold') {
    activeList = unsoldPlayers;
  } else {
    activeList = soldPlayers.filter(p => p.soldTo === activeTab);
    const ownerInfo = owners.find(o => o.name === activeTab);
    if (ownerInfo) {
      const spent = activeList.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
      budgetStats = { spent, remaining: roomData.budgetPerTeam - spent };
    }
  }

  activeList = activeList.filter(p => p.realName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      
      {/* Slide-out Panel */}
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '600px', background: 'var(--panel-bg)', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--glass-border)', boxShadow: '-10px 0 50px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            <Users size={24} color="var(--primary)" /> Team Rosters
          </h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-main)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--glass-border)', padding: '0 1rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem', background: 'transparent', border: 'none',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Stats */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Search player..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {budgetStats && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Spent</p>
                <p style={{ fontSize: '1.2rem', color: '#ff4444', fontWeight: 'bold' }}>{budgetStats.spent}</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,255,136,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.2)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Remaining Budget</p>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{budgetStats.remaining}</p>
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem' }}>
          {activeList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No players found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeList.map(p => (
                <div key={p.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{p.realName} {p.nickName ? <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>"{p.nickName}"</span> : ''}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '2px' }}>{p.positions?.join(', ')} • {p.village}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.status === 'sold' ? 'Sold For' : 'Base Price'}</p>
                    <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>₹{p.status === 'sold' ? p.soldPrice : (p.basePrice || 500)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
