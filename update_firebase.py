import os
import re

firebase_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\firebase.js"

with open(firebase_path, "r", encoding="utf-8") as f:
    content = f.read()

if "getAuth" not in content:
    content = content.replace("import { getStorage } from \"firebase/storage\";", "import { getStorage } from \"firebase/storage\";\nimport { getAuth, GoogleAuthProvider } from \"firebase/auth\";")
    content += "\nexport const auth = getAuth(app);\nexport const googleProvider = new GoogleAuthProvider();\n"

with open(firebase_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated firebase.js with auth exports")
