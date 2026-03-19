import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { RiContactsLine } from 'react-icons/ri';
import { FcCalculator } from 'react-icons/fc';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">FinanciallyFit</div>
      <div className="navbar-icons">
        <span className="nav-icon" onClick={() => navigate('/')}>🏠</span>
        <span className="nav-icon" onClick={() => navigate('/tools')}>
          <FcCalculator size={24} />
        </span>
        <span className="nav-icon">🔍</span>
        <span className="nav-icon">
          <RiContactsLine size={24} color="white" />
        </span>
        <span className="nav-icon">👤</span>
      </div>
    </nav>
  );
}

export default Navbar;