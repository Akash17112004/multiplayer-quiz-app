# Multiplayer Quiz App

**A real‐time multiplayer quiz application**, inspired by platforms like Kahoot! Players join with a PIN, answer questions in real‐time, and see a leaderboard after each question. Built with React.js, Node.js/Express, and Socket.IO.

---

## Overview

- **Inspiration**: Similar to Kahoot!—host starts the game, players answer multiple‐choice questions, and scores are tracked live.
- **Flow**:
  1. Players enter a nickname and a shared game PIN.
  2. The host (first player in) clicks **Start Game**, broadcasting questions in real time.
  3. After each question, a leaderboard is shown for 5 seconds.
  4. The game proceeds through 7 hard‐coded questions, then displays final results.

---

## Tech Stack

- **Frontend**: React.js  
- **Styling**: Plain CSS (simple, no UI library)  
- **Backend**: Node.js + Express  
- **Real‐time**: Socket.IO  
- **Data Persistence**: None (in‐memory only; optional MongoDB can be added)  

---

## Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone <your‐repo‐url>
