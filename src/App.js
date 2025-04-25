import React, { useState } from 'react';
import './App.css';
import './styles/mobile.css';  // Add this line
import QuizContainer from './components/QuizContainer';
import StartScreen from './components/StartScreen';
import Leaderboard from './components/Leaderboard';
import CreateQuiz from './components/CreateQuiz';
import MyQuizzes from './components/MyQuizzes';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [userScore, setUserScore] = useState(0);
  const [playerName, setPlayerName] = useState('');

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    if (screen === 'start') {
      // Reset states when going back to home
      setUserScore(0);
      setPlayerName('');
    }
  };

  return (
    <div className="App">
      {currentScreen === 'start' && (
        <StartScreen 
          onNavigate={navigateTo} 
          onPlayerNameSubmit={(name) => {
            setPlayerName(name);
            navigateTo('quiz');
          }}
        />
      )}
      {currentScreen === 'quiz' && (
        <QuizContainer
          playerName={playerName}
          onComplete={(score) => {
            setUserScore(score);
            navigateTo('leaderboard');
          }}
          onNavigate={navigateTo}
        />
      )}
      {currentScreen === 'leaderboard' && (
        <Leaderboard 
          playerName={playerName} 
          score={userScore} 
          onNavigate={navigateTo}
        />
      )}
      {currentScreen === 'create' && (
        <CreateQuiz onNavigate={navigateTo} />
      )}
      {currentScreen === 'my-quizzes' && (
        <MyQuizzes onNavigate={navigateTo} />
      )}
    </div>
  );
}

export default App;
