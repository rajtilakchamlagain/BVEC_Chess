import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """        if (format === 'knockout') {
          const lastRound = rounds.length > 0 ? rounds[0] : null;
          
          // Check for 3rd Place Match generation (if last round had exactly 4 players / 2 matches)
          if (lastRound && lastRound.format === 'knockout' && lastRound.pairings.length === 2 && lastRound.status === 'completed') {"""

new_block = """        if (format === 'knockout') {
          const lastRound = rounds.length > 0 ? rounds[0] : null;
          
          if (lastRound && lastRound.status !== 'completed') {
            alert("Please wait for the current round to fully complete before generating the next round.");
            setIsGenerating(false);
            return;
          }
          
          // Check for 3rd Place Match generation (if last round had exactly 4 players / 2 matches)
          if (lastRound && lastRound.format === 'knockout' && lastRound.pairings.length === 2) {"""

if old_block in content:
    content = content.replace(old_block, new_block)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed generatePairings race condition.")
