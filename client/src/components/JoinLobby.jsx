// client/src/components/JoinLobby.jsx
import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import '../index.css'; // Make sure CSS is imported

export default function JoinLobby({ onJoin, joinedPin }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    socket.on('update-players', playerList => {
      setPlayers(playerList);
    });
    socket.on('you-are-host', () => {
      setIsHost(true);
    });
    socket.on('join-error', message => {
      setError(message);
      socket.disconnect();
    });
    socket.on('late-error', message => {
      setError(message);
      socket.disconnect();
    });
    socket.on('start-error', message => {
      setError(message);
    });
    return () => {
      socket.off('update-players');
      socket.off('you-are-host');
      socket.off('join-error');
      socket.off('late-error');
      socket.off('start-error');
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);
    const trimmedPin = pin.trim();
    socket.auth = { name };
    socket.connect();
    socket.emit('join-room', { pin: trimmedPin, name });
    onJoin(trimmedPin);
  };

  const handleStartGame = () => {
    const actualPin = joinedPin || pin.trim();
    socket.emit('start-game', actualPin);
  };

  return (
    <div className="container">
      <div className="join-card">
        {players.length === 0 ? (
          <>
            <h2>Join Lobby</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Game PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                required
              />
              <button type="submit">Join</button>
            </form>
            {error && <p className="error-text">{error}</p>}
          </>
        ) : (
          <div className="lobby-list">
            <h2>Lobby (PIN: {joinedPin || pin})</h2>
            <ul>
              {players.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
            {isHost && <button onClick={handleStartGame}>Start Game</button>}
            {error && <p className="error-text">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
