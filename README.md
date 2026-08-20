# 🏆 PitchBid

**PitchBid** is a premium, high-stakes sports auction and drafting platform designed for local tournaments and leagues. Built with a "million-dollar budget" aesthetic, PitchBid brings the thrill of professional franchise auctions (like the IPL) to village, community, and amateur sports levels.

Currently optimized for **Football** drafts, PitchBid allows players to register their profiles and team owners to bid on talent in real-time within a secure, high-end digital auction room.

---

## ✨ Features

- **💎 Premium UI/UX:** Stunning dark mode aesthetics, glassmorphism design, custom gradients, and micro-animations that make the platform feel like a top-tier professional product.
- **🏃‍♂️ Player Registration:** Seamless multi-step onboarding for athletes. Capture Real Names, Nick Names, Age, Top 3 Positions, and Preferred Foot.
- **👑 Owner Dashboard:** Secure passcode entry and tournament hosting capabilities. Owners can generate new auction rooms, specify budgets, and invite other franchise owners via shareable magic links.
- **🔨 Live Auction Room:** A dynamic bidding stage featuring player cards, live highest-bidder tracking, remaining budgets, and a countdown timer. 

---

## 🚀 Tech Stack

- **Frontend Framework:** React (bootstrapped with Vite)
- **Styling:** Vanilla CSS (leveraging CSS Variables, Flexbox/Grid, and Keyframe Animations)
- **Routing:** React Router DOM
- **Icons:** Lucide React

---

## 🚀 Getting Started

The platform is fully hosted and accessible online. There is no need to clone or install anything locally!

**Play Now:** 👉 [pitch-bid.vercel.app](https://pitch-bid.vercel.app)

---

## 🎮 How It Works

1. **Host a Tournament (For Organizers/Owners):** Click "Enter as Owner", select "Host a New Tournament", specify the parameters, and generate your room. 
2. **Share the Link:** Copy the magic invite link and share it with other team owners so they can join your lobby.
3. **Register Players:** Athletes click "Enter as Player", input the Room Code, and submit their stats.
4. **Start Bidding:** Once everyone is registered, enter the Auction Room and start bidding on your favorite local talents!

---

## ♟️ Chess Engine (Tournament Manager)

In addition to auctions, PitchBid features a robust **Chess Tournament Engine** capable of handling Knockout, Swiss, and Round Robin formats.

### FIDE Mathematical Tiebreaks
To ensure absolute fairness, the platform implements standard FIDE mathematical tiebreaks to automatically sort players on the leaderboard when their total points are tied.

**Swiss & Round Robin Tiebreaks:**
1. **Buchholz Cut 1 (BUC1):** Sum of all opponents' scores, excluding the lowest-scoring opponent.
2. **Buchholz (BUC):** Sum of all opponents' scores.
3. **Sonneborn-Berger (SB):** Sum of defeated opponents' scores plus half the scores of drawn opponents.
4. **Direct Encounter:** Head-to-head match result (if applicable).

If a tournament reaches its mathematical conclusion, the system automatically detects the end state and generates the final standings podium.

---

*Designed for the passion of local sports.*
