import React, { useState } from 'react';
import './QuizModal.css';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    question: 'What is your age range?',
    options: ['18-25', '26-35', '36-50', '50+'],
    key: 'age',
  },
  {
    question: 'What is your main financial goal?',
    options: ['Save money', 'Pay off debt', 'Start investing', 'Learn about insurance'],
    key: 'goal',
  },
  {
    question: 'What is your current financial situation?',
    options: ['Just starting out', 'Some savings', 'Currently in debt', 'Financially stable'],
    key: 'situation',
  },
  {
    question: 'What topics interest you most?',
    options: ['Budgeting', 'Investing', 'Insurance', 'Retirement'],
    key: 'topics',
  },
  {
    question: 'How much do you know about personal finance?',
    options: ['Beginner', 'Some knowledge', 'Intermediate', 'Advanced'],
    key: 'knowledge',
  },
];

const getRecommendations = (answers) => {
  const recommendations = [];

  if (answers.goal === 'Save money' || answers.situation === 'Just starting out') {
    recommendations.push({ type: 'Resource', name: 'The 50/30/20 Budget Rule' });
    recommendations.push({ type: 'Resource', name: 'How to Build an Emergency Fund' });
  }
  if (answers.goal === 'Pay off debt' || answers.situation === 'Currently in debt') {
    recommendations.push({ type: 'Resource', name: 'How to Get Out of Debt' });
    recommendations.push({ type: 'Course', name: 'Debt Management' });
  }
  if (answers.goal === 'Start investing' || answers.topics === 'Investing') {
    recommendations.push({ type: 'Resource', name: 'Investing 101' });
    recommendations.push({ type: 'Course', name: 'Investment Basics' });
  }
  if (answers.goal === 'Learn about insurance' || answers.topics === 'Insurance') {
    recommendations.push({ type: 'Resource', name: 'Life Insurance Explained' });
    recommendations.push({ type: 'Course', name: 'Life Insurance' });
  }
  if (answers.topics === 'Retirement') {
    recommendations.push({ type: 'Resource', name: 'Retirement Planning Basics' });
    recommendations.push({ type: 'Course', name: 'Retirement Planning' });
  }
  if (answers.topics === 'Budgeting') {
    recommendations.push({ type: 'Resource', name: 'What is Budgeting?' });
  }
  if (answers.knowledge === 'Beginner') {
    recommendations.push({ type: 'Resource', name: 'Understanding Credit Scores' });
    recommendations.push({ type: 'Resource', name: 'Introduction to Compound Interest' });
  }

  return recommendations.slice(0, 4);
};

function QuizModal({ onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentQuestion = questions[currentStep];
  const recommendations = getRecommendations(answers);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {!showResults ? (
          <>
            <div className="modal-progress">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
                />
              ))}
            </div>

            <h2 className="modal-question">{currentQuestion.question}</h2>
            <p className="modal-step">Question {currentStep + 1} of {questions.length}</p>

            <div className="modal-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${answers[currentQuestion.key] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(currentQuestion.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="modal-nav">
              {currentStep > 0 && (
                <button className="nav-btn back" onClick={handleBack}>Back</button>
              )}
              <button
                className="nav-btn next"
                onClick={handleNext}
                disabled={!answers[currentQuestion.key]}
              >
                {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="modal-results-title">Your Personalized Recommendations</h2>
            <p className="modal-results-subtitle">
              Based on your answers, here's what we recommend for you!
            </p>
            <div className="recommendations">
              {recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <span className={`rec-type ${rec.type.toLowerCase()}`}>{rec.type}</span>
                  <p>{rec.name}</p>
                </div>
              ))}
            </div>
            <button className="nav-btn next" onClick={() => { onClose(); navigate('/courses'); }}>
              Go Explore!
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizModal;