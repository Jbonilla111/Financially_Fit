import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

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
      await registerUser(name, email, password);
      const user = await loginUser(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      setError('');
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

        <form className="signup-form" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="John Smith"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="example@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <p className="signup-switch">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;