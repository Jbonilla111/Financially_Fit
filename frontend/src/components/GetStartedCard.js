import React from 'react';
import './GetStartedCard.css';

function GetStartedCard() {
  return (
    <div className="get-started-card">
      <div className="get-started-text">
        <h2>What do you want to learn today?</h2>
        <button className="get-started-btn">Get Started</button>
      </div>
      <div className="get-started-image">👨‍💼</div>
    </div>
  );
}

export default GetStartedCard;