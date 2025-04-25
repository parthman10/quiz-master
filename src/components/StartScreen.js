import React from 'react';
import '../styles/StartScreen.css';

const StartScreen = ({ onNavigate }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="app-title">Quiz Master</h1>
        <p className="app-subtitle">Test your knowledge with fun quizzes!</p>

        <div className="button-container">
          <button
            className="start-button primary-button"
            onClick={() => onNavigate('quiz')}
          >
            Start Quiz
          </button>

          <button
            className="leaderboard-button secondary-button"
            onClick={() => onNavigate('leaderboard')}
          >
            Leaderboard
          </button>

          <button
            className="create-button secondary-button"
            onClick={() => onNavigate('create')}
          >
            Create Quiz
          </button>

          {/* Add the new "My Quizzes" button */}
          <button
            className="my-quizzes-button secondary-button" // You might want to add specific styles for this
            onClick={() => onNavigate('my-quizzes')} // Navigate to a new 'my-quizzes' section
          >
            My Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;