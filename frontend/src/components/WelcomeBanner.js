import React, { useEffect, useState } from 'react';
import './WelcomeBanner.css';
import { useUser } from '../context/UserContext';
import { getUserProgressSummary } from '../api';

function WelcomeBanner({ minutesLearned = 46, goalMinutes = 60 }) {
  const { user: contextUser } = useUser();
  const userStr = localStorage.getItem('user');
  const localUser = userStr ? JSON.parse(userStr) : null;
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!localUser?.id) {
        return;
      }

      try {
        const summaryData = await getUserProgressSummary(localUser.id);
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to load progress summary', error);
      }
    };

    fetchSummary();
  }, [localUser?.id]);

  useEffect(() => {
    const handleProgressUpdate = () => {
      const refreshSummary = async () => {
        if (!localUser?.id) {
          return;
        }

        try {
          const summaryData = await getUserProgressSummary(localUser.id);
          setSummary(summaryData);
        } catch (error) {
          console.error('Failed to refresh progress summary', error);
        }
      };

      refreshSummary();
    };

    window.addEventListener('ff-progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('ff-progress-updated', handleProgressUpdate);
  }, [localUser?.id]);
  
  const userName = localUser ? localUser.username : (contextUser?.name || 'Learner');
  const displayMinutes = summary?.learned_today_minutes ?? contextUser?.minutesLearned ?? minutesLearned;
  const displayGoal = summary?.goal_minutes ?? contextUser?.goalMinutes ?? goalMinutes;

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