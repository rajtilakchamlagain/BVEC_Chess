import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
content = content.replace(
    "import { auth } from '../firebase';",
    "import { auth, googleProvider } from '../firebase';"
)
content = content.replace(
    "import { onAuthStateChanged } from 'firebase/auth';",
    "import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';"
)

# Add handleSignIn function
handle_sign_in = """
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };
"""

content = content.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n" + handle_sign_in
)

# Update the button
content = content.replace(
    "onClick={() => navigate('/chess-owner-entry')}",
    "onClick={handleSignIn}"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LandingPage successfully")
