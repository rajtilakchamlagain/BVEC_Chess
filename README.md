# ChessVerse - Barak Valley Engineering College ♟️

**ChessVerse** is the official, modernized Chess Tournament Management Portal for the **Barak Valley Engineering College Chess Club**. It is designed as a robust, real-time application for hosting, managing, and viewing professional chess tournaments.

## 🌟 Key Features
- **Official & Standardized Design:** The portal's user interface is heavily inspired by the **ePrastuti guidelines** (Standardization of Websites for Assam Government). It features an accessible, clean, and formal design language with official college and club emblems.
- **Swiss & Knockout Pairing Engines:** Advanced algorithms to generate pairings, track colors (white/black), handle byes, and prevent duplicate matchups in Swiss formats.
- **Real-Time Host Dashboard:** Tournament organizers can draft rounds, report match results, resolve disputes, and publish live standings instantly.
- **Live Spectator Mode:** Students and viewers can watch the live standings, ongoing rounds, and results update in real-time without needing to refresh the page.
- **Player Onboarding:** A streamlined registration process for players to join the official tournament lobby.

## 💻 Tech Stack
- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Backend & Database:** [Firebase Firestore](https://firebase.google.com/) for real-time WebSockets and NoSQL data management.
- **Styling:** Custom CSS with [Framer Motion](https://www.framer.com/motion/) for fluid animations and [Lucide React](https://lucide.dev/) for iconography.
- **Routing:** React Router v7

## 🚀 How It Was Built
The project was originally extracted from a larger monolithic application (PitchBid Auction) and meticulously refactored to serve as a standalone, specialized chess platform. The extraction process involved:
1. **Routing Overhaul:** Stripping out unrelated auction routes and configuring the app specifically for Chess Host, Player, and Viewer experiences.
2. **UI/UX Redesign:** Transforming the landing page from a dark-mode premium aesthetic to a bright, accessible, and government-standard compliant (ePrastuti) interface.
3. **Logic Isolation:** Ensuring the complex `chessLogic.js` algorithms (Round Robin, Swiss, Knockout) remained intact and integrated seamlessly with the Firebase real-time listeners.

## 🛠️ Running Locally

To run the ChessVerse platform locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajtilakchamlagain/BVEC_Chess.git
   cd BVEC_Chess
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173` to view the application.

## 📝 License
Developed and maintained by **Rajtilak Chamlagain**.
© 2026 BVEC Chess Club. All rights reserved.
