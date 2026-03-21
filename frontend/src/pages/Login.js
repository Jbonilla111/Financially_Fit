import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
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
    // TODO: connect to backend api.js
    setError('');
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">FinanciallyFit</h1>
        <p className="login-subtitle">Welcome back! Please login to your account.</p>

        {error && <p className="login-error">{error}</p>}

        <div className="login-form">
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
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <p className="login-switch">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;