import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\ChessPlayerEntry.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import Star from lucide-react
content = content.replace(
    "import { ArrowLeft, Users, CheckCircle2 } from 'lucide-react';",
    "import { ArrowLeft, Users, CheckCircle2, Star } from 'lucide-react';"
)

# 2. Extract my injected code
bad_injection_start = """  const [lichessVerified, setLichessVerified] = useState(false);
  const [isVerifyingLichess, setIsVerifyingLichess] = useState(false);"""
  
bad_injection_end = """      setIsVerifyingLichess(false);
    }
  };"""

# Find the entire block
injection_match = re.search(re.escape(bad_injection_start) + r".*?" + re.escape(bad_injection_end), content, re.DOTALL)
if injection_match:
    injected_block = injection_match.group(0)
    # Remove it from the current location
    content = content.replace(injected_block, "")
    
    # Re-insert it below the user state
    insert_target = "const [user, setUser] = useState(null);"
    content = content.replace(insert_target, insert_target + "\n\n" + injected_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ChessPlayerEntry")
