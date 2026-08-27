import re

file_path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\LandingPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Prepend the import if it's missing
if "useState" not in content.split("import")[1] and "useEffect" not in content.split("import")[1]:
    content = "import React, { useState, useEffect } from 'react';\n" + content

# Also add optional chaining for user.email just to be safe
content = content.replace("{user.email.charAt(0).toUpperCase()}", "{user?.email?.charAt(0)?.toUpperCase() || 'U'}")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed imports in LandingPage")
