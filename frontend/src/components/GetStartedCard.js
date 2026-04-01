import React, { useState } from 'react';
import './GetStartedCard.css';
import QuizModal from './QuizModal';

function GetStartedCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="get-started-card">
        <div className="get-started-text">
          <h2>What do you want to learn today?</h2>
          <button className="get-started-btn" onClick={() => setShowModal(true)}>
            Get Started
          </button>
        </div>
        <div className="get-started-image">👨‍💼</div>
      </div>

      {showModal && <QuizModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default GetStartedCard;