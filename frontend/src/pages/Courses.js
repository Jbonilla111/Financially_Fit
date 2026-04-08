import React, { useEffect, useState } from 'react';
import './Courses.css';
import CourseCard from '../components/CourseCard';
import { FaBook, FaPiggyBank, FaCreditCard, FaUmbrella, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const iconMap = {
  life_insurance: FaUmbrella,
  retirement_planning: FaPiggyBank,
  debt_management: FaCreditCard,
  emergency_fund_building: FaBook,
  investment_basics: FaChartLine
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // real API endpoint
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', ...new Set(courses.map(c => c.category || 'General'))];

  const filtered =
    activeCategory === 'All'
      ? courses
      : courses.filter(c => c.category === activeCategory);

  return (
    <div className="courses-page">
      <div className="courses-container">
        <h1 className="courses-title">Courses</h1>

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
          {filtered.map((course) => {
            const Icon = iconMap[course.id] || FaBook;

            return (
              <Link
                to={`/courses/${course.id}`}
                key={course.id}
                style={{ textDecoration: 'none' }}
              >
                <CourseCard
                  title={course.title}
                  hours={course.estimated_completion_time}
                  icon={Icon}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Courses;