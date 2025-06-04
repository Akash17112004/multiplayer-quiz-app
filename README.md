# 🎮 Multiplayer Quiz App

A real-time multiplayer quiz game inspired by **Kahoot!**, built using **React**, **Node.js**, and **Socket.IO**.

Players can join a lobby with a shared PIN, compete in answering timed quiz questions, and view a live-updating leaderboard.

---

## 🚀 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Realtime Communication**: Socket.IO
- **Styling**: Basic CSS (optionally Tailwind or Bootstrap)

---

## 📁 Project Structure

```
multiplayer-quiz-app/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # React components (Lobby, Game, Leaderboard, etc.)
│   │   └── App.jsx     # Main routing logic
│   └── public/
├── server/             # Node.js/Express backend
│   └── index.js        # Main server logic with Socket.IO
└── README.md
```

---

## 🧩 Features

- 👥 Real-time lobby system with shared PIN
- 🧠 7 preloaded quiz questions
- 🏁 Host-controlled game start
- 📝 Auto-tracking of answers per question
- 📊 Live leaderboard
- ⚡ Disconnect handling (rehost, remove player)
- 🚫 Prevents late joins once game starts

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Akash17112004/multiplayer-quiz-app.git
cd multiplayer-quiz-app
```

### 2. Start the server

```bash
cd server
npm install
node index.js
```

Runs at [http://localhost:4000](http://localhost:4000)

### 3. Start the client

```bash
cd ../client
npm install
npm start
```

Runs at [http://localhost:3000](http://localhost:3000)

---

## ▶️ How to Play

1. Open **two browser tabs** or **multiple devices**.
2. On each, go to [http://localhost:3000](http://localhost:3000).
3. Enter the same **PIN** (`1234`) and a **nickname**.
4. The **first user to join** becomes the **host**.
5. Host clicks **“Start Game”** to begin.
6. Questions appear, players click to answer.
7. After each question:
   - Scores update
   - A new question appears
8. After the last question, the **final leaderboard** is shown.

---

## 🧪 Testing & Edge Cases

- ✅ Disconnecting removes a player from the room
- ✅ Host disconnection transfers host to next user
- ✅ Users joining mid-game are rejected with a warning
- ✅ Prevents duplicate usernames (optional improvement)
- ✅ Score is based on correctness (can be extended to add time-based scoring)

---

## 🎨 Styling Ideas

- Centered lobby form
- Card-style quiz UI
- Highlight top 3 in leaderboard (gold/silver/bronze)
- Add sound effects or confetti for correct answers 🎉

---

## 📦 Potential Improvements

- ✅ Add more questions from a database or API
- 💾 Use MongoDB to store quiz results and player data
- 👨‍🏫 Admin dashboard to input/edit custom quizzes
- ⏰ Countdown timers for each question
- 📱 Mobile responsiveness
- 🎮 Game history and rematch button

---

## 🙌 Acknowledgements

- Inspired by **Kahoot!** and other classroom quiz tools.
- Built with ❤️ using open-source tools.

---
## Preview
1.Login Page
![Screenshot 2025-06-04 215220](https://github.com/user-attachments/assets/0827d5cd-47b3-43a2-84b6-5a0361fdb207)
2.Players's Lobby
![Screenshot 2025-06-04 215254](https://github.com/user-attachments/assets/a4d85a64-0ec2-491d-8b07-937ec097e74c)
3.Questions's View
![Screenshot 2025-06-04 215311](https://github.com/user-attachments/assets/5b819195-d330-4325-bb94-8bc90c530237)
4.LeaderBoard
![Screenshot 2025-06-04 215422](https://github.com/user-attachments/assets/ac7433d0-adb2-46af-bd08-fa19bfb7e360)




## 📝 License

This project is open-source and free to use under the MIT License.
