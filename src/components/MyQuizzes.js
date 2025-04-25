import React, { useState, useEffect } from 'react';
import '../styles/MyQuizzes.css';
import ExcelQuiz from './ExcelQuiz'; // Add this import

const MyQuizzes = ({ onNavigate }) => {
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentView, setCurrentView] = useState('quiz-list'); // Add this state
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Add this state

  useEffect(() => {
    // Load quizzes from local storage when the component mounts
    const storedQuizzes = localStorage.getItem('customQuizzes');
    if (storedQuizzes) {
      try {
        const quizzes = JSON.parse(storedQuizzes);
        console.log("Loaded quizzes:", quizzes); // Debugging: Log loaded quizzes
        quizzes.forEach((quiz, index) => {
          console.log(`Quiz ${index} questions:`, quiz.questions); // Debugging: Log each quiz's questions
        });
        // Ensure each quiz has a questions array
        const quizzesWithQuestions = quizzes.map(quiz => ({
          ...quiz,
          questions: quiz.questions || [] // Default to an empty array if questions are missing
        }));
        setCustomQuizzes(quizzesWithQuestions);
      } catch (error) {
        console.error("Error parsing custom quizzes from local storage:", error);
        localStorage.removeItem('customQuizzes');
      }
    }
  }, []);

  const handleStartCustomQuiz = (quizId) => {
    console.log("Starting custom quiz with ID:", quizId);
    const quiz = customQuizzes.find(q => q.id === quizId);
    console.log("Found quiz:", quiz);
    
    if (quiz) {
      if (quiz.type === 'drag-and-drop') {
        // Handle drag and drop quiz type
        if (quiz.quizData && quiz.quizData.items && quiz.quizData.columns) {
          setSelectedQuiz(quiz);
          setCurrentView('taking-quiz');
        } else {
          alert('Quiz data is not properly formatted.');
        }
      } else {
        // Handle traditional quiz type
        if (quiz.questions && quiz.questions.length > 0) {
          const formattedQuestions = quiz.questions.map((q, index) => ({
            id: index + 1,
            question: q.text || q.question || q.content,
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: q.correctAnswer || q.answer
          }));
          setSelectedQuiz({...quiz, questions: formattedQuestions});
          setCurrentView('taking-quiz');
        } else {
          alert('Quiz not found or has no questions.');
        }
      }
    } else {
      alert('Quiz not found.');
    }
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
  };

  const handlePreviewQuiz = (quiz) => {
    setPreviewQuiz(quiz);
    setIsPreviewing(true);
  };

  const handleClosePreview = () => {
    setIsPreviewing(false);
    setPreviewQuiz(null);
  };

  return (
    <div className="my-quizzes-container">
      <h1 className="my-quizzes-title">My Quizzes</h1>

      {currentView === 'taking-quiz' && selectedQuiz ? (
        <ExcelQuiz 
          quizData={selectedQuiz.type === 'drag-and-drop' ? selectedQuiz.quizData : selectedQuiz.questions}
          quizType={selectedQuiz.type}
          onComplete={(score) => {
            setCurrentView('quiz-list');
            setSelectedQuiz(null);
          }}
        />
      ) : (
        <>
          {activeQuiz ? (
            <div className="quiz-taking-view">
              <h2>{activeQuiz.title}</h2>
              {/* Render quiz questions and options here */}
              {activeQuiz.questions && activeQuiz.questions.length > 0 ? (
                <ul className="quiz-questions-list">
                  {activeQuiz.questions.map((question, index) => (
                    <li key={index} className="quiz-question-item">
                      <p>{question.text}</p>
                      <ul className="quiz-options-list">
                        {question.options.map((option, idx) => (
                          <li key={idx} className="quiz-option-item">
                            <input type="radio" name={`question-${index}`} value={option} />
                            <label>{option}</label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No questions available for this quiz.</p>
              )}
              <button onClick={handleCloseQuiz}>End Quiz</button>
            </div>
          ) : (
            <>
              {customQuizzes.length > 0 ? (
                <ul className="quiz-list">
                  {customQuizzes.map((quiz) => (
                    <li key={quiz.id} className="quiz-list-item">
                      <span className="quiz-title">{quiz.title || 'Untitled Quiz'}</span>
                      <span className="quiz-category">Category: {quiz.category || 'N/A'}</span>
                      <div className="quiz-actions">
                        <button
                          className="preview-button"
                          onClick={() => handlePreviewQuiz(quiz)}
                        >
                          Preview
                        </button>
                        <button
                          className="start-custom-quiz-button"
                          onClick={() => handleStartCustomQuiz(quiz.id)}
                        >
                          Start This Quiz
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-quizzes-message">You haven't created any quizzes yet.</p>
              )}
            </>
          )}
        </> // Add this closing tag
      )}

      {isPreviewing && previewQuiz && (
        <div className="preview-modal-backdrop" onClick={handleClosePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="preview-title">Quiz Preview</h2>
            <p><strong>Title:</strong> {previewQuiz.title || 'Untitled Quiz'}</p>
            <p><strong>Category:</strong> {previewQuiz.category || 'N/A'}</p>
            <p><strong>Type:</strong> {previewQuiz.type || 'N/A'}</p>

            <div className="preview-questions-section">
              {previewQuiz.quizData && previewQuiz.quizData.items && previewQuiz.quizData.columns ? (
                <>
                  <h3 className="preview-subtitle">Items (Draggable):</h3>
                  {Object.keys(previewQuiz.quizData.items).length > 0 ? (
                    <ul className="preview-data-list">
                      {Object.values(previewQuiz.quizData.items).map(item => (
                        <li key={item.id} className="preview-data-item">
                          {item.content || 'No content'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items found.</p>
                  )}

                  <h3 className="preview-subtitle">Columns (Drop Targets):</h3>
                  {Object.keys(previewQuiz.quizData.columns).length > 0 ? (
                    <ul className="preview-data-list">
                      {Object.values(previewQuiz.quizData.columns).map(column => (
                        <li key={column.id} className="preview-data-item">
                          <strong>{column.title || 'No title'}:</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No columns found.</p>
                  )}
                </>
              ) : (
                <p>Quiz data structure not recognized for preview.</p>
              )}
            </div>

            <button className="preview-modal-close-button" onClick={handleClosePreview}>
              Close
            </button>
          </div>
        </div>
      )}

      <button className="back-button" onClick={() => onNavigate('start')}>
        Back to Start
      </button>
    </div>
  );
};

export default MyQuizzes;