import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const user = await registerUser(name, email, password);
      // Save user to local storage for fake auth session
      localStorage.setItem('user', JSON.stringify(user));
      setError('');
      // Force reload to re-evaluate localStorage in App.js
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-logo">FinanciallyFit</h1>
        <p className="signup-subtitle">Create an account to get started!</p>

        {error && <p className="signup-error">{error}</p>}

        <div className="signup-form">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <button className="signup-btn" onClick={handleSignUp}>
            Sign Up
          </button>

          <p className="signup-switch">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;