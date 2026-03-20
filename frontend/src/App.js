import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WelcomeBanner from './components/WelcomeBanner';
import GetStartedCard from './components/GetStartedCard';
import LearningPlan from './components/LearningPlan';
import ExternalResources from './components/ExternalResources';
import Tools from './pages/Tools';
import ExternalResourcesPage from './pages/ExternalResourcesPage';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <WelcomeBanner />
            <div className="main-content">
              <div className="left-column">
                <GetStartedCard />
                <ExternalResources />
              </div>
              <LearningPlan />
            </div>
          </>
        } />
        <Route path="/tools" element={<Tools />} />
        <Route path="/resources" element={<ExternalResourcesPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;