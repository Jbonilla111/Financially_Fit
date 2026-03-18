import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">FinanciallyFit</div>
      <div className="navbar-icons">
        <span className="nav-icon">🏠</span>
        <span className="nav-icon">📋</span>
        <span className="nav-icon">🔍</span>
        <span className="nav-icon">⊞</span>
        <span className="nav-icon">👤</span>
      </div>
    </nav>
  );
}

export default Navbar;