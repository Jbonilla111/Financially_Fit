import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CoursePlayer() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch course: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('course player data:', data);
        setCourseData(data);
      })
      .catch((err) => console.error('Course player fetch error:', err));
  }, [courseId]);

  if (!courseData) return <p>Loading course...</p>;

  const lessons = courseData.titles || [];
  const lesson = lessons[currentLesson];

  if (lessons.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>{courseData.name}</h1>
        <p>No lessons available yet.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{courseData.name}</h1>

      <h2>{lesson.name}</h2>

      <p><strong>Content type:</strong> {lesson.content_type || 'N/A'}</p>

      {lesson.contents && lesson.contents.length > 0 ? (
        lesson.contents.map((content) => (
          <p key={content.id}>{content.text_body}</p>
        ))
      ) : (
        <p>No lesson content available.</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <button
          disabled={currentLesson === 0}
          onClick={() => setCurrentLesson((prev) => prev - 1)}
        >
          Previous
        </button>

        <button
          disabled={currentLesson === lessons.length - 1}
          onClick={() => setCurrentLesson((prev) => prev + 1)}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CoursePlayer;