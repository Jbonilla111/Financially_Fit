import React, { useState } from 'react';
import './EditProfile.css';
import Navbar from '../components/Navbar';

function EditProfile() {
  const [username, setUsername] = useState('John Smith');
  const [phone, setPhone] = useState('+1 555 5555 55');
  const [email, setEmail] = useState('example@example.com');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`edit-profile-page ${darkTheme ? 'dark' : ''}`}>
      <Navbar />
      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h2>Edit My Profile</h2>

          <div className="edit-avatar">
            <div className="edit-avatar-circle">👤</div>
            <p className="edit-name">John Smith</p>
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
                className={`toggle ${darkTheme ? 'on' : ''}`}
                onClick={() => setDarkTheme(!darkTheme)}
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