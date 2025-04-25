import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import '../styles/ExcelQuiz.css';

const ExcelQuiz = ({ quizData, quizType, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris'
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars'
    }
  ];

  const playSound = (type) => {
    try {
      const soundFile = type === 'correct' ? '2870-preview.mp3' : 'wrong-47985.mp3';
      const audio = new Audio(window.location.origin + `/sounds/${soundFile}`);
      audio.volume = 0.5;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Sound playback failed:', error);
        });
      }
    } catch (err) {
      console.log('Sound creation failed:', err);
    }
  };

  const handleAnswerSelect = useCallback((selectedOption) => {
    setSelectedAnswer(selectedOption);
    setShowFeedback(true);
    
    const currentQuestion = quizType === 'drag-and-drop' 
      ? questions[currentQuestionIndex]
      : quizData[currentQuestionIndex];
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      playSound('incorrect');
    }

    setQuizHistory(prev => [...prev, {
      question: currentQuestion.question,
      selectedAnswer: selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);

    setTimeout(() => {
      const totalQuestions = quizType === 'drag-and-drop' ? questions.length : quizData.length;
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(30);
      } else {
        setIsComplete(true);
        onComplete && onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  }, [currentQuestionIndex, quizType, questions, quizData, score, onComplete]);

  useEffect(() => {
    if (!isComplete && !showFeedback) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAnswerSelect(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, showFeedback, isComplete, handleAnswerSelect]);

  if (quizType === 'drag-and-drop') {
    return (
      <div className="quiz-taking-view">
        <div className="quiz-timer">
          Time Left: {timeLeft}s
        </div>
        <h2 className="quiz-title">Drag and Drop Quiz</h2>
        <div className="quiz-progress">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="quiz-question-container">
          <div className="quiz-questions-list">
            <div className="quiz-question-item">
              <h2>{questions[currentQuestionIndex].question}</h2>
              <div className="quiz-options-list">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`quiz-option-button ${
                      showFeedback && selectedAnswer === option
                        ? option === questions[currentQuestionIndex].correctAnswer
                          ? 'quiz-option-correct'
                          : 'quiz-option-incorrect'
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showFeedback && (
                <div className={`quiz-feedback ${
                  selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 'correct' : 'incorrect'
                }`}>
                  {selectedAnswer === questions[currentQuestionIndex].correctAnswer 
                    ? 'Great job!' 
                    : 'Try again!'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  if (isComplete) {
    const finalScore = score;
    const percentage = ((finalScore / quizData.length) * 100).toFixed(1);

    return (
      <div className="quiz-results">
        <h2 className="quiz-score">Quiz Complete!</h2>
        <div className="quiz-score">
          Score: {finalScore} out of {quizData.length} ({percentage}%)
        </div>
        <div className="quiz-summary">
          {quizHistory.map((item, index) => (
            <div 
              key={index} 
              className={`quiz-summary-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <h3>Question {index + 1}</h3>
              <p>{item.question}</p>
              <p>Your answer: {item.selectedAnswer}</p>
              {!item.isCorrect && (
                <p>Correct answer: {item.correctAnswer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-taking-view">
      <div className="quiz-timer">
        Time Left: {timeLeft}s
      </div>
      <div className="quiz-progress">
        <span>Question {currentQuestionIndex + 1} of {quizData.length}</span>
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="quiz-question-item">
        <h2>{currentQuestion.question}</h2>
        <div className="quiz-options-list">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option-button ${
                showFeedback && selectedAnswer === option
                  ? option === currentQuestion.correctAnswer
                    ? 'quiz-option-correct'
                    : 'quiz-option-incorrect shake'  // Make sure 'shake' is added here
                  : ''
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>
        {showFeedback && (
          <div className={`quiz-feedback ${
            selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'
          }`}>
            {selectedAnswer === currentQuestion.correctAnswer 
              ? 'Great job!' 
              : 'Try again!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelQuiz;