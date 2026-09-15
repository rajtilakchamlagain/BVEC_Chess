import re

path = r"C:\Users\rajti\Downloads\Projects\ChessVerse\src\pages\Leaderboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { ArrowLeft, Trophy, Medal, Star, TrendingUp, Users, X } from 'lucide-react';",
    "import { ArrowLeft, Trophy, Medal, Star, TrendingUp, Users, X, Info } from 'lucide-react';"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Info import")
