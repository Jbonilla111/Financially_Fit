import React from 'react';
import './LearningPlan.css';

const courses = [
  { name: 'Life Insurance', progress: '40/48' },
  { name: 'Retirement Planning', progress: '40/48' },
  { name: 'Emergency Fun Planning', progress: '40/48' },
  { name: 'Debt Management', progress: '40/48' },
  { name: 'Investment Basics', progress: '40/48' },
];

function LearningPlan() {
  return (
    <div className="learning-plan">
      <h2>Learning Plan</h2>
      <ul className="course-list">
        {courses.map((course, index) => (
          <li key={index} className="course-item">
            <span className="course-icon">◐</span>
            <span className="course-name">{course.name}</span>
            <span className="course-progress">{course.progress}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LearningPlan;