import React, { useState } from 'react';
import './EditProfile.css';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

function EditProfile() {
  const { user, updateUser, darkMode, toggleDarkMode } = useUser();
  const [username, setUsername] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    updateUser({ name: username, phone, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="edit-profile-page">
      <Navbar />
      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h2>Edit My Profile</h2>

          <div className="edit-avatar">
            <div className="edit-avatar-circle">👤</div>
            <p className="edit-name">{user.name}</p>
            <p className="edit-subtitle">Account Settings</p>
          </div>

          <div className="edit-form">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="John Smith"
            />

            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 555 5555 55"
            />

            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@example.com"
            />

            <div className="toggle-row">
              <span>Push Notifications</span>
              <div
                className={`toggle ${pushNotifications ? 'on' : ''}`}
                onClick={() => setPushNotifications(!pushNotifications)}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            <div className="toggle-row">
              <span>Turn Dark Theme</span>
              <div
                className={`toggle ${darkMode ? 'on' : ''}`}
                onClick={toggleDarkMode}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            {saved && <p className="save-success">Profile updated successfully!</p>}

            <button className="update-btn" onClick={handleUpdate}>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;