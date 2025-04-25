import React, { useState } from 'react';
import { addLeaderboardEntry } from '../services/leaderboardService';

const FirebaseTest = () => {
  const [status, setStatus] = useState('');

  const testFirebase = async () => {
    try {
      setStatus('Testing connection...');
      const docId = await addLeaderboardEntry({
        playerName: 'Test User',
        score: 100,
        timeTaken: 60,
        quizId: 'test-quiz'
      });
      setStatus(`Success! Document created with ID: ${docId}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Firebase Connection Test</h2>
      <button onClick={testFirebase}>Test Firebase Connection</button>
      <p>{status}</p>
    </div>
  );
};

export default FirebaseTest;