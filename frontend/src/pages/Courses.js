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
    fetch('http://localhost:8000/courses')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch courses: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('courses data:', data);
        setCourses(data);
      })
      .catch((err) => console.error('Courses fetch error:', err));
  }, []);

  const categories = ['All'];

  const filtered =
    activeCategory === 'All'
      ? courses
      : courses;

  return (
    <div className="courses-page">
      <div className="courses-container">
        <h1 className="courses-name">Courses</h1>

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
          {filtered.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            filtered.map((course) => {
              const Icon = iconMap[course.module_key] || FaBook;

              return (
                <Link
                  to={`/courses/${course.id}`}
                  key={course.id}
                  style={{ textDecoration: 'none' }}
                >
                  <CourseCard
                    title={course.name}
                    hours={course.estimated_completion_time || 'Coming soon'}
                    icon={Icon}
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;