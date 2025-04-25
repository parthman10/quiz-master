import React, { useState } from 'react';

const StartScreen = ({ onNavigate, onPlayerNameSubmit }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleStartQuiz = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    onPlayerNameSubmit(playerName);
  };

  const handleBackToHome = () => {
    setPlayerName('');
    setError('');
    onNavigate('start');
  };

  return (
    <div className="start-screen">
      <h1>Quiz Master</h1>
      <p>Test your knowledge with fun quizzes!</p>
      
      <div className="player-name-input">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <button onClick={handleStartQuiz}>Start Quiz</button>
      <button onClick={() => onNavigate('leaderboard')}>Leaderboard</button>
      <button onClick={() => onNavigate('create')}>Create Quiz</button>
      <button onClick={() => onNavigate('my-quizzes')}>My Quizzes</button>
      <button onClick={handleBackToHome} className="back-button">Back to Home</button>
    </div>
  );
};

export default StartScreen;