import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { FcCalculator, FcTodoList } from 'react-icons/fc';
import ProfileSidebar from './ProfileSidebar';

const allItems = [
  { name: 'Life Insurance', type: 'Course' },
  { name: 'Retirement Planning', type: 'Course' },
  { name: 'Emergency Fun Planning', type: 'Course' },
  { name: 'Debt Management', type: 'Course' },
  { name: 'Investment Basics', type: 'Course' },
  { name: 'What is Budgeting?', type: 'Resource' },
  { name: 'Investing 101', type: 'Resource' },
  { name: 'How to Build an Emergency Fund', type: 'Resource' },
  { name: 'Understanding Credit Scores', type: 'Resource' },
  { name: 'Life Insurance Explained', type: 'Resource' },
  { name: 'How to Get Out of Debt', type: 'Resource' },
  { name: 'Retirement Planning Basics', type: 'Resource' },
  { name: 'The 50/30/20 Budget Rule', type: 'Resource' },
  { name: 'Introduction to Compound Interest', type: 'Resource' },
];

function Navbar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const results = query.length > 0
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSearchClose = () => {
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-logo">FinanciallyFit</div>
        <div className="navbar-icons">
          <span className="nav-icon" onClick={() => navigate('/')}>
            🏠
            <span className="tooltip">Home</span>
          </span>
          <span className="nav-icon" onClick={() => navigate('/tools')}>
            <FcCalculator size={24} />
            <span className="tooltip">Tools</span>
          </span>
          <span
            className="nav-icon"
            onClick={() => { setSearchOpen(!searchOpen); setQuery(''); }}
          >
            🔍
            <span className="tooltip">Search</span>
          </span>
          <span className="nav-icon" onClick={() => navigate('/courses')}>
            <FcTodoList size={24} />
            <span className="tooltip">Courses</span>
          </span>
          <span className="nav-icon" onClick={() => setProfileOpen(!profileOpen)}>
            👤
            <span className="tooltip">Profile</span>
          </span>
        </div>
      </nav>

      {searchOpen && (
        <div className="search-dropdown">
          <div className="search-bar-row">
            <input
              type="text"
              placeholder="Search courses and resources..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              className="search-input"
            />
            <button className="search-close-btn" onClick={handleSearchClose}>✕</button>
          </div>

          {results.length > 0 && (
            <div className="search-results">
              {results.map((item, index) => (
                <div key={index} className="search-result-item"
                  onClick={() => {
                    if (item.type === 'Resource') navigate('/resources');
                    if (item.type === 'Course') navigate('/courses');
                    handleSearchClose();
                  }}
                >
                  <span className="result-name">{item.name}</span>
                  <span className="result-type">{item.type}</span>
                </div>
              ))}
            </div>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="search-no-results">No results found for "{query}"</div>
          )}
        </div>
      )}

      {profileOpen && <ProfileSidebar onClose={() => setProfileOpen(false)} />}
    </div>
  );
}

export default Navbar;