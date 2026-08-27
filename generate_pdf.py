from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'ChessVerse: Architecture and Project Documentation', 0, 1, 'C')
        self.ln(10)

    def chapter_title(self, num, label):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 8, f'Chapter {num} : {label}', 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 11)
        # Replacing strange characters or bullets
        body = body.replace('’', "'").replace('•', '-')
        self.multi_cell(0, 6, body)
        self.ln()

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

chapters = [
    ("Introduction", "ChessVerse is the official, modernized Chess Tournament Management Portal built for the Barak Valley Engineering College (BVEC) Chess Club.\nThe platform is designed to handle professional chess tournaments seamlessly, providing specialized interfaces for three main types of users:\n- Host (Organizer): Creates tournaments, manages rounds, inputs scores, and generates the final podium.\n- Player: Registers using a specific room code to track their pairings, board numbers, and live scores.\n- Spectator (Viewer): Joins a room to watch real-time updates of live pairings and leaderboard standings without needing to refresh the page."),
    
    ("Technology Stack", "The application is built using a modern, scalable web stack:\n- Frontend Framework: React 19 (using Vite as the build tool for ultra-fast compilation).\n- Styling: CSS3 with custom variables for a Premium Light Theme. We utilized framer-motion for fluid page transitions and lucide-react for crisp SVG icons.\n- Backend & Database: Firebase v11 (Firestore). We opted for Firestore because its NoSQL architecture and WebSocket listeners (onSnapshot) are perfect for real-time multiplayer state synchronization.\n- Routing: React Router v7 for client-side navigation.\n- Deployment: Vercel (Frontend) & Firebase (Backend)."),
    
    ("How the Application Works (Architecture)", "1. Real-time State Management (Firebase)\nInstead of a traditional REST API (where the user has to refresh the page to fetch new data), ChessVerse uses Firebase Realtime Listeners.\n- Whenever the Host clicks 'Generate Pairings' or 'Update Score', a write operation is sent to the Firestore database.\n- The Firebase servers instantly push this updated document to all connected clients within milliseconds.\n- React receives this new state, triggers a re-render, and the UI updates live.\n\n2. The Three Main Portals\n- Host Dashboard (ChessDashboard.jsx): Acts as the control center. The Host creates a Room Code and a Viewer Code. It reads the players and rounds arrays.\n- Player Entry & Hub (ChessPlayerEntry.jsx): Players enter their name and the Room Code. The app saves them into the Firestore players array.\n- Viewer Entry & Hub (ChessViewerEntry.jsx): Viewers use the Viewer Code. The Viewer portal has a read-only snapshot listener. It ranks the players by points (bvh / sb tiebreakers) and displays the global leaderboard."),
    
    ("Complex Logic: Tournament Engines", "The core logic resides in chessLogic.js, which exports algorithms for different tournament formats:\n\n- Swiss System: A non-elimination format where players are paired against others with similar running scores. Our algorithm tracks previous opponents to ensure no two players face each other twice, and balances color histories so a player doesn't play Black three times in a row.\n- Knockout: A single-elimination bracket. Our script automatically halves the player pool each round. We also engineered a specific race-condition fix for the 3rd Place Match, ensuring that the losers of the Semi-Finals are properly matched in the Final Round.\n- Round Robin (Staircase): Every player plays every other player exactly once."),
    
    ("UI/UX Design (The Premium Overhaul)", "Initially, the app suffered from generic, blocky layouts (often referred to as 'AI-generated slop'). We executed a massive UI renovation:\n- Glassmorphism & Shadows: Replaced harsh black backgrounds and rigid borders with a soft slate background, clean white panels, and elegant elevation shadows.\n- Responsive Mobile-First Design: Adjusted flex-wrap grids, padded the entry modals, and shrank the massive card paddings specifically for screens under 768px so the app feels like a native iOS/Android application on phones.\n- Layout Psychology: On the Landing Page, the Tournaments card was promoted to a full-width top card to emphasize the most common user action (spectating)."),
    
    ("Summary", "By leveraging React for dynamic UI building, Firebase for seamless real-time syncing, and custom algorithms for chess rules, ChessVerse stands out as a highly professional, scalable, and instant tournament management system tailored specifically for BVEC's needs.")
]

for i, (title, body) in enumerate(chapters, 1):
    pdf.chapter_title(i, title)
    pdf.chapter_body(body)

pdf.output("ChessVerse_Architecture.pdf")
print("PDF generated successfully.")
