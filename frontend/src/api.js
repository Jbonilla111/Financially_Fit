export const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

const buildUrl = (path) => `${API_URL}${path}`;

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  const localUser = userStr ? JSON.parse(userStr) : null;
  const token = localUser?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiFetch = async (path, options = {}) => {
  const mergedHeaders = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    ...options,
    headers: mergedHeaders,
  });

  if (response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

export const getCurrentUser = async () => {
  const response = await apiFetch('/users/me');
  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }
  return response.json();
};

// Fetch all available courses from the database
export const getCourses = async () => {
  const response = await apiFetch('/courses/');
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};

// Fetch a single course by its ID, including its modules/titles and questions
export const getCourseById = async (courseId) => {
  const response = await apiFetch(`/courses/${courseId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch course ID: ${courseId}`);
  }
  return response.json();
};

export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const response = await apiFetch('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    let errorMsg = errorData.detail || 'Login failed';
    if (Array.isArray(errorData.detail)) {
      errorMsg = errorData.detail.map(e => `${e.loc ? e.loc[e.loc.length-1] + ': ' : ''}${e.msg}`).join(', ');
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

export const registerUser = async (username, email, password) => {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const response = await apiFetch('/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: normalizedUsername, email: normalizedEmail, password: normalizedPassword }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    let errorMsg = errorData.detail || 'Registration failed';
    if (Array.isArray(errorData.detail)) {
      errorMsg = errorData.detail.map(e => `${e.loc ? e.loc[e.loc.length-1] + ': ' : ''}${e.msg}`).join(', ');
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

export const completeLessonProgress = async (userId, payload) => {
  const response = await apiFetch(`/users/${userId}/progress/complete`, {
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
  const response = await apiFetch(`/users/${userId}/progress/summary`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch progress summary');
  }
  return response.json();
};

export const saveCalculation = async (userId, toolType, inputs) => {
  const response = await apiFetch(`/tools/${toolType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...inputs, user_id: userId }),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to save calculation', error);
    return null;
  }
  return response.json();
};

export const getCalculationHistory = async (userId) => {
  const response = await apiFetch(`/tools/${userId}/history`);
  if (!response.ok) {
    console.error('Failed to fetch calculation history');
    return [];
  }
  return response.json();
};
