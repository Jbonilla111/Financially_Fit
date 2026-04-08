import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CoursePlayer() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourseData(data))
      .catch(err => console.error(err));
  }, [courseId]);

  if (!courseData) return <p>Loading course...</p>;

  const lessons = courseData.lessons || [];
  const lesson = lessons[currentLesson];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{courseData.module?.title}</h1>

      {/* Lesson Title */}
      <h2>{lesson.title}</h2>

      
      {lesson.content_type === 'text' && (
        <p>{lesson.content}</p>
      )}

      {lesson.content_type === 'interactive' && (
        <p>{lesson.content} (interactive coming soon)</p>
      )}

      {lesson.content_type === 'calculator' && (
        <div>
          <p>{lesson.content}</p>
          <button>Open Calculator</button>
        </div>
      )}

      
      <div style={{ marginTop: '20px' }}>
        <button
          disabled={currentLesson === 0}
          onClick={() => setCurrentLesson(prev => prev - 1)}
        >
          Previous
        </button>

        <button
          disabled={currentLesson === lessons.length - 1}
          onClick={() => setCurrentLesson(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CoursePlayer;