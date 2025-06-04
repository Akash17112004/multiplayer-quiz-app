// client/src/components/GameOver.jsx
import React from 'react';
import '../index.css';

export default function GameOver({ standings }) {
  return (
    <div className="container">
      <div className="gameover-card">
        <h2>Game Over!</h2>
        <h3>Final Standings:</h3>
        <ol>
          {standings.map((p, i) => (
            <li key={i}>{p.name}: {p.score} pts</li>
          ))}
        </ol>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    </div>
  );
}
