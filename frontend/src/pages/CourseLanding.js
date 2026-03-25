import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaUmbrella, FaPiggyBank, FaCreditCard, FaChartLine } from 'react-icons/fa';
import './FoundationsLifeInsurance.css'; // Let's just reuse the better CSS
import { getCourseById } from '../api';

const getIconForCourse = (courseName) => {
  const lowerName = courseName.toLowerCase();
  if (lowerName.includes('insurance')) return FaUmbrella;
  if (lowerName.includes('retirement')) return FaPiggyBank;
  if (lowerName.includes('debt')) return FaCreditCard;
  if (lowerName.includes('invest')) return FaChartLine;
  return FaBook;
};

function CourseLanding() {
  const { courseId } = useParams(); // Retrieves dynamic courseId from the URL path
  const navigate = useNavigate();

  // State to hold dynamic course data
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Course not found.');
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="foundation-page"><p style={{padding: '2rem'}}>Loading course...</p></div>;
  if (error || !course) return <div className="foundation-page"><p style={{padding: '2rem', color: 'red'}}>{error}</p></div>;

  const Icon = getIconForCourse(course.name);

  return (
    <div className="foundation-page">
      <div className="foundation-card">
        <Icon className="foundation-icon" size={60} />
        <h1 className="foundation-title">{course.name}</h1>
        <p className="foundation-duration">Self-paced | Beginner Level</p>
        <p className="foundation-description">
          {course.description || "Start learning the principles and foundations today!"}
        </p>

        <button
          className="start-course-btn"
          onClick={() => navigate(`/courses/${courseId}/start`)}
        >
          Start Course
        </button>

        <button
          className="start-course-btn"
          style={{ backgroundColor: 'white', color: '#3b3f8c', border: '1px solid #3b3f8c', marginLeft: '10px' }}
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </button>

        <h2 className="modules-heading">Modules</h2>
        <div className="modules-list">
          {/* Map directly through 'titles' which act as modules in the DB */}
          {course.titles && course.titles.map((title, index) => (
            <div key={title.id} className="module-item">
              <div 
                className="module-header" 
                onClick={() => setExpandedModule(expandedModule === index ? null : index)}
              >
                <span>{title.name}</span>
                <span>v</span> {/* Could use dropdown chevron */}
              </div>
              
              {/* Show the actual content under this module */}
              {expandedModule === index && (
                <div className="module-content">
                  {title.contents && title.contents.length > 0 ? (
                    title.contents.map((content) => (
                      <p key={content.id} style={{marginBottom: '10px'}}>{content.text_body}</p>
                    ))
                  ) : (
                    <p>No extra details provided.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseLanding;