import React from 'react';
import './WelcomeBanner.css';

function WelcomeBanner({ minutesLearned = 46, goalMinutes = 60 }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user ? user.username : 'Learner';

  const progressPercent = Math.min((minutesLearned / goalMinutes) * 100, 100);

  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        <h2>Hi, {userName}</h2>
        <p>Let's start learning</p>
      </div>
      <div className="progress-box">
        <p className="progress-label">Learned today</p>
        <p className="progress-time">
          <span className="time-bold">{minutesLearned}min</span> / {goalMinutes} min
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;