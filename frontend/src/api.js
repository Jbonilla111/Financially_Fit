export const API_URL = 'http://localhost:8000'; 

// Fetch all available courses from the database
export const getCourses = async () => {
  const response = await fetch(`${API_URL}/courses/`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};

// Fetch a single course by its ID, including its modules/titles and questions
export const getCourseById = async (courseId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch course ID: ${courseId}`);
  }
  return response.json();
};

export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  return response.json();
};

export const registerUser = async (username, email, password) => {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const response = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: normalizedUsername, email: normalizedEmail, password: normalizedPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }
  return response.json();
};

export const completeLessonProgress = async (userId, payload) => {
  const response = await fetch(`${API_URL}/users/${userId}/progress/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to record lesson progress');
  }

  return response.json();
};

export const getUserProgressSummary = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/progress/summary`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch progress summary');
  }
  return response.json();
};
