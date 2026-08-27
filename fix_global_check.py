import os
import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# First undo the previous fix inside if (format === 'knockout')
old_fix = """          if (lastRound && lastRound.status !== 'completed') {
            alert("Please wait for the current round to fully complete before generating the next round.");
            setIsGenerating(false);
            return;
          }"""
if old_fix in content:
    content = content.replace(old_fix, "")

# Now add a global check for any round type
# Find where existingDraft is checked
anchor = """    const existingDraft = rounds.find(r => r.status === 'draft');
    if (existingDraft) {
      alert("There is already an unpublished draft round. Delete or publish it first.");
      return;
    }"""

global_check = """    const existingDraft = rounds.find(r => r.status === 'draft');
    if (existingDraft) {
      alert("There is already an unpublished draft round. Delete or publish it first.");
      return;
    }

    const lastRoundGlobally = rounds.length > 0 ? rounds[0] : null;
    if (lastRoundGlobally && lastRoundGlobally.status !== 'completed' && lastRoundGlobally.status !== 'draft') {
      alert("Please wait for all matches in the current round to finish and be reported before generating the next round.");
      return;
    }"""

# Fix indentation matching. The original code has 6 spaces:
anchor = """      const existingDraft = rounds.find(r => r.status === 'draft');
      if (existingDraft) {
        alert("There is already an unpublished draft round. Delete or publish it first.");
        return;
      }"""

global_check = """      const existingDraft = rounds.find(r => r.status === 'draft');
      if (existingDraft) {
        alert("There is already an unpublished draft round. Delete or publish it first.");
        return;
      }

      const lastRoundGlobally = rounds.length > 0 ? rounds[0] : null;
      if (lastRoundGlobally && lastRoundGlobally.status !== 'completed' && lastRoundGlobally.status !== 'draft') {
        alert("Please wait for all matches in the current round to finish and be reported before generating the next round.");
        return;
      }"""

if anchor in content:
    content = content.replace(anchor, global_check)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied global round completion enforcement.")
