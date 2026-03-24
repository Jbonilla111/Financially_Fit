import React from 'react';
import './WelcomeBanner.css';
import { useUser } from '../context/UserContext';

function WelcomeBanner() {
  const { user } = useUser();
  const progressPercent = Math.min((user.minutesLearned / user.goalMinutes) * 100, 100);

  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        <h2>Hi, {user.name}</h2>
        <p>Let's start learning</p>
      </div>
      <div className="progress-box">
        <p className="progress-label">Learned today</p>
        <p className="progress-time">
          <span className="time-bold">{user.minutesLearned}min</span> / {user.goalMinutes} min
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;