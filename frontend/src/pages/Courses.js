import React, { useState } from 'react';
import './Courses.css';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { FaBook, FaPiggyBank, FaCreditCard, FaUmbrella, FaChartLine } from 'react-icons/fa';

const allCourses = [
  { title: 'Foundations of Life Insurance', hours: '16 Hours', icon: FaUmbrella, category: 'Life Insurance' },
  { title: 'Retirement Planning', hours: '16 Hours', icon: FaPiggyBank, category: 'Retirement Planning' },
  { title: 'Debt Management', hours: '16 Hours', icon: FaCreditCard, category: 'Debt Management' },
  { title: 'Emergency Fund Building', hours: '23 Hours', icon: FaBook, category: 'Emergency Fund Building' },
  { title: 'Investment Basics', hours: '20 Hours', icon: FaChartLine, category: 'Investment Basics' },
];

const categories = ['All', 'Life Insurance', 'Retirement Planning', 'Debt Management', 'Emergency Fund Building', 'Investment Basics'];

function Courses() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? allCourses
    : allCourses.filter(c => c.category === activeCategory);

  return (
    <div className="courses-page">
      <Navbar />
      <div className="courses-container">
        <h1 className="courses-title">Courses</h1>
        <p className="courses-subtitle">Choose a course and start your financial literacy journey today!</p>

        <div className="courses-tabs">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`courses-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filtered.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              hours={course.hours}
              icon={course.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;