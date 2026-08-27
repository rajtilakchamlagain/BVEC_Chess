from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'ChessVerse: Comprehensive Code & Architecture Documentation', 0, 1, 'C')
        self.ln(10)

    def chapter_title(self, num, label):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 8, f'Chapter {num} : {label}', 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 11)
        body = body.replace('’', "'").replace('•', '-')
        self.multi_cell(0, 6, body)
        self.ln()

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

chapters = [
    ("Introduction", "This document serves as a comprehensive technical guide to the ChessVerse application. It explains every major file in the project, what it was made for, and how the codebase works together to deliver a real-time chess tournament experience."),
    
    ("Root Configurations & Files", 
     "- package.json / package-lock.json: These files define the project's dependencies (such as React, Firebase, framer-motion, lucide-react) and scripts. We use Vite (npm run dev) for ultra-fast module bundling and hot-reloading.\n"
     "- index.html: The core HTML file. It mounts the <div id='root'></div> where the React application injects itself. It also links the favicon (chesslogo.jpeg).\n"
     "- vite.config.js: Configuration file for the Vite bundler, utilizing the @vitejs/plugin-react to compile JSX and ES modules.\n"
     "- vercel.json: Configuration for deploying the frontend to Vercel, ensuring client-side routing works by rewriting all traffic to index.html."),
    
    ("Frontend Routing (App.jsx & main.jsx)", 
     "- src/main.jsx: The entry point of the React app. It imports the global CSS (index.css) and renders the <App /> component into the root DOM node using React 19's createRoot.\n"
     "- src/App.jsx: The routing hub. It utilizes react-router-dom to define paths like '/' (LandingPage), '/chess-owner-entry' (Host Dashboard Login), and '/chess-viewer-room' (Live Spectator). It also wraps everything in an <ErrorBoundary> component to catch rendering errors."),
    
    ("Styling & Assets", 
     "- src/index.css & src/App.css: Contains all the global styling variables. We recently executed a massive UI renovation, removing AI-generated 'slop' and replacing it with a custom Premium Light Theme. It uses subtle glassmorphism (backdrop-filter), modern elevation shadows, and a radial background gradient.\n"
     "- public/raj.jpg & logo.jpg: Static assets served at the root URL. Used in the About section and the Landing Page header."),
    
    ("Core Pages: Landing & Entries", 
     "- src/pages/LandingPage.jsx: The face of ChessVerse. It contains the premium navigation bar with functional 'Tournaments', 'Rules', and 'About' modals. It utilizes Framer Motion to animate the FIDE Standard Rules modal and the Developer Profile Card (Rajtilak Chamlagain).\n"
     "- src/pages/ChessOwnerEntry.jsx: The authentication gatekeeper. It ensures only authorized personnel (via Google Auth) can create or manage a tournament room. It generates the 6-digit Host Code.\n"
     "- src/pages/ChessPlayerEntry.jsx: The player registration flow. Players input their name and a valid tournament room code. The app validates the code in Firestore and injects their document into the room's 'players' collection.\n"
     "- src/pages/ChessViewerEntry.jsx: The spectator gateway. It also fetches 'Recent Tournaments' from Firestore, allowing viewers to jump into ongoing matches."),
    
    ("Core Pages: Real-time Dashboards", 
     "- src/pages/ChessDashboard.jsx: The massive Host Dashboard. This file connects directly to Firebase to manage the tournament state. When the host clicks 'Generate Next Round', it runs the pairing algorithms and pushes the new matchups to Firestore. The host can input match scores (Win/Draw/Loss), and the dashboard updates the players' overall points and tie-breakers immediately.\n"
     "- src/pages/ChessViewerRoom.jsx: The Live Spectator Hub. This component sets up a Firebase 'onSnapshot' listener. This means it establishes a continuous WebSocket connection to the database. Whenever the Host updates a score in ChessDashboard.jsx, this component receives the new data in milliseconds and instantly re-renders the live leaderboard and match results without the user ever refreshing the page."),
    
    ("Backend Integration (Firebase)", 
     "- src/firebase.js: Initializes the Firebase app with the required API keys. It exports the 'auth' object (for Google Sign-in) and the 'db' object (Firestore). Firestore acts as our NoSQL database, storing tournaments as documents, with 'players' and 'rounds' structured as sub-collections."),
    
    ("Development Scripts (Python & JS)", 
     "Throughout the development process, multiple Python and Node scripts (e.g., update_jsx.py, fix_codes.py, full_renovation.py) were created to automate massive codebase refactors. Instead of manually editing 5,000 lines of code to switch themes or fix missing imports, these scripts utilized regex and AST manipulation to automatically patch files, saving hours of manual labor.")
]

for i, (title, body) in enumerate(chapters, 1):
    pdf.chapter_title(i, title)
    pdf.chapter_body(body)

pdf.output("ChessVerse_Comprehensive_Documentation.pdf")
print("PDF generated successfully.")
