import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Swords, Shuffle, ArrowLeft, Trash2, Edit2, UserX, CheckCircle2, MoreVertical, ShieldAlert, RotateCcw, Settings, X } from 'lucide-react';
import { doc, collection, onSnapshot, updateDoc, writeBatch, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateRankings, isRoundRobinComplete } from '../utils/chessLogic';

// Helper for Golden Ratio Byes
function getGoldenRatioByes(numPlayers) {
  let target = 1;
  while(target < numPlayers) target *= 2;
  if(target === numPlayers) return { byes: 0, playing: numPlayers };
  const pBelow = target / 2;
  const toEliminate = numPlayers - pBelow;
  const playing = toEliminate * 2;
  const byes = numPlayers - playing;
  return { byes, playing };
}

// Helper for Sorting Hierarchy
function sortPlayersHierarchy(pA, pB) {
  // 1. Designation
  const desigRank = { 'President': 5, 'Secretary': 4, 'Vice President': 3, 'Event Management': 2, 'Asst. Secretary': 1 };
  const dA = desigRank[pA.designation] || 0;
  const dB = desigRank[pB.designation] || 0;
  if (dA !== dB) return dB - dA;
  
  // 2. Rating
  const rA = Number(pA.rating) || 0;
  const rB = Number(pB.rating) || 0;
  if (rA !== rB) return rB - rA;
  
  // 3. FIDE ID
  const hasFideA = pA.fideId ? 1 : 0;
  const hasFideB = pB.fideId ? 1 : 0;
  if (hasFideA !== hasFideB) return hasFideB - hasFideA;
  
  // 4. AICF ID
  const hasAicfA = pA.aicfId ? 1 : 0;
  const hasAicfB = pB.aicfId ? 1 : 0;
  if (hasAicfA !== hasAicfB) return hasAicfB - hasAicfA;
  
  // 5. Course & Year
  const courseRank = { 'M.Tech': 10, 'B.Tech': 9, 'B.Sc': 8, 'B.Com': 7, 'B.A': 6 };
  const cA = courseRank[pA.course] || 0;
  const cB = courseRank[pB.course] || 0;
  if (cA !== cB) return cB - cA;
  
  const yearRank = { '5th': 5, '4th': 4, '3rd': 3, '2nd': 2, '1st': 1 };
  const yA = yearRank[pA.year] || 0;
  const yB = yearRank[pB.year] || 0;
  if (yA !== yB) return yB - yA;
  
  // 6. Alphabetical
  return (pA.name || '').localeCompare(pB.name || '');
}

export default function ChessDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');
  
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [activeTab, setActiveTab] = useState('matchups'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Swiss Modal State
  const [showSwissModal, setShowSwissModal] = useState(false);
  const [swissMode, setSwissMode] = useState('swiss');
  const [swissRounds, setSwissRounds] = useState(5);

  // Swap State
  const [swapMode, setSwapMode] = useState(false);
  const [selectedForSwap, setSelectedForSwap] = useState(null); 

  const rankedPlayers = useMemo(() => {
    const format = rounds.length > 0 ? rounds[0].format : 'staircase';
    return calculateRankings(players, rounds, format);
  }, [players, rounds]);

  useEffect(() => {
    if (!roomCode) {
      navigate('/');
      return;
    }

    const roomRef = doc(db, 'chess_tournaments', roomCode);
    const unsubRoom = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setRoomData(data);
        setCurrentRoundNumber(data.currentRound || 0);
      }
    });

    const playersRef = collection(db, 'chess_tournaments', roomCode, 'players');
    const unsubPlayers = onSnapshot(playersRef, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(p);
    });

    const roundsRef = collection(db, 'chess_tournaments', roomCode, 'rounds');
    const unsubRounds = onSnapshot(roundsRef, (snapshot) => {
      const r = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      r.sort((a, b) => b.roundNumber - a.roundNumber);
      setRounds(r);
    });

    return () => {
      unsubRoom();
      unsubPlayers();
      unsubRounds();
    };
  }, [roomCode, navigate]);

  const generatePairings = async (format) => {
    const activePlayers = players.filter(p => !p.withdrawn);
    if (activePlayers.length < 2) {
      alert("Need at least 2 active players to generate pairings.");
      return;
    }
    
    if (format === 'staircase' && isRoundRobinComplete(players, rounds)) {
      alert("All Round Robin matchups have been played! The tournament will now conclude.");
      await updateDoc(doc(db, 'chess_tournaments', roomCode), { status: 'finished' });
      return;
    }
    
    const existingDraft = rounds.find(r => r.status === 'draft');
    if (existingDraft) {
      alert("There is already an unpublished draft round. Delete or publish it first.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const nextRoundNum = currentRoundNumber + 1;
      let pairings = [];
      let byePlayers = [];
      let label = '';
      
      if (format === 'knockout') {
        const lastRound = rounds.length > 0 ? rounds[0] : null;
        
        // Check for 3rd Place Match generation (if last round had exactly 4 players / 2 matches)
        if (lastRound && lastRound.format === 'knockout' && lastRound.pairings.length === 2 && lastRound.status === 'completed') {
           const finalists = [];
           const bronze = [];
           for (const p of lastRound.pairings) {
             if (p.result.startsWith('1-0')) { finalists.push(p.player1); bronze.push(p.player2); }
             else if (p.result.startsWith('0-1')) { finalists.push(p.player2); bronze.push(p.player1); }
           }
           if (finalists.length === 2 && bronze.length === 2) {
             const f1 = players.find(x => x.id === finalists[0]);
             const f2 = players.find(x => x.id === finalists[1]);
             const b1 = players.find(x => x.id === bronze[0]);
             const b2 = players.find(x => x.id === bronze[1]);
             
             pairings.push({ player1: f1.id, player1Name: f1.name, player1Color: 'white', player2: f2.id, player2Name: f2.name, player2Color: 'black', result: 'pending', matchType: 'Grand Final' });
             pairings.push({ player1: b1.id, player1Name: b1.name, player1Color: 'white', player2: b2.id, player2Name: b2.name, player2Color: 'black', result: 'pending', matchType: '3rd Place Match' });
             label = 'Finals';
           }
        } else {
           // Normal Knockout & Golden Ratio
           const { byes, playing } = getGoldenRatioByes(activePlayers.length);
           let sortedForHierarchy = [...activePlayers].sort(sortPlayersHierarchy);
           
           if (byes > 0) {
             byePlayers = sortedForHierarchy.slice(0, byes);
             sortedForHierarchy = sortedForHierarchy.slice(byes);
           }
           
           // Randomize the playing pool to prevent predictable preliminary brackets
           let pool = [...sortedForHierarchy].sort(() => Math.random() - 0.5);
           
           while (pool.length >= 2) {
             const p1 = pool.shift();
             const p2 = pool.shift();
             pairings.push({ player1: p1.id, player1Name: p1.name, player1Color: 'white', player2: p2.id, player2Name: p2.name, player2Color: 'black', result: 'pending', matchType: 'Knockout' });
           }
        }
      } 
      else if (format === 'swiss' || format === 'staircase') {
        // Build History Map to avoid duplicate matchups
        const history = {};
        activePlayers.forEach(p => history[p.id] = new Set());
        
        rounds.forEach(r => {
          if (r.status === 'completed' || r.status === 'published') {
            r.pairings.forEach(pairing => {
              if (history[pairing.player1]) history[pairing.player1].add(pairing.player2);
              if (history[pairing.player2]) history[pairing.player2].add(pairing.player1);
            });
          }
        });

        // Sort active players strictly by points
        let pool = [...activePlayers].sort((a, b) => (b.wins || 0) - (a.wins || 0));
        
        // Recursive Backtracking to find a perfect matching with NO duplicate history
        const findValidPairings = (remainingPool, currentPairs) => {
          if (remainingPool.length <= 1) {
            return { success: true, pairs: currentPairs, remainder: remainingPool };
          }
          const p1 = remainingPool[0];
          for (let i = 1; i < remainingPool.length; i++) {
            const p2 = remainingPool[i];
            if (!history[p1.id].has(p2.id)) {
              const newRemaining = [...remainingPool];
              newRemaining.splice(i, 1);
              newRemaining.splice(0, 1);
              const result = findValidPairings(newRemaining, [...currentPairs, [p1, p2]]);
              if (result.success) return result;
            }
          }
          return { success: false };
        };

        const matchResult = findValidPairings(pool, []);

        if (matchResult.success) {
           matchResult.pairs.forEach(pair => {
             const p1 = pair[0]; const p2 = pair[1];
             let p1Color = 'white'; let p2Color = 'black';
             if ((p1.whitePlayed || 0) > (p1.blackPlayed || 0) && (p2.blackPlayed || 0) >= (p2.whitePlayed || 0)) {
               p1Color = 'black'; p2Color = 'white';
             }
             pairings.push({ player1: p1.id, player1Name: p1.name, player1Color: p1Color, player2: p2.id, player2Name: p2.name, player2Color: p2Color, result: 'pending', matchType: format === 'staircase' ? 'Round Robin' : 'Swiss' });
           });
           if (matchResult.remainder.length === 1) byePlayers.push(matchResult.remainder[0]);
        } else {
           // Fallback to Greedy if mathematically impossible (e.g. late stages of a Swiss)
           while (pool.length >= 2) {
             const p1 = pool.shift();
             let opponentIndex = 0; 
             for (let i = 0; i < pool.length; i++) {
               if (!history[p1.id].has(pool[i].id)) {
                 opponentIndex = i; break;
               }
             }
             const p2 = pool.splice(opponentIndex, 1)[0];
             let p1Color = 'white'; let p2Color = 'black';
             if ((p1.whitePlayed || 0) > (p1.blackPlayed || 0) && (p2.blackPlayed || 0) >= (p2.whitePlayed || 0)) {
               p1Color = 'black'; p2Color = 'white';
             }
             pairings.push({ player1: p1.id, player1Name: p1.name, player1Color: p1Color, player2: p2.id, player2Name: p2.name, player2Color: p2Color, result: 'pending', matchType: format === 'staircase' ? 'Round Robin' : 'Swiss' });
           }
           if (pool.length === 1) byePlayers.push(pool.shift());
        }
      }

      const batch = writeBatch(db);
      const newRoundRef = doc(collection(db, 'chess_tournaments', roomCode, 'rounds'), `round_${nextRoundNum}`);
      
      batch.set(newRoundRef, {
        roundNumber: nextRoundNum,
        format: format,
        pairings,
        byePlayers: byePlayers.map(b => ({ id: b.id, name: b.name })),
        status: 'draft',
        label: label || '',
        createdAt: serverTimestamp()
      });

      await batch.commit();

    } catch (err) {
      console.error(err);
      alert("Error generating pairings");
    } finally {
      setIsGenerating(false);
      setShowSwissModal(false);
    }
  };

  const publishRound = async (roundId, roundNumber, byePlayersList) => {
    try {
      const batch = writeBatch(db);
      
      const roundRef = doc(db, 'chess_tournaments', roomCode, 'rounds', roundId);
      batch.update(roundRef, { status: 'published' });
      
      const roomRef = doc(db, 'chess_tournaments', roomCode);
      batch.update(roomRef, {
        currentRound: roundNumber,
        status: 'live'
      });

      if (byePlayersList && byePlayersList.length > 0) {
        byePlayersList.forEach(bp => {
          const pRef = doc(db, 'chess_tournaments', roomCode, 'players', bp.id);
          const playerDoc = players.find(p => p.id === bp.id);
          batch.update(pRef, { wins: (playerDoc.wins || 0) + 1 });
        });
      }

      await batch.commit();
    } catch (err) {
      console.error(err);
      alert("Error publishing round.");
    }
  };

  const finishTournament = async () => {
    if (!window.confirm("Are you sure you want to officially conclude the tournament?")) return;
    try {
      await updateDoc(doc(db, 'chess_tournaments', roomCode), { status: 'finished' });
    } catch (e) {
      console.error(e);
    }
  };

  const rollbackRound = async (roundId) => {
    if (!window.confirm("WARNING: Are you sure you want to delete this round and revert all scores? This action cannot be undone.")) return;
    
    try {
      const roundDoc = rounds.find(r => r.id === roundId);
      const batch = writeBatch(db);
      
      // Revert scores on players
      roundDoc.pairings.forEach(p => {
         const p1Doc = players.find(x => x.id === p.player1);
         const p2Doc = players.find(x => x.id === p.player2);
         
         let p1Inc = 0; let p2Inc = 0;
         if (p.result.startsWith('1-0')) { p1Inc = -1; }
         else if (p.result.startsWith('0-1')) { p2Inc = -1; }
         else if (p.result === '0.5-0.5') { p1Inc = -0.5; p2Inc = -0.5; }
         
         if (p1Doc && p1Inc !== 0) batch.update(doc(db, 'chess_tournaments', roomCode, 'players', p.player1), { wins: (p1Doc.wins || 0) + p1Inc });
         if (p2Doc && p2Inc !== 0) batch.update(doc(db, 'chess_tournaments', roomCode, 'players', p.player2), { wins: (p2Doc.wins || 0) + p2Inc });
      });

      if (roundDoc.byePlayers && roundDoc.byePlayers.length > 0) {
        roundDoc.byePlayers.forEach(bp => {
          const pDoc = players.find(x => x.id === bp.id);
          if (pDoc) batch.update(doc(db, 'chess_tournaments', roomCode, 'players', bp.id), { wins: (pDoc.wins || 0) - 1 });
        });
      }
      
      batch.delete(doc(db, 'chess_tournaments', roomCode, 'rounds', roundId));
      batch.update(doc(db, 'chess_tournaments', roomCode), { currentRound: roundDoc.roundNumber - 1 });
      
      await batch.commit();
    } catch (e) {
      console.error(e);
      alert("Error rolling back round.");
    }
  };

  const deleteDraft = async (roundId) => {
    if (!window.confirm("Are you sure you want to delete this drafted round?")) return;
    try {
      await deleteDoc(doc(db, 'chess_tournaments', roomCode, 'rounds', roundId));
    } catch (err) {
      console.error(err);
    }
  };

  const checkRoundCompletion = async (roundId) => {
    const roundDoc = rounds.find(r => r.id === roundId);
    if (!roundDoc) return;
    const allDone = roundDoc.pairings.every(p => p.result !== 'pending');
    if (allDone) {
      await updateDoc(doc(db, 'chess_tournaments', roomCode, 'rounds', roundId), { status: 'completed' });
    }
  };

  const reportResult = async (roundId, pairingIndex, result) => {
    try {
      const roundDoc = rounds.find(r => r.id === roundId);
      if (!roundDoc) return;
      
      const pairing = roundDoc.pairings[pairingIndex];
      if (pairing.result !== 'pending') return; 
      
      const updatedPairings = [...roundDoc.pairings];
      updatedPairings[pairingIndex].result = result;
      
      const batch = writeBatch(db);
      const roundRef = doc(db, 'chess_tournaments', roomCode, 'rounds', roundId);
      batch.update(roundRef, { pairings: updatedPairings });
      
      const p1Ref = doc(db, 'chess_tournaments', roomCode, 'players', pairing.player1);
      const p2Ref = doc(db, 'chess_tournaments', roomCode, 'players', pairing.player2);
      
      const p1 = players.find(p => p.id === pairing.player1);
      const p2 = players.find(p => p.id === pairing.player2);
      
      // Update scores & Auto-Eliminate losers for Knockouts
      const isKnockout = roundDoc.format === 'knockout';
      
      if (result === '1-0' || result === '1-0 (Walkover)') {
        batch.update(p1Ref, { 
          wins: (p1.wins || 0) + 1, 
          whitePlayed: pairing.player1Color === 'white' ? (p1.whitePlayed || 0) + 1 : (p1.whitePlayed || 0), 
          blackPlayed: pairing.player1Color === 'black' ? (p1.blackPlayed || 0) + 1 : (p1.blackPlayed || 0) 
        });
        batch.update(p2Ref, { 
          whitePlayed: pairing.player2Color === 'white' ? (p2.whitePlayed || 0) + 1 : (p2.whitePlayed || 0), 
          blackPlayed: pairing.player2Color === 'black' ? (p2.blackPlayed || 0) + 1 : (p2.blackPlayed || 0),
          ...(isKnockout ? { withdrawn: true } : {})
        });
      } else if (result === '0-1' || result === '0-1 (Walkover)') {
        batch.update(p2Ref, { 
          wins: (p2.wins || 0) + 1, 
          whitePlayed: pairing.player2Color === 'white' ? (p2.whitePlayed || 0) + 1 : (p2.whitePlayed || 0), 
          blackPlayed: pairing.player2Color === 'black' ? (p2.blackPlayed || 0) + 1 : (p2.blackPlayed || 0) 
        });
        batch.update(p1Ref, { 
          whitePlayed: pairing.player1Color === 'white' ? (p1.whitePlayed || 0) + 1 : (p1.whitePlayed || 0), 
          blackPlayed: pairing.player1Color === 'black' ? (p1.blackPlayed || 0) + 1 : (p1.blackPlayed || 0),
          ...(isKnockout ? { withdrawn: true } : {})
        });
      } else if (result === '0.5-0.5') {
        batch.update(p1Ref, { 
          wins: (p1.wins || 0) + 0.5, 
          whitePlayed: pairing.player1Color === 'white' ? (p1.whitePlayed || 0) + 1 : (p1.whitePlayed || 0), 
          blackPlayed: pairing.player1Color === 'black' ? (p1.blackPlayed || 0) + 1 : (p1.blackPlayed || 0) 
        });
        batch.update(p2Ref, { 
          wins: (p2.wins || 0) + 0.5, 
          whitePlayed: pairing.player2Color === 'white' ? (p2.whitePlayed || 0) + 1 : (p2.whitePlayed || 0), 
          blackPlayed: pairing.player2Color === 'black' ? (p2.blackPlayed || 0) + 1 : (p2.blackPlayed || 0) 
        });
      }
      
      await batch.commit();
      
      // Attempt auto-completion check
      checkRoundCompletion(roundId);
    } catch (err) {
      console.error(err);
      alert("Error reporting result");
    }
  };

  const undoResult = async (roundId, pairingIndex) => {
    try {
      const roundDoc = rounds.find(r => r.id === roundId);
      if (!roundDoc) return;
      
      const pairing = roundDoc.pairings[pairingIndex];
      const result = pairing.result;
      if (result === 'pending') return; 
      
      const updatedPairings = roundDoc.pairings.map(p => ({...p}));
      updatedPairings[pairingIndex].result = 'pending';
      
      const batch = writeBatch(db);
      const roundRef = doc(db, 'chess_tournaments', roomCode, 'rounds', roundId);
      
      if (roundDoc.status === 'completed') {
        batch.update(roundRef, { pairings: updatedPairings, status: 'published' });
      } else {
        batch.update(roundRef, { pairings: updatedPairings });
      }
      
      const p1Ref = doc(db, 'chess_tournaments', roomCode, 'players', pairing.player1);
      const p2Ref = doc(db, 'chess_tournaments', roomCode, 'players', pairing.player2);
      
      const p1 = players.find(p => p.id === pairing.player1);
      const p2 = players.find(p => p.id === pairing.player2);
      
      const isKnockout = roundDoc.format === 'knockout';
      
      if (result === '1-0' || result === '1-0 (Walkover)') {
        batch.update(p1Ref, { 
          wins: (p1.wins || 0) - 1, 
          whitePlayed: pairing.player1Color === 'white' ? (p1.whitePlayed || 0) - 1 : (p1.whitePlayed || 0), 
          blackPlayed: pairing.player1Color === 'black' ? (p1.blackPlayed || 0) - 1 : (p1.blackPlayed || 0) 
        });
        batch.update(p2Ref, { 
          whitePlayed: pairing.player2Color === 'white' ? (p2.whitePlayed || 0) - 1 : (p2.whitePlayed || 0), 
          blackPlayed: pairing.player2Color === 'black' ? (p2.blackPlayed || 0) - 1 : (p2.blackPlayed || 0),
          ...(isKnockout ? { withdrawn: false } : {})
        });
      } else if (result === '0-1' || result === '0-1 (Walkover)') {
        batch.update(p2Ref, { 
          wins: (p2.wins || 0) - 1, 
          whitePlayed: pairing.player2Color === 'white' ? (p2.whitePlayed || 0) - 1 : (p2.whitePlayed || 0), 
          blackPlayed: pairing.player2Color === 'black' ? (p2.blackPlayed || 0) - 1 : (p2.blackPlayed || 0) 
        });
        batch.update(p1Ref, { 
          whitePlayed: pairing.player1Color === 'white' ? (p1.whitePlayed || 0) - 1 : (p1.whitePlayed || 0), 
          blackPlayed: pairing.player1Color === 'black' ? (p1.blackPlayed || 0) - 1 : (p1.blackPlayed || 0),
          ...(isKnockout ? { withdrawn: false } : {})
        });
      } else if (result === '0.5-0.5') {
        batch.update(p1Ref, { 
          wins: (p1.wins || 0) - 0.5, 
          whitePlayed: pairing.player1Color === 'white' ? (p1.whitePlayed || 0) - 1 : (p1.whitePlayed || 0), 
          blackPlayed: pairing.player1Color === 'black' ? (p1.blackPlayed || 0) - 1 : (p1.blackPlayed || 0) 
        });
        batch.update(p2Ref, { 
          wins: (p2.wins || 0) - 0.5, 
          whitePlayed: pairing.player2Color === 'white' ? (p2.whitePlayed || 0) - 1 : (p2.whitePlayed || 0), 
          blackPlayed: pairing.player2Color === 'black' ? (p2.blackPlayed || 0) - 1 : (p2.blackPlayed || 0) 
        });
      }
      
      await batch.commit();
    } catch (err) {
      console.error(err);
      alert("Error undoing result");
    }
  };

  const handleSwapClick = async (roundId, pairingIndex, playerNum, playerId, playerName, playerColor) => {
    if (!selectedForSwap) {
      setSelectedForSwap({ pairingIndex, playerNum, playerId, playerName, playerColor, roundId });
    } else {
      if (selectedForSwap.roundId !== roundId) {
        alert("Cannot swap across different rounds.");
        setSelectedForSwap(null);
        return;
      }
      if (selectedForSwap.pairingIndex === pairingIndex && selectedForSwap.playerNum === playerNum) {
        setSelectedForSwap(null);
        return;
      }
      const roundDoc = rounds.find(r => r.id === roundId);
      const updatedPairings = roundDoc.pairings.map(p => ({...p}));

      const pA = { id: selectedForSwap.playerId, name: selectedForSwap.playerName };
      const pB = { id: playerId, name: playerName };

      if (selectedForSwap.playerNum === 1) {
        updatedPairings[selectedForSwap.pairingIndex].player1 = pB.id;
        updatedPairings[selectedForSwap.pairingIndex].player1Name = pB.name;
      } else {
        updatedPairings[selectedForSwap.pairingIndex].player2 = pB.id;
        updatedPairings[selectedForSwap.pairingIndex].player2Name = pB.name;
      }

      if (playerNum === 1) {
        updatedPairings[pairingIndex].player1 = pA.id;
        updatedPairings[pairingIndex].player1Name = pA.name;
      } else {
        updatedPairings[pairingIndex].player2 = pA.id;
        updatedPairings[pairingIndex].player2Name = pA.name;
      }

      try {
        await updateDoc(doc(db, 'chess_tournaments', roomCode, 'rounds', roundId), { pairings: updatedPairings });
      } catch (err) {
        console.error(err);
      }
      setSelectedForSwap(null);
      setSwapMode(false);
    }
  };

  const removePlayer = async (playerId, playerName) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${playerName}?`)) return;
    try {
      await deleteDoc(doc(db, 'chess_tournaments', roomCode, 'players', playerId));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDisqualify = async (playerId, playerName, isCurrentlyWithdrawn) => {
    const msg = isCurrentlyWithdrawn 
      ? `Re-enter ${playerName} into the tournament?`
      : `Eliminate/Withdraw ${playerName}? They will not be paired in future rounds.`;
    if (!window.confirm(msg)) return;
    try {
      await updateDoc(doc(db, 'chess_tournaments', roomCode, 'players', playerId), { withdrawn: !isCurrentlyWithdrawn });
    } catch (err) {
      console.error(err);
    }
  };

  const resetTournament = async () => {
    const confirmText = prompt("Are you sure you want to completely RESET the tournament? This will delete all rounds and reset all player scores to 0. Type 'RESET' to confirm.");
    if (confirmText !== 'RESET') return;
    try {
      const batch = writeBatch(db);
      rounds.forEach(r => batch.delete(doc(db, 'chess_tournaments', roomCode, 'rounds', r.id)));
      players.forEach(p => batch.update(doc(db, 'chess_tournaments', roomCode, 'players', p.id), { wins: 0, whitePlayed: 0, blackPlayed: 0, matchesPlayed: 0, withdrawn: false }));
      batch.update(doc(db, 'chess_tournaments', roomCode), { currentRound: 0, status: 'waiting' });
      await batch.commit();
      alert("Tournament has been successfully reset.");
    } catch (err) {
      console.error(err);
    }
  };

  if (!roomData) return <div style={{ background: '#09090b', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy color="#333" size={48} /></div>;

  const activeRoundData = rounds.length > 0 ? rounds[0] : null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#09090b', color: '#ededed', fontFamily: '"Inter", sans-serif' }}>
      
      {showSwissModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: '#111', width: '400px', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings color="#00e5ff" /> Advanced Hybrid Setup</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', border: swissMode === 'swiss' ? '1px solid #00e5ff' : '1px solid transparent' }}>
                <input type="radio" checked={swissMode === 'swiss'} onChange={() => setSwissMode('swiss')} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Swiss System</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Points-based pairings for N rounds.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', border: swissMode === 'staircase' ? '1px solid #00e5ff' : '1px solid transparent' }}>
                <input type="radio" checked={swissMode === 'staircase'} onChange={() => setSwissMode('staircase')} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Staircase (Round Robin)</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Everyone plays everyone.</div>
                </div>
              </label>
              
              {swissMode === 'swiss' && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#888' }}>Number of Rounds to Setup:</label>
                  <input type="number" min="1" max="20" value={swissRounds} onChange={(e) => setSwissRounds(e.target.value)} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginTop: '5px' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowSwissModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => generatePairings(swissMode)} style={{ flex: 1, padding: '12px', background: '#00e5ff', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>Start Setup</button>
            </div>
          </div>
        </div>
      )}

      {selectedPlayer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedPlayer(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()} 
            style={{ background: '#111', width: '500px', maxWidth: '90vw', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {selectedPlayer.photoUrl ? (
                  <img src={selectedPlayer.photoUrl} alt="" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
                    <UserX size={32} color="#555" />
                  </div>
                )}
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{selectedPlayer.name}</h2>
                  <div style={{ fontSize: '0.9rem', color: '#00e5ff', fontWeight: 'bold', marginTop: '4px' }}>
                    {selectedPlayer.isCoreMember === 'Yes' ? selectedPlayer.designation : 'Player'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Points</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{selectedPlayer.wins || 0}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Rating</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{selectedPlayer.rating || 1200}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#888' }}>College</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.collegeName || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                <span style={{ color: '#888' }}>Course & Year</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>
                  {selectedPlayer.course} {selectedPlayer.branch ? `(${selectedPlayer.branch.includes('(') ? selectedPlayer.branch.match(/\((.*?)\)/)[1] : selectedPlayer.branch})` : ''} - {selectedPlayer.year} Year (Sem {selectedPlayer.semester})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                <span style={{ color: '#888' }}>Roll Number</span>
                <span style={{ fontWeight: '500', textAlign: 'right', fontFamily: 'monospace' }}>{selectedPlayer.rollNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                <span style={{ color: '#888' }}>Hostel / Address</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
                <span style={{ color: '#888' }}>FIDE ID</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.fideId || 'None'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ color: '#888' }}>AICF ID</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{selectedPlayer.aicfId || 'None'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
              <span>White Played: {selectedPlayer.whitePlayed || 0}</span>
              <span>Black Played: {selectedPlayer.blackPlayed || 0}</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar - Players & Standings */}
      <div style={{ width: '380px', background: '#111', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
              <ArrowLeft size={16} /> Exit Dashboard
            </button>
            <button onClick={resetTournament} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 'bold' }} title="Reset Entire Tournament">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {roomData.logoUrl ? <img src={roomData.logoUrl} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} /> : <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #1f1f1f, #09090b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}><Trophy size={20} color="#fff" /></div>}
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{roomData.name}</h2>
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>Player Code: <span style={{ color: '#fff' }}>{roomData.playerCode}</span></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button style={{ flex: 1, padding: '1rem', background: activeTab === 'matchups' ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', color: activeTab === 'matchups' ? '#fff' : '#888', cursor: 'pointer', fontWeight: activeTab === 'matchups' ? 'bold' : 'normal' }} onClick={() => setActiveTab('matchups')}>Host Controls</button>
          <button style={{ flex: 1, padding: '1rem', background: activeTab === 'standings' ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', color: activeTab === 'standings' ? '#fff' : '#888', cursor: 'pointer', fontWeight: activeTab === 'standings' ? 'bold' : 'normal' }} onClick={() => setActiveTab('standings')}>Live Standings</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {activeTab === 'standings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 8px', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span style={{flex: 1}}>Player</span>
                <div style={{ display: 'flex', gap: '15px', width: '120px', justifyContent: 'flex-end', paddingRight: '40px' }}>
                  <span title="Buchholz Score (Sum of opponents' points)">BUC</span>
                  <span title="Sonneborn-Berger (Sum of defeated opponents' points)">SB</span>
                  <span>Pts</span>
                </div>
              </div>
              <AnimatePresence>
                {rankedPlayers.map((p, idx) => (
                  <motion.div 
                    key={p.id} 
                    layout 
                    onClick={() => setSelectedPlayer(p)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: p.withdrawn ? 'rgba(255,0,0,0.02)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', opacity: p.withdrawn ? 0.5 : 1 }}
                    whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#666', fontSize: '0.85rem', width: '20px', fontWeight: 'bold' }}>{idx + 1}</span>
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UserX size={14} color="#888" />
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '140px' }}>
                        <span style={{ fontWeight: '500', color: p.withdrawn ? '#888' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                        {p.course && <span style={{ fontSize: '0.7rem', color: '#666' }}>{p.course} {p.branch && `- ${p.branch.includes('(') ? p.branch.match(/\((.*?)\)/)[1] : p.branch}`} ({p.year} YR)</span>}
                        {p.designation && <span style={{ fontSize: '0.7rem', color: '#00e5ff' }}>{p.designation}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ color: '#888', fontSize: '0.85rem', width: '25px', textAlign: 'right' }}>{p.BUC || 0}</div>
                      <div style={{ color: '#888', fontSize: '0.85rem', width: '25px', textAlign: 'right' }}>{p.SB || 0}</div>
                      <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.2rem', width: '30px', textAlign: 'right' }}>{p.wins || 0}</div>
                      
                      <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                        <button onClick={(e) => { e.stopPropagation(); toggleDisqualify(p.id, p.name, p.withdrawn); }} style={{ background: 'none', border: 'none', color: p.withdrawn ? '#10b981' : '#ff9900', cursor: 'pointer', padding: '4px' }} title={p.withdrawn ? "Restore" : "Eliminate"}>
                          {p.withdrawn ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removePlayer(p.id, p.name); }} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px' }} title="Delete completely">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          {activeTab === 'matchups' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.5' }}>This is the central host dashboard. Use the main area to generate rounds, edit pairings in Draft Mode, and report results.</p>
             </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Control Bar */}
        <div style={{ padding: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {activeRoundData ? (activeRoundData.status === 'draft' ? `Draft: Round ${activeRoundData.roundNumber}` : `Round ${activeRoundData.roundNumber}`) : 'Tournament Lobby'}
              {activeRoundData?.label && <span style={{ fontSize: '0.8rem', background: '#fff', color: '#000', padding: '4px 10px', borderRadius: '30px', fontWeight: 'bold' }}>{activeRoundData.label}</span>}
              {activeRoundData?.status === 'draft' && <span style={{ fontSize: '0.9rem', background: '#ff9900', color: '#000', padding: '4px 10px', borderRadius: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Draft Mode</span>}
              {activeRoundData?.status === 'completed' && <span style={{ fontSize: '0.9rem', background: '#10b981', color: '#000', padding: '4px 10px', borderRadius: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</span>}
            </h1>
            <p style={{ color: '#888' }}>{players.length} Total Players ({players.filter(p=>!p.withdrawn).length} Active Golden Ratio)</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            {roomData?.status === 'finished' ? (
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                 <div style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #FFD700, #FDB931)', color: '#000', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Trophy size={20} /> TOURNAMENT CONCLUDED
                 </div>
                 <button onClick={() => updateDoc(doc(db, 'chess_tournaments', roomCode), { status: 'live' })} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                   Reopen
                 </button>
               </div>
            ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {activeRoundData?.status === 'completed' && (
                <button 
                  onClick={() => rollbackRound(activeRoundData.id)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,68,68,0.5)', color: '#ff4444', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <RotateCcw size={18} /> Rollback Round
                </button>
              )}
              
              <button 
                onClick={() => generatePairings('knockout')} 
                disabled={isGenerating || players.filter(p=>!p.withdrawn).length < 2 || activeRoundData?.status === 'draft'}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', opacity: (isGenerating || activeRoundData?.status === 'draft') ? 0.5 : 1 }}
              >
                <Swords size={18} /> Knockout Pairings
              </button>
              
              {activeRoundData && (activeRoundData.format === 'swiss' || activeRoundData.format === 'staircase') && (
                <button 
                  onClick={() => generatePairings(activeRoundData.format)} 
                  disabled={isGenerating || players.filter(p=>!p.withdrawn).length < 2 || activeRoundData?.status === 'draft'}
                  style={{ background: '#10b981', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', opacity: (isGenerating || activeRoundData?.status === 'draft') ? 0.5 : 1 }}
                >
                  <CheckCircle2 size={18} /> Continue {activeRoundData.format === 'swiss' ? 'Swiss' : 'Round Robin'} (Round {currentRoundNumber + 1})
                </button>
              )}

              <button 
                onClick={() => setShowSwissModal(true)} 
                disabled={isGenerating || players.filter(p=>!p.withdrawn).length < 2 || activeRoundData?.status === 'draft'}
                style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', opacity: (isGenerating || activeRoundData?.status === 'draft') ? 0.5 : 1 }}
              >
                <Shuffle size={18} /> {activeRoundData && (activeRoundData.format === 'swiss' || activeRoundData.format === 'staircase') ? 'Change Format' : `Hybrid Setup (Round ${currentRoundNumber + 1})`}
              </button>

              {activeRoundData?.status === 'completed' && (
                <button 
                  onClick={finishTournament}
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FDB931)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Trophy size={18} /> Finish Tournament
                </button>
              )}
            </div>
            )}
            {players.filter(p=>!p.withdrawn).length < 2 && <span style={{ color: '#ff4444', fontSize: '0.85rem' }}>* Need at least 2 active players</span>}
            {activeRoundData?.status === 'draft' && <span style={{ color: '#ff9900', fontSize: '0.85rem' }}>* Publish or delete the draft first</span>}
          </div>
        </div>

        {/* Current Round Actions Bar (Only if draft) */}
        {activeRoundData && activeRoundData.status === 'draft' && (
          <div style={{ background: 'rgba(255,153,0,0.05)', borderBottom: '1px solid rgba(255,153,0,0.2)', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem', color: '#ff9900' }}>Review Pairings</h3>
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>These pairings are hidden from viewers. You can edit them now. When ready, publish the round.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setSwapMode(!swapMode)} style={{ background: swapMode ? '#ff9900' : 'transparent', color: swapMode ? '#000' : '#ff9900', border: '1px solid #ff9900', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={16} /> {swapMode ? 'Cancel Swap' : 'Swap Players'}
              </button>
              <button onClick={() => deleteDraft(activeRoundData.id)} style={{ background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Delete Draft
              </button>
              <button onClick={() => publishRound(activeRoundData.id, activeRoundData.roundNumber, activeRoundData.byePlayers)} style={{ background: '#10b981', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Publish Round
              </button>
            </div>
          </div>
        )}

        {/* Matchups Grid */}
        <div style={{ padding: '3rem', flex: 1 }}>
          {activeRoundData ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
              
              {activeRoundData.pairings.map((pairing, idx) => (
                <div key={idx} style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  padding: '1.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', letterSpacing: '2px' }}>BOARD {idx + 1} {pairing.matchType && `• ${pairing.matchType}`}</div>
                    {pairing.result !== 'pending' && <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>COMPLETED</div>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Player 1 (White) */}
                    <div 
                      onClick={() => swapMode && handleSwapClick(activeRoundData.id, idx, 1, pairing.player1, pairing.player1Name, pairing.player1Color)}
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', 
                        background: 'rgba(255,255,255,0.03)', borderRadius: '12px', 
                        borderLeft: pairing.player1Color === 'white' ? '4px solid #fff' : '4px solid #333',
                        border: selectedForSwap?.pairingIndex === idx && selectedForSwap?.playerNum === 1 ? '1px solid #ff9900' : '1px solid transparent',
                        cursor: swapMode ? 'pointer' : 'default'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: pairing.player1Color === 'white' ? '#fff' : '#333' }} />
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{pairing.player1Name}</span>
                      </div>
                      {pairing.result === 'pending' && !swapMode && activeRoundData.status === 'published' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                           <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => reportResult(activeRoundData.id, idx, '1-0')}>Won</button>
                           <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#888', padding: '6px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => reportResult(activeRoundData.id, idx, '1-0 (Walkover)')} title="Walkover (Opponent Absent)">WO</button>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem', fontWeight: 'bold' }}>VS</div>

                    {/* Player 2 (Black) */}
                    <div 
                      onClick={() => swapMode && handleSwapClick(activeRoundData.id, idx, 2, pairing.player2, pairing.player2Name, pairing.player2Color)}
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', 
                        background: 'rgba(255,255,255,0.03)', borderRadius: '12px', 
                        borderLeft: pairing.player2Color === 'white' ? '4px solid #fff' : '4px solid #333',
                        border: selectedForSwap?.pairingIndex === idx && selectedForSwap?.playerNum === 2 ? '1px solid #ff9900' : '1px solid transparent',
                        cursor: swapMode ? 'pointer' : 'default'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: pairing.player2Color === 'white' ? '#fff' : '#333' }} />
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{pairing.player2Name}</span>
                      </div>
                      {pairing.result === 'pending' && !swapMode && activeRoundData.status === 'published' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                           <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => reportResult(activeRoundData.id, idx, '0-1')}>Won</button>
                           <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#888', padding: '6px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => reportResult(activeRoundData.id, idx, '0-1 (Walkover)')} title="Walkover (Opponent Absent)">WO</button>
                        </div>
                      )}
                    </div>

                  </div>

                  {pairing.result === 'pending' && !swapMode && activeRoundData.status === 'published' && activeRoundData.format !== 'knockout' && (
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                      <button style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '8px', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => reportResult(activeRoundData.id, idx, '0.5-0.5')}>Draw ½ - ½</button>
                    </div>
                  )}

                  {pairing.result !== 'pending' && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff' }}>
                        Result: <span style={{ color: '#10b981' }}>{pairing.result}</span>
                      </div>
                      <button onClick={() => undoResult(activeRoundData.id, idx)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#888', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <RotateCcw size={14} /> Undo Result
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {activeRoundData.byePlayers && activeRoundData.byePlayers.map((bp, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '1rem' }}>GOLDEN BYE (1 POINT)</div>
                  <h3 style={{ fontSize: '1.5rem', margin: 0, textAlign: 'center' }}>{bp.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Trophy size={64} style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: '300' }}>Waiting to Start</h2>
              <p style={{ color: '#888', marginTop: '1rem' }}>Share the player code {roomData.playerCode}. Once players join, generate the first round.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
