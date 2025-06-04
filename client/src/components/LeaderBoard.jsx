// client/src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import '../index.css';

export default function Leaderboard({ data }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  return (
    <div className="container">
      <div className="leaderboard-card">
        <h2>Leaderboard</h2>
        <ol>
          {data.map((p, i) => (
            <li key={i}>{p.name}: {p.score} pts</li>
          ))}
        </ol>
        <p>Next question in {countdown} seconds…</p>
      </div>
    </div>
  );
}
