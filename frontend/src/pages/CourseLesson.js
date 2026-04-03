import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, completeLessonProgress } from "../api";
import "./FoundationsLifeLessons.css";

function CourseLesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State for fetched data
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for lesson progress
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [moduleStartedAt, setModuleStartedAt] = useState(Date.now());

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson content.");
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    setModuleStartedAt(Date.now());
  }, [currentModuleIndex]);

  if (loading) return <div style={{textAlign: "center", padding: "50px"}}>Loading lesson...</div>;
  if (error || !course) return <div style={{textAlign: "center", padding: "50px", color: "red"}}>{error}</div>;

  const modules = course.titles || [];

  if (modules.length === 0) {
    return (
      <div className="lessons-container">
        <h1>{course.name}</h1>
        <div className="module-card">
          <p>No content available for this course yet.</p>
          <button style={{marginTop: "20px", padding: "10px 20px", cursor: "pointer"}} onClick={() => navigate(`/courses/${courseId}`)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];

  const getLoggedInUserId = () => {
    const userStr = localStorage.getItem("user");
    const localUser = userStr ? JSON.parse(userStr) : null;
    return localUser?.id;
  };

  const markCurrentLessonComplete = async () => {
    const userId = getLoggedInUserId();
    if (!userId || !currentModule?.id) {
      return;
    }

    const elapsedSeconds = Math.max(30, Math.round((Date.now() - moduleStartedAt) / 1000));

    try {
      const progress = await completeLessonProgress(userId, {
        course_id: Number(courseId),
        title_id: currentModule.id,
        time_spent_seconds: elapsedSeconds,
      });

      window.dispatchEvent(new CustomEvent("ff-progress-updated", { detail: progress }));
    } catch (err) {
      console.error("Failed to save lesson progress", err);
    }
  };

  // Handle quiz selection
  const handleQuizAnswer = (questionId, option) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const nextModule = async () => {
    await markCurrentLessonComplete();

    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      alert("Congratulations! You've finished the course.");
      navigate("/courses");
    }
  };

  const goPrev = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="lessons-container">
      <h1>{course.name}</h1>
      <div className="module-card">
        <div className="module-header">
          <h2>{currentModule.name}</h2>
          <span>Lesson {currentModuleIndex + 1} of {modules.length}</span>
        </div>
        
        <ul>
          {currentModule.contents?.length > 0 ? (
            currentModule.contents.map((content) => (
              <li key={content.id}>{content.text_body}</li>
            ))
          ) : (
            <p>No text content provided for this module.</p>
          )}
        </ul>

        {/* Quizzes */}
        {currentModule.questions?.map((q) => {
          let options = [];
          if (q.options) {
            try {
              options = JSON.parse(q.options);
            } catch (e) {
              console.error("Failed to parse options", e);
            }
          }

          return (
            <div key={q.id} className="quiz-section">
              <p><strong>Quiz:</strong> {q.question_text}</p>
              {options.length > 0 ? (
                options.map((opt, i) => (
                  <button
                    key={i}
                    className={quizAnswers[q.id] === opt ? "selected" : ""}
                    onClick={() => handleQuizAnswer(q.id, opt)}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <button
                  className="selected"
                  onClick={() => handleQuizAnswer(q.id, q.answer_text)}
                >
                  Reveal Answer
                </button>
              )}
              
              {quizAnswers[q.id] && (
                <p>
                  {quizAnswers[q.id] === q.answer_text
                    ? "✅ Correct!"
                    : `❌ Incorrect. Correct answer: ${q.answer_text}`}
                </p>
              )}
            </div>
          );
        })}

        <div className="module-nav">
          <button onClick={goPrev} disabled={currentModuleIndex === 0}>← Previous Module</button>
          <button onClick={nextModule}>
            {currentModuleIndex === modules.length - 1 ? "Finish Course ✓" : "Next Module →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseLesson;
