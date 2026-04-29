import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
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

    try {
      const user = await loginUser(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      setError('');
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">FinanciallyFit</h1>
        <p className="login-subtitle">Welcome back! Please login to your account.</p>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="login-switch">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')}>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;