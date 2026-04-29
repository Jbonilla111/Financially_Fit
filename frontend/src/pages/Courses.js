import React, { useState, useEffect } from 'react';
import './Courses.css';
import CourseCard from '../components/CourseCard';
// Keep icons for mapping dynamically
import { FaBook, FaPiggyBank, FaCreditCard, FaUmbrella, FaChartLine } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; 
import { getCourses } from '../api'; // Import new API function

const iconMap = {
  life_insurance: FaUmbrella,
  retirement_planning: FaPiggyBank,
  debt_management: FaCreditCard,
  emergency_fund_building: FaBook,
  investment_basics: FaChartLine,
};

// A simple dictionary to fetch a random or associated icon based on course keyword
const getIconForCourse = (courseName) => {
  const lowerName = courseName.toLowerCase();
  if (lowerName.includes('insurance')) return FaUmbrella;
  if (lowerName.includes('retirement')) return FaPiggyBank;
  if (lowerName.includes('debt')) return FaCreditCard;
  if (lowerName.includes('invest')) return FaChartLine;
  return FaBook; // Default icon
};

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // State for DB courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from backend API on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data); // Expecting array of {id, name, description, ...}
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load courses.');
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, []);

  if (loading) return <div className="courses-page"><p style={{padding: '2rem'}}>Loading courses...</p></div>;
  if (error) return <div className="courses-page"><p style={{padding: '2rem', color: 'red'}}>{error}</p></div>;

  return (
    <div className="courses-page">
      <div className="courses-container">
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            background: '#3b3f8c',
            color: 'white',
            fontWeight: 600,
          }}
        >
          ← Back to Home
        </button>
        <h1 className="courses-title">Courses</h1>
        <p className="courses-subtitle">Choose a course and start your financial literacy journey today!</p>

        <div className="courses-grid">
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map((course) => {
              const Icon = iconMap[course.module_key] || getIconForCourse(course.name);

              return (
                <Link
                  to={`/courses/${course.id}`}
                  key={course.id}
                  style={{ textDecoration: 'none' }}
                >
                  <CourseCard
                    title={course.name}
                    hours={course.estimated_completion_time || 'Self-paced'}
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