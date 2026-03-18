import React from 'react';
import './WelcomeBanner.css';

function WelcomeBanner() {
  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        <h2>Hi, Kristin</h2>
        <p>Let's start learning</p>
      </div>
      <div className="progress-box">
        <p className="progress-label">Learned today</p>
        <p className="progress-time"><span className="time-bold">46min</span> / 60 min</p>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;