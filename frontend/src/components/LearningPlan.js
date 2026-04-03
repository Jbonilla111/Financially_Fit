import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearningPlan.css';
import { getCourses, getUserProgressSummary } from '../api';

function LearningPlan() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseProgressMap, setCourseProgressMap] = useState({});

  const getCourseProgress = (course) => {
    const progressLabel = courseProgressMap[course.id] || `0/${course.titles?.length || 0}`;
    const [completedStr = '0', totalStr = '0'] = progressLabel.split('/');
    const completedLessons = Number(completedStr);
    const totalLessons = Number(totalStr);

    return {
      progressLabel,
      completedLessons,
      totalLessons,
      isCompleted: totalLessons > 0 && completedLessons >= totalLessons,
    };
  };

  const completedCoursesCount = courses.reduce((count, course) => {
    const { isCompleted } = getCourseProgress(course);
    return isCompleted ? count + 1 : count;
  }, 0);

  useEffect(() => {
    const fetchLearningPlanData = async () => {
      try {
        const allCourses = await getCourses();
        setCourses(allCourses);

        const userStr = localStorage.getItem('user');
        const localUser = userStr ? JSON.parse(userStr) : null;

        if (localUser?.id) {
          const summary = await getUserProgressSummary(localUser.id);
          const progressMap = summary.courses.reduce((acc, courseSummary) => {
            acc[courseSummary.course_id] = `${courseSummary.completed_lessons}/${courseSummary.total_lessons}`;
            return acc;
          }, {});
          setCourseProgressMap(progressMap);
        }
      } catch (error) {
        console.error('Failed to load learning plan data', error);
      }
    };

    fetchLearningPlanData();
  }, []);

  useEffect(() => {
    const handleProgressUpdate = () => {
      const refreshProgress = async () => {
        try {
          const allCourses = await getCourses();
          setCourses(allCourses);

          const userStr = localStorage.getItem('user');
          const localUser = userStr ? JSON.parse(userStr) : null;

          if (localUser?.id) {
            const summary = await getUserProgressSummary(localUser.id);
            const progressMap = summary.courses.reduce((acc, courseSummary) => {
              acc[courseSummary.course_id] = `${courseSummary.completed_lessons}/${courseSummary.total_lessons}`;
              return acc;
            }, {});
            setCourseProgressMap(progressMap);
          }
        } catch (error) {
          console.error('Failed to refresh learning plan data', error);
        }
      };

      refreshProgress();
    };

    window.addEventListener('ff-progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('ff-progress-updated', handleProgressUpdate);
  }, []);

  return (
    <div className="learning-plan">
      <h2>Learning Plan</h2>
      {completedCoursesCount > 0 && (
        <p className="learning-plan-recognition">
          Completed courses: {completedCoursesCount}
        </p>
      )}
      <ul className="course-list">
        {courses.map((course) => {
          const { progressLabel, isCompleted } = getCourseProgress(course);

          return (
          <li
            key={course.id}
            className={`course-item ${isCompleted ? 'course-item-complete' : ''}`}
            onClick={() => navigate(`/courses/${course.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigate(`/courses/${course.id}`);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Open ${course.name}`}
          >
            <span className={`course-icon ${isCompleted ? 'course-icon-complete' : ''}`}>{isCompleted ? '✓' : '◐'}</span>
            <span className="course-name">{course.name}</span>
            {isCompleted && <span className="course-complete-badge">Completed</span>}
            <span className={`course-progress ${isCompleted ? 'course-progress-complete' : ''}`}>{progressLabel}</span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LearningPlan;