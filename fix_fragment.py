import os

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessViewerRoom.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Wrap the false branch of the ternary in a fragment
old_branch = """        <div className="spectator-content">
          {roomData?.status === 'finished' ? (
            <FinalResults rankedPlayers={rankedPlayers} />
          ) : ("""

new_branch = """        <div className="spectator-content">
          {roomData?.status === 'finished' ? (
            <FinalResults rankedPlayers={rankedPlayers} />
          ) : (
            <>"""

if old_branch in content:
    content = content.replace(old_branch, new_branch)

# And close the fragment at the end
old_end = """          )}
        </div>
      </main>"""

new_end = """            </>
          )}
        </div>
      </main>"""

if old_end in content:
    content = content.replace(old_end, new_end)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed JSX fragment in ChessViewerRoom.")
