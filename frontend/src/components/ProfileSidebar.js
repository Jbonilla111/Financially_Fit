import React, { useState } from 'react';
import './ProfileSidebar.css';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaCog, FaSignOutAlt } from 'react-icons/fa';

function ProfileSidebar({ onClose }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowLogoutModal(false);
    onClose();
    window.location.href = '/login';
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <h2>Profile</h2>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-avatar">
          <div className="avatar-circle">👤</div>
          <h3>{user ? user.username : 'Learner'}</h3>
          <p className="sidebar-id">{user ? user.email : 'No email'}</p>
        </div>

        <div className="sidebar-menu">
          <button className="sidebar-menu-item" onClick={() => { navigate('/edit-profile'); onClose(); }}>
            <FaUserEdit className="menu-icon" />
            Edit Profile
          </button>
          <button className="sidebar-menu-item" onClick={() => { navigate('/settings'); onClose(); }}>
            <FaCog className="menu-icon" />
            Settings
          </button>
          <button className="sidebar-menu-item logout" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt className="menu-icon" />
            Logout
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>End Session</h3>
            <p>Are you sure you want to log out?</p>
            <button className="logout-confirm-btn" onClick={handleLogout}>
              Yes, End Session
            </button>
            <button className="logout-cancel-btn" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileSidebar;