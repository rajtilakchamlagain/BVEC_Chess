import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add the branch dropdown right after Course
branch_html = """              <div className="input-group">
                <label>Course</label>
                <select className="premium-input" value={playerData.course} onChange={e => setPlayerData({...playerData, course: e.target.value})}>
                  <option>B.Tech</option>
                  <option>M.Tech</option>
                  <option>B.Sc</option>
                </select>
              </div>

              <div className="input-group">
                <label>Branch</label>
                <select className="premium-input" value={playerData.branch} onChange={e => setPlayerData({...playerData, branch: e.target.value})}>
                  <option value="CSE">CSE</option>
                  <option value="ETE">ETE</option>
                  <option value="CE">CE</option>
                  <option value="ME">ME</option>
                </select>
              </div>"""

# Ensure we set a default branch if it's empty in state
content = content.replace("branch: '',", "branch: 'CSE',")

# Replace Course block with Course + Branch
course_regex = r"<div className=\"input-group\">\s*<label>Course</label>\s*<select className=\"premium-input\" value=\{playerData\.course\} onChange=\{e => setPlayerData\(\{\.\.\.playerData, course: e\.target\.value\}\)\}>\s*<option>B\.Tech</option>\s*<option>M\.Tech</option>\s*<option>B\.Sc</option>\s*</select>\s*</div>"

content = re.sub(course_regex, branch_html, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added Branch dropdown to ChessPlayerEntry.jsx")
