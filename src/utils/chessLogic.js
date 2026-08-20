/**
 * chessLogic.js
 * Contains core logic for FIDE mathematical tiebreaks and tournament status detection.
 */

export function calculateRankings(players, rounds, format) {
  if (!players || players.length === 0) return [];
  
  const history = {};
  
  players.forEach(p => {
    history[p.id] = {
      id: p.id,
      name: p.name,
      wins: p.wins || 0,
      opponents: [],       
      results: {},         
      SB: 0,
      BUC: 0,
      BUC1: 0,
      isWithdrawn: p.withdrawn || false,
      originalPlayer: p
    };
  });

  rounds.forEach(r => {
    if (r.status === 'completed' || r.status === 'published') {
      r.pairings.forEach(pairing => {
        const p1 = pairing.player1;
        const p2 = pairing.player2;
        
        if (history[p1] && history[p2]) {
          history[p1].opponents.push(p2);
          history[p2].opponents.push(p1);
          
          if (pairing.result.startsWith('1-0')) {
            history[p1].results[p2] = 1;
            history[p2].results[p1] = 0;
          } else if (pairing.result.startsWith('0-1')) {
            history[p1].results[p2] = 0;
            history[p2].results[p1] = 1;
          } else if (pairing.result === '0.5-0.5') {
            history[p1].results[p2] = 0.5;
            history[p2].results[p1] = 0.5;
          } else {
            history[p1].results[p2] = 0;
            history[p2].results[p1] = 0;
          }
        }
      });
    }
  });

  players.forEach(p => {
    const stats = history[p.id];
    let oppScores = [];
    
    stats.opponents.forEach(oppId => {
      const opp = history[oppId];
      if (opp) {
        stats.BUC += opp.wins;
        oppScores.push(opp.wins);
        
        if (stats.results[oppId] === 1) {
          stats.SB += opp.wins;
        } else if (stats.results[oppId] === 0.5) {
          stats.SB += (opp.wins / 2);
        }
      }
    });
    
    if (oppScores.length > 0) {
      const minScore = Math.min(...oppScores);
      stats.BUC1 = stats.BUC - minScore;
    }
  });

  const ranked = Object.values(history).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    
    if (a.results[b.id] !== undefined) {
       if (a.results[b.id] === 1) return -1;
       if (a.results[b.id] === 0) return 1;
    }
    
    if (format === 'swiss') {
      if (b.BUC1 !== a.BUC1) return b.BUC1 - a.BUC1;
      if (b.BUC !== a.BUC) return b.BUC - a.BUC;
      if (b.SB !== a.SB) return b.SB - a.SB;
    } else {
      if (b.SB !== a.SB) return b.SB - a.SB;
      const aWins = Object.values(a.results).filter(v => v === 1).length;
      const bWins = Object.values(b.results).filter(v => v === 1).length;
      if (bWins !== aWins) return bWins - aWins;
    }
    
    return 0;
  });

  return ranked.map(r => ({
    ...r.originalPlayer,
    SB: r.SB,
    BUC: r.BUC,
    BUC1: r.BUC1
  }));
}

export function isRoundRobinComplete(players, rounds) {
  const activePlayers = players.filter(p => !p.withdrawn);
  const N = activePlayers.length;
  if (N < 2) return false;
  
  const history = {};
  activePlayers.forEach(p => history[p.id] = new Set());
  
  rounds.forEach(r => {
    r.pairings.forEach(pairing => {
      if (history[pairing.player1]) history[pairing.player1].add(pairing.player2);
      if (history[pairing.player2]) history[pairing.player2].add(pairing.player1);
    });
  });
  
  for (let i = 0; i < activePlayers.length; i++) {
    const p1 = activePlayers[i];
    for (let j = i + 1; j < activePlayers.length; j++) {
      const p2 = activePlayers[j];
      if (!history[p1.id].has(p2.id)) {
        return false; 
      }
    }
  }
  return true; 
}
