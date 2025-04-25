import React, { useState, useEffect, useCallback } from 'react';
import { addLeaderboardEntry, getTopLeaderboardEntries } from '../services/leaderboardService';
import '../styles/Leaderboard.css';

const LeaderboardComponent = ({ score, playerName, onNavigate }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [username, setUsername] = useState(playerName || '');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const entries = await getTopLeaderboardEntries();
        setLeaderboardData(entries);
        setLoading(false);
        
        // Show name input if there's a new score
        if (score > 0) {
          setShowNameInput(true);
        }
      } catch (err) {
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [score]);

  const handleSaveScore = useCallback(async () => {
    if (username.trim()) {
      try {
        setLoading(true);
        const totalQuestions = 5;
        const percentageScore = Math.round((score / totalQuestions) * 100);

        await addLeaderboardEntry({
          playerName: username.trim(),
          score: percentageScore,
          timeTaken: 0,
          quizId: 'default'
        });

        const entries = await getTopLeaderboardEntries();
        setLeaderboardData(entries);
        setShowNameInput(false);
        setLoading(false);
      } catch (err) {
        setError('Failed to save score');
        setLoading(false);
      }
    } else {
      alert('Please enter your name before saving your score!');
    }
  }, [username, score]);

  if (loading) return <div className="leaderboard-loading">Loading...</div>;
  if (error) return <div className="leaderboard-error">{error}</div>;

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      
      {showNameInput && (
        <div className="username-input-container">
          <p>Congratulations on your score of {score}! Please enter your name:</p>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="username-input"
            />
            <button onClick={handleSaveScore} className="save-button">Save Score</button>
          </div>
        </div>
      )}

      <div className="scores-table">
        <div className="table-header">
          <div className="rank-cell">Rank</div>
          <div className="name-cell">Name</div>
          <div className="score-cell">Score</div>
          <div className="date-cell">Date</div>
        </div>
        
        {leaderboardData.map((entry, index) => (
          <div key={entry.id} className={`table-row ${index === 0 ? 'top-score' : ''}`}>
            <div className="rank-cell">{index + 1}</div>
            <div className="name-cell" style={{ 
              color: '#000000',
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '0 10px'
            }}>{entry.playerName}</div>
            <div className="score-cell">{entry.score}%</div>
            <div className="date-cell">
              {new Date(entry.timestamp?.toDate()).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="leaderboard-buttons">
        <button 
          className="play-again-button"
          onClick={() => onNavigate('quiz')}
        >
          Play Again
        </button>
        
        <button 
          className="home-button"
          onClick={() => onNavigate('start')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

const Leaderboard = React.memo(LeaderboardComponent);

export default Leaderboard;