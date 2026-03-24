import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaPiggyBank, FaCreditCard, FaUmbrella, FaChartLine } from 'react-icons/fa';
import './CourseLanding.css';

function CourseLanding() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  
  const courses = {
    'life-insurance': {
      title: 'Foundations of Life Insurance',
      hours: '16 Hours',
      icon: FaUmbrella,
      description: 'Learn the foundations of life insurance, policies, and benefits.'
    },
    'retirement': {
      title: 'Retirement Planning',
      hours: '16 Hours',
      icon: FaPiggyBank,
      description: 'Plan your retirement effectively and secure your future.'
    },
    'debt': {
      title: 'Debt Management',
      hours: '16 Hours',
      icon: FaCreditCard,
      description: 'Manage and reduce your debt strategically.'
    },
    'emergency-fund': {
      title: 'Emergency Fund Building',
      hours: '23 Hours',
      icon: FaBook,
      description: 'Build a strong emergency fund to cover unexpected expenses.'
    },
    'investment': {
      title: 'Investment Basics',
      hours: '20 Hours',
      icon: FaChartLine,
      description: 'Learn the basics of investing and growing your wealth.'
    }
  };

  const course = courses[courseId];

  if (!course) {
    return <p style={{ padding: '2rem' }}>Course not found.</p>;
  }

  const Icon = course.icon;

  return (
    <div className="course-landing-page">
      <div className="course-landing-card">
        <Icon size={50} className="course-landing-icon" />
        <h1 className="course-landing-title">{course.title}</h1>
        <p className="course-landing-hours">{course.hours}</p>
        <p className="course-landing-description">{course.description}</p>
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