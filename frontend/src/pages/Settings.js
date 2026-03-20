import React, { useState } from 'react';
import './Settings.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showProgress, setShowProgress] = useState(true);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    navigate('/signup');
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* Notifications */}
        <div className="settings-card">
          <h2>Notifications</h2>
          <div className="settings-toggle-row">
            <div>
              <p className="toggle-title">Email Notifications</p>
              <p className="toggle-subtitle">Receive updates and tips via email</p>
            </div>
            <div
              className={`toggle ${emailNotifications ? 'on' : ''}`}
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
          <div className="settings-toggle-row">
            <div>
              <p className="toggle-title">Push Notifications</p>
              <p className="toggle-subtitle">Receive alerts on your device</p>
            </div>
            <div
              className={`toggle ${pushNotifications ? 'on' : ''}`}
              onClick={() => setPushNotifications(!pushNotifications)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
          <div className="settings-toggle-row">
            <div>
              <p className="toggle-title">Weekly Progress Report</p>
              <p className="toggle-subtitle">Get a summary of your weekly learning</p>
            </div>
            <div
              className={`toggle ${weeklyReport ? 'on' : ''}`}
              onClick={() => setWeeklyReport(!weeklyReport)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="settings-card">
          <h2>Privacy</h2>
          <div className="settings-toggle-row">
            <div>
              <p className="toggle-title">Public Profile</p>
              <p className="toggle-subtitle">Allow others to see your profile</p>
            </div>
            <div
              className={`toggle ${publicProfile ? 'on' : ''}`}
              onClick={() => setPublicProfile(!publicProfile)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
          <div className="settings-toggle-row">
            <div>
              <p className="toggle-title">Show Learning Progress</p>
              <p className="toggle-subtitle">Display your course progress publicly</p>
            </div>
            <div
              className={`toggle ${showProgress ? 'on' : ''}`}
              onClick={() => setShowProgress(!showProgress)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <h2>Change Password</h2>
          {passwordError && <p className="settings-error">{passwordError}</p>}
          {passwordSuccess && <p className="settings-success">{passwordSuccess}</p>}
          <label>Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <label>New Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button className="settings-save-btn" onClick={handlePasswordChange}>
            Update Password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="settings-card danger">
          <h2>Danger Zone</h2>
          <p className="danger-text">
            Once you delete your account all of your data will be permanently removed.
            This action cannot be undone.
          </p>
          <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="delete-overlay">
          <div className="delete-modal">
            <h3>Delete Account</h3>
            <p>Are you sure you want to permanently delete your account? This cannot be undone.</p>
            <button className="delete-confirm-btn" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </button>
            <button className="delete-cancel-btn" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;