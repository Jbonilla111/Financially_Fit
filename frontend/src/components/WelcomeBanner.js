import React from 'react';
import './WelcomeBanner.css';
import { useUser } from '../context/UserContext';

function WelcomeBanner({ minutesLearned = 46, goalMinutes = 60 }) {
  const { user: contextUser } = useUser();
  const userStr = localStorage.getItem('user');
  const localUser = userStr ? JSON.parse(userStr) : null;
  
  const userName = localUser ? localUser.username : (contextUser?.name || 'Learner');
  const displayMinutes = contextUser?.minutesLearned || minutesLearned;
  const displayGoal = contextUser?.goalMinutes || goalMinutes;

  const progressPercent = Math.min((displayMinutes / (displayGoal || 1)) * 100, 100);

  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        <h2>Hi, {userName}</h2>
        <p>Let's start learning</p>
      </div>
      <div className="progress-box">
        <p className="progress-label">Learned today</p>
        <p className="progress-time">
          <span className="time-bold">{displayMinutes}min</span> / {displayGoal} min
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;