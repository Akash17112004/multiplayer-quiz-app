import React, { useState, useEffect } from 'react';
import JoinLobby from './components/JoinLobby';
import QuestionScreen from './components/QuestionScreen';
import Leaderboard from './components/LeaderBoard';
import GameOver from './components/GameOver';
import { socket } from './socket';

function App() {
  const [joined, setJoined] = useState(false);
  const [pin, setPin] = useState('');
  const [question, setQuestion] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [gameOverData, setGameOverData] = useState(null);

  useEffect(() => {
    // 1) new-question
    socket.on('new-question', q => {
      console.log('📥 [client] Received new-question:', q);
      setQuestion(q);
      setLeaderboardData(null);
      setGameOverData(null);
    });

    // 2) show-leaderboard
    socket.on('show-leaderboard', data => {
      console.log('📥 [client] Received show-leaderboard:', data);
      setLeaderboardData(data);
      setQuestion(null);
    });

    // 3) game-over
    socket.on('game-over', data => {
      console.log('📥 [client] Received game-over:', data);
      setGameOverData(data);
      setLeaderboardData(null);
      setQuestion(null);
    });

    return () => {
      socket.off('new-question');
      socket.off('show-leaderboard');
      socket.off('game-over');
    };
  }, []);

  // Called by JoinLobby once join-room is emitted successfully
  const handleJoined = selectedPin => {
    console.log('✅ [client] handleJoined called with pin:', selectedPin);
    setJoined(true);
    setPin(selectedPin);
  };

  return (
    <div>
      {/* 1) Before joining: show the join form */}
      {!joined && <JoinLobby onJoin={handleJoined} />}

      {/* 2) After joining but before any question/leaderboard/gameOver: show lobby view */}
      {joined && question === null && !leaderboardData && !gameOverData && (
        <JoinLobby onJoin={handleJoined} joinedPin={pin} />
      )}

      {/* 3) Once a question arrives: show QuestionScreen */}
      {joined && question !== null && !leaderboardData && !gameOverData && (
        <QuestionScreen question={question} pin={pin} />
      )}

      {/* 4) When the leaderboard arrives: show Leaderboard */}
      {joined && leaderboardData !== null && !gameOverData && (
        <Leaderboard data={leaderboardData} />
      )}

      {/* 5) When the game is over: show GameOver */}
      {joined && gameOverData !== null && (
        <GameOver standings={gameOverData} />
      )}
    </div>
  );
}

export default App;
