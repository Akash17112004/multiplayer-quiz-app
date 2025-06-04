// client/src/components/QuestionScreen.jsx
import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import '../index.css';

export default function QuestionScreen({ question, pin }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setSelectedIdx(null);
    setLocked(false);
  }, [question]);

  if (!question) return <p>Loading...</p>;

  const handleChoose = idx => {
    if (locked) return;
    setSelectedIdx(idx);
    setLocked(true);
    socket.emit('submit-answer', {
      pin,
      questionId: question.id,
      selectedIndex: idx
    });
  };

  return (
    <div className="container">
      <div className="question-card">
        <h2>{question.text}</h2>
        <ul>
          {question.choices.map((choice, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleChoose(idx)}
                disabled={locked}
              >
                {choice}
              </button>
            </li>
          ))}
        </ul>
        {locked && <p>Answer submitted!</p>}
      </div>
    </div>
  );
}
