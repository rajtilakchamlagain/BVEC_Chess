# ChessVerse - Barak Valley Engineering College ♟️

**Live Demo:** [https://bvecchess.vercel.app/](https://bvecchess.vercel.app/)

**ChessVerse** is the official, modernized Chess Tournament Management Portal for the **Barak Valley Engineering College Chess Club**. It is a premium, real-time web application designed to host, manage, and spectate professional college chess tournaments seamlessly from any device.

## 🚀 Key Features
- **Premium UI/UX:** A custom, sleek, and highly responsive interface with subtle glassmorphism, refined elevation shadows, and fluid animations. Designed to look and feel like a native application on both desktop and mobile.
- **Advanced Pairing Engines:** Automated logic for generating **Swiss**, **Knockout**, and **Staircase** format matchups. Features built-in intelligence to track player colors (White/Black history), handle byes, and calculate advanced tie-breakers (BUC, SB).
- **Host Dashboard:** A comprehensive control center for organizers. Draft rounds, manually swap players if needed, instantly report match results, and seamlessly generate the Grand Podium once the tournament concludes.
- **Live Spectator Portal:** Students and fans can access the "Tournaments" tab to browse recent/ongoing tournaments. Once inside a room, spectators receive real-time, zero-refresh updates on live pairings, board numbers, and leaderboard standings.
- **Player Hub:** A streamlined registration flow where players join a lobby using a host-provided code and track their individual tournament journey.

## 🛠️ Tech Stack
- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Backend & Database:** [Firebase Firestore](https://firebase.google.com/) for real-time WebSockets and NoSQL data management.
- **Styling:** Custom CSS for premium styling, combined with [Framer Motion](https://www.framer.com/motion/) for fluid animations and [Lucide React](https://lucide.dev/) for iconography.
- **Routing:** React Router v7

## 💻 Running Locally

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

## 📄 License
Developed and maintained by **Rajtilak Chamlagain**.
© 2026 BVEC Chess Club. All rights reserved.
