# ChessVerse - Barak Valley Engineering College ♟️

**Live Demo:** [https://bvecchess.vercel.app/](https://bvecchess.vercel.app/)

**ChessVerse** is the official, modernized Chess Tournament Management Portal for the **Barak Valley Engineering College Chess Club**. It is a premium, real-time web application designed to host, manage, and spectate professional college chess tournaments seamlessly from any device.

## 🚀 Key Features & Implementations

### 1. Tournament Management Engine
- **Advanced Pairing Logic:** Automated matchmaking for generating **Swiss**, **Knockout**, and **Staircase** formats. Features intelligence for tracking player colors (White/Black history), handling byes, and calculating advanced tie-breakers (Buchholz, Sonneborn-Berger).
- **Host Dashboard:** A comprehensive control center to draft rounds, manually swap players if algorithmic pairings need adjusting, report match results, and seamlessly generate the Grand Podium once the tournament concludes.
- **Live Spectator Portal:** Students and fans can access the "Tournaments" tab to browse recent/ongoing tournaments. Spectators receive real-time, zero-refresh updates on live pairings, board numbers, and leaderboard standings using WebSocket connections.

### 2. Monetization (Razorpay Integration)
- **Dynamic "Paid Tournaments":** Hosts can optionally flag a tournament as "Paid" during initialization and set an entry fee amount.
- **Secure UPI Checkouts:** When registering, players are presented with a live Razorpay popup to pay the exact entry fee via UPI/Cards. 
- **Serverless Payment Verification:** Uses Google Cloud Functions (`payments-createOrder`, `payments-verifyPayment`) to securely generate transaction IDs and verify Razorpay webhook signatures on the backend. No secret keys are exposed on the client.

### 3. Online Integrity (Lichess OAuth PKCE)
- **Passwordless Identity Verification:** For online tournaments, players authenticate directly via Lichess.org to prove their identity and prevent impersonation.
- **Lichess API Integration:** Implements the modern OAuth 2.0 Authorization Code Flow with PKCE entirely on the frontend. Generates secure `code_verifier` and `code_challenge` cryptographic hashes to exchange for access tokens.
- **Auto-Fill Data:** Securely pulls the authenticated player's official Lichess username and Blitz/Rapid ratings directly into the tournament registration form.

## 🏗️ Upcoming Features / Roadmap
- [ ] **Automated Notifications System (Email & WhatsApp):**
  - Integrate **Resend API** to automatically trigger emails when a player successfully registers.
  - Implement real-time notifications alerting players when their next round begins ("Round 3 begins in 5 mins! Your board is X, Opponent is Y").
  - Send final tournament standings and PDF certificates to all participants when the tournament concludes.
- [ ] **WhatsApp Business API:** Optional WhatsApp alerts for instant push notifications to players on mobile.

## 🛠️ Tech Stack Architecture

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend Infrastructure:** Google Firebase (Firestore Database + Firebase Cloud Functions)
- **Authentication:** Custom PKCE OAuth implementation for Lichess
- **Payment Gateway:** [Razorpay](https://razorpay.com/) (Node.js SDK via Cloud Functions)
- **Styling:** Custom CSS with Glassmorphism principles, [Framer Motion](https://www.framer.com/motion/) animations, and [Lucide React](https://lucide.dev/) icons.
- **Routing:** React Router v7

## 📁 Core File Structure 

- **`src/App.jsx`**: Root client-side routing.
- **`src/pages/ChessDashboard.jsx`**: The protected Host portal for round generation and score updates.
- **`src/pages/ChessPlayerEntry.jsx`**: Registration gateway featuring Lichess authentication and Razorpay payment modals.
- **`src/utils/lichessAuth.js`**: Core cryptography utility for generating PKCE SHA-256 hashes and handling the OAuth handshake.
- **`functions/payments.js`**: Google Cloud Functions backend containing Razorpay order creation and secret key handling.
- **`src/pages/ChessViewerRoom.jsx`**: The live spectator room using Firestore `onSnapshot` listeners.

## 💻 Running Locally

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
4. **Firebase Deployment (For Backend APIs):**
   ```bash
   firebase login
   firebase deploy --only functions
   ```

## 📜 License
Developed and maintained by **Rajtilak Chamlagain**.
© 2026 BVEC Chess Club. All rights reserved.
