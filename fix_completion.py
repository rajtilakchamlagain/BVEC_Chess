import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix updateMatchResult to update status in the same batch
anchor = """      const updatedPairings = roundDoc.pairings.map(p => {
        if (p.player1 === pairing.player1 && p.player2 === pairing.player2) {
          return { ...p, result };
        }
        return p;
      });
      batch.update(doc(db, 'chess_tournaments', roomCode, 'rounds', roundId), { pairings: updatedPairings });"""

replacement = """      const updatedPairings = roundDoc.pairings.map(p => {
        if (p.player1 === pairing.player1 && p.player2 === pairing.player2) {
          return { ...p, result };
        }
        return p;
      });
      
      const allDone = updatedPairings.every(p => p.result !== 'pending');
      batch.update(doc(db, 'chess_tournaments', roomCode, 'rounds', roundId), { 
        pairings: updatedPairings,
        ...(allDone ? { status: 'completed' } : {})
      });"""

if anchor in content:
    content = content.replace(anchor, replacement)

# Remove the broken checkRoundCompletion call
old_call = "        checkRoundCompletion(roundId);"
if old_call in content:
    content = content.replace(old_call, "// checkRoundCompletion removed, handled in batch")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed updateMatchResult auto-completion bug.")
