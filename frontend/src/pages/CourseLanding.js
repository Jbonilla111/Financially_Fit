import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaPiggyBank, FaCreditCard, FaUmbrella, FaChartLine } from 'react-icons/fa';
import './CourseLanding.css';

const iconMap = {
  life_insurance: FaUmbrella,
  retirement_planning: FaPiggyBank,
  debt_management: FaCreditCard,
  emergency_fund_building: FaBook,
  investment_basics: FaChartLine
};

function CourseLanding() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    //  real endpoint
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [courseId]);

  if (!course) {
    return <p style={{ padding: '2rem' }}>Loading...</p>;
  }

  const Icon = iconMap[course.id] || FaBook;

  return (
    <div className="course-landing-page">
      <div className="course-landing-card">
        <Icon size={50} className="course-landing-icon" />

        <h1 className="course-landing-title">{course.title}</h1>

        <p className="course-landing-hours">
          {course.estimated_completion_time}
        </p>

        <p className="course-landing-description">
          {course.description}
        </p>

        {/* 🔥 NEW: Learning Objectives */}
        {course.learning_objectives && (
          <ul className="course-objectives">
            {course.learning_objectives.map((obj, index) => (
              <li key={index}>{obj}</li>
            ))}
          </ul>
        )}

        <button
          className="start-course-btn"
          onClick={() => navigate(`/courses/${courseId}/start`)}
        >
          Start Course
        </button>

        <button
          className="back-btn"
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
}

export default CourseLanding;