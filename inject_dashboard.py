import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessDashboard.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import FinalResults
if "FinalResults" not in content:
    content = content.replace("import { calculateRankings } from '../utils/chessLogic';", "import { calculateRankings } from '../utils/chessLogic';\nimport FinalResults from '../components/FinalResults';")

# 2. Inject it into the main rendering area
main_content_start = """<div style={{ flex: 1, overflowY: 'auto' }}>"""
main_content_replacement = """<div style={{ flex: 1, overflowY: 'auto' }}>
            {roomData?.status === 'finished' ? (
              <FinalResults rankedPlayers={rankedPlayers} />
            ) : ("""

if main_content_start in content:
    content = content.replace(main_content_start, main_content_replacement, 1)

# Find the end of the <div style={{ flex: 1, overflowY: 'auto' }}> which is right before </main>
end_main = """          </div>
        </main>
      </div>"""
end_main_replacement = """            )}
          </div>
        </main>
      </div>"""

if end_main in content:
    content = content.replace(end_main, end_main_replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ChessDashboard.")
