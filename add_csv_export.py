import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

export_func = """
  const exportParticipantsToCSV = () => {
    // Standardize CSV headers based on all collected data
    const headers = [
      'Rank', 'Name', 'Wins/Points', 'Contact Number', 'Contact Type',
      'Roll Number', 'Course', 'Branch', 'Year', 'Semester', 'College Name',
      'Designation', 'FIDE ID', 'AICF ID', 'Address', 'Rating', 'BUC', 'SB', 'Withdrawn'
    ];
    
    const rows = rankedPlayers.map((p, index) => {
      return [
        index + 1,
        p.name || '',
        p.wins || 0,
        p.contactNumber || '',
        p.contactType || '',
        p.rollNumber || '',
        p.course || '',
        p.branch || '',
        p.year || '',
        p.semester || '',
        p.collegeName || '',
        p.designation || '',
        p.fideId || '',
        p.aicfId || '',
        (p.address || '').replace(/,/g, ' '), // Remove commas from address for clean CSV
        p.rating || 1200,
        p.BUC || 0,
        p.SB || 0,
        p.withdrawn ? 'Yes' : 'No'
      ].map(val => `"${val}"`).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${roomData?.name?.replace(/\\s+/g, '_') || 'Tournament'}_Participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
"""

# Insert export_func right before "if (!roomData) return <div"
content = content.replace(
    "if (!roomData) return <div style={{ background: 'var(--bg-color)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy color=\"#333\" size={48} /></div>;",
    export_func + "\n\n  if (!roomData) return <div style={{ background: 'var(--bg-color)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy color=\"#333\" size={48} /></div>;"
)

# Insert Download CSV icon import at the top
content = content.replace(
    "Trash2, Edit2, UserX, CheckCircle2, MoreVertical, ShieldAlert, RotateCcw, Settings, X } from 'lucide-react';",
    "Trash2, Edit2, UserX, CheckCircle2, MoreVertical, ShieldAlert, RotateCcw, Settings, X, Download } from 'lucide-react';"
)

# Add the button in the UI (Inside Live Standings header)
button_code = """
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Players: {rankedPlayers.length}</span>
                <button 
                  onClick={exportParticipantsToCSV}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--border-color)', border: 'none', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
"""

content = content.replace(
    "{activeTab === 'standings' && (\n            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>\n              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 8px', fontSize: '0.75rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px' }}>",
    "{activeTab === 'standings' && (\n            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>\n" + button_code + "              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 8px', fontSize: '0.75rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px' }}>"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")
