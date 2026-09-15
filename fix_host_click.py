import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

host_logic = """
  const handleHostClick = async () => {
    if (user) {
      navigate('/chess-owner-entry');
    } else {
      try {
        await signInWithPopup(auth, googleProvider);
        navigate('/chess-owner-entry');
      } catch (e) {
        console.error("Login failed", e);
      }
    }
  };
"""

content = content.replace(
    "const handleSignIn = async () => {",
    host_logic + "\n  const handleSignIn = async () => {"
)

# Now find the Host Dashboard card specifically and change its onClick
card_pattern = r"(<motion\.div\s+className=\"premium-card\"\s+style={{ flex: 1, minWidth: '280px' }}\s+)onClick={handleSignIn}"
content = re.sub(card_pattern, r"\1onClick={handleHostClick}", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LandingPage Host click logic")
