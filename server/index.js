
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// 1) Seven hard‐coded questions
const QUESTIONS = [
  {
    id: 1,
    text: 'What is the capital of Australia?',
    choices: ['Sydney', 'Canberra', 'Melbourne', 'Brisbane'],
    correctIndex: 1
  },
  {
    id: 2,
    text: 'Which planet is known as the Red Planet?',
    choices: ['Earth', 'Venus', 'Mars', 'Jupiter'],
    correctIndex: 2
  },
  {
    id: 3,
    text: 'What is the chemical symbol for Gold?',
    choices: ['Ag', 'Au', 'Gd', 'Go'],
    correctIndex: 1
  },
  {
    id: 4,
    text: 'Who wrote “Romeo and Juliet”?',
    choices: ['Charles Dickens', 'Jane Austen', 'William Shakespeare', 'Mark Twain'],
    correctIndex: 2
  },
  {
    id: 5,
    text: '2 + 2 × 3 = ?',
    choices: ['8', '10', '6', '12'],
    correctIndex: 0
  },
  {
    id: 6,
    text: 'In which year did the Titanic sink?',
    choices: ['1912', '1905', '1920', '1918'],
    correctIndex: 0
  },
  {
    id: 7,
    text: 'What is the largest mammal in the world?',
    choices: ['African Elephant', 'Blue Whale', 'Giraffe', 'Orca'],
    correctIndex: 1
  }
];

// 2) Single fixed PIN
const GAME_PIN = '1234';

// 3) In‐memory room for PIN=1234
const rooms = {
  [GAME_PIN]: {
    host: null,
    players: {},            // { socketId: { name, score, answered } }
    currentQuestionIndex: 0
  }
};

io.on('connection', socket => {
  console.log(`⚡️ [server] Socket connected: ${socket.id}`);

  // 4) Handle join‐room
  socket.on('join-room', ({ pin, name }) => {
    console.log(`→ [server] Received join-room from ${socket.id}: pin="${pin}", name="${name}"`);

    const room = rooms[pin];
    if (!room) {
      console.log(`↪️ [server] Invalid PIN "${pin}" from ${socket.id}`);
      socket.emit('join-error', 'Invalid PIN');
      return;
    }

    // Prevent late joiners if the game has already started
    if (room.currentQuestionIndex > 0) {
      console.log(`↪️ [server] ${name} tried to join mid‐game`);
      socket.emit('late-error', 'Game in progress—wait for next round.');
      return;
    }

    // First joiner becomes host
    if (!room.host) {
      room.host = socket.id;
      console.log(`↪️ [server] ${name} (${socket.id}) is now HOST`);
      socket.emit('you-are-host');
    }

    socket.join(pin);
    room.players[socket.id] = { name, score: 0, answered: false };

    // Broadcast updated player list
    const allNames = Object.values(room.players).map(p => p.name);
    console.log(`↪️ [server] Updated players in room:`, allNames);
    io.to(pin).emit('update-players', allNames);
  });

  // 5) Handle start‐game
  socket.on('start-game', pin => {
    console.log(`→ [server] Received start-game from ${socket.id}, pin="${pin}"`);
    const room = rooms[pin];
    if (!room) {
      console.log(`↪️ [server] No room for PIN "${pin}"`);
      return;
    }
    if (socket.id !== room.host) {
      console.log(`↪️ [server] ${socket.id} is NOT host, ignoring start-game`);
      socket.emit('start-error', 'Only the host can start');
      return;
    }

    console.log(`🏁 [server] Host ${socket.id} is starting the game`);
    room.currentQuestionIndex = 0;
    Object.values(room.players).forEach(p => {
      p.score = 0;
      p.answered = false;
    });

    const firstQ = QUESTIONS[0];
    console.log('    ↪️ [server] Emitting new-question:', firstQ);
    io.to(pin).emit('new-question', {
      id: firstQ.id,
      text: firstQ.text,
      choices: firstQ.choices
    });
  });

  // 6) Handle submit‐answer
  socket.on('submit-answer', ({ pin, questionId, selectedIndex }) => {
    console.log(`→ [server] Received submit-answer from ${socket.id}: pin="${pin}", questionId=${questionId}, selectedIndex=${selectedIndex}`);

    const room = rooms[pin];
    if (!room) {
      console.log(`↪️ [server] No room found for PIN="${pin}" in submit-answer`);
      return;
    }

    const player = room.players[socket.id];
    if (!player) {
      console.log(`↪️ [server] submit-answer from unknown player ${socket.id}`);
      return;
    }

    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      console.log(`↪️ [server] No question with id=${questionId}`);
      return;
    }

    if (selectedIndex === question.correctIndex) {
      player.score += 10;
      console.log(`↪️ [server] Correct answer! ${player.name} now has ${player.score} pts`);
    } else {
      console.log(`↪️ [server] Incorrect answer by ${player.name}`);
    }

    player.answered = true;

    const allAnswered = Object.values(room.players).every(p => p.answered);
    console.log(`↪️ [server] allAnswered = ${allAnswered} for room ${pin}`);

    if (!allAnswered) {
      return;
    }

    const leaderboard = Object.values(room.players)
      .map(p => ({ name: p.name, score: p.score }))
      .sort((a, b) => b.score - a.score);

    console.log(`↪️ [server] Emitting show-leaderboard:`, leaderboard);
    io.to(pin).emit('show-leaderboard', leaderboard);

    Object.values(room.players).forEach(p => {
      p.answered = false;
    });

    setTimeout(() => {
      room.currentQuestionIndex += 1;
      if (room.currentQuestionIndex < QUESTIONS.length) {
        const nextQ = QUESTIONS[room.currentQuestionIndex];
        console.log(`↪️ [server] Emitting new-question:`, nextQ);
        io.to(pin).emit('new-question', {
          id: nextQ.id,
          text: nextQ.text,
          choices: nextQ.choices
        });
      } else {
        console.log(`↪️ [server] Emitting game-over:`, leaderboard);
        io.to(pin).emit('game-over', leaderboard);
      }
    }, 5000);
  });

  // 7) Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ [server] Socket disconnected: ${socket.id}`);

    const room = rooms[GAME_PIN];
    if (!room.players[socket.id]) {
      return;
    }

    delete room.players[socket.id];

    if (room.host === socket.id) {
      const remaining = Object.keys(room.players);
      room.host = remaining.length > 0 ? remaining[0] : null;
      if (room.host) {
        io.to(room.host).emit('you-are-host');
        console.log(`↪️ [server] New host is ${room.host}`);
      } else {
        console.log(`↪️ [server] No host left (room empty)`);
      }
    }

    const remainingNames = Object.values(room.players).map(p => p.name);
    io.to(GAME_PIN).emit('update-players', remainingNames);
    console.log(`↪️ [server] After disconnect, players:`, remainingNames);

    if (room.currentQuestionIndex > 0) {
      const allAnswered = Object.values(room.players).every(p => p.answered);
      console.log(`↪️ [server] After disconnect, allAnswered = ${allAnswered}`);
      if (allAnswered) {
        const leaderboard = Object.values(room.players)
          .map(p => ({ name: p.name, score: p.score }))
          .sort((a, b) => b.score - a.score);

        console.log(`↪️ [server] Emitting show-leaderboard (post-disconnect):`, leaderboard);
        io.to(GAME_PIN).emit('show-leaderboard', leaderboard);

        Object.values(room.players).forEach(p => (p.answered = false));

        setTimeout(() => {
          room.currentQuestionIndex += 1;
          if (room.currentQuestionIndex < QUESTIONS.length) {
            const nextQ = QUESTIONS[room.currentQuestionIndex];
            console.log(`↪️ [server] Emitting new-question (post-disconnect):`, nextQ);
            io.to(GAME_PIN).emit('new-question', {
              id: nextQ.id,
              text: nextQ.text,
              choices: nextQ.choices
            });
          } else {
            console.log(`↪️ [server] Emitting game-over (post-disconnect):`, leaderboard);
            io.to(GAME_PIN).emit('game-over', leaderboard);
          }
        }, 5000);
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 [server] Listening on http://localhost:${PORT}`);
});
