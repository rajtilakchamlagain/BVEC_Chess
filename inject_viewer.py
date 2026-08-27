import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import FinalResults
if "FinalResults" not in content:
    content = content.replace("import { calculateRankings } from '../utils/chessLogic';", "import { calculateRankings } from '../utils/chessLogic';\nimport FinalResults from '../components/FinalResults';")


# 2. Inject it into spectator-content when roomData.status === 'finished'
# Find the spectator-content block
old_content = """        {/* Pairings Area */}
        <div className="spectator-content">"""

new_content = """        {/* Pairings Area */}
        <div className="spectator-content">
          {roomData?.status === 'finished' ? (
            <FinalResults rankedPlayers={rankedPlayers} />
          ) : ("""

if old_content in content:
    content = content.replace(old_content, new_content)

# Close the ternary right before the closing main tag
end_content = """        </div>
      </main>"""

new_end_content = """          )}
        </div>
      </main>"""

if end_content in content:
    content = content.replace(end_content, new_end_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ChessViewerRoom.")
