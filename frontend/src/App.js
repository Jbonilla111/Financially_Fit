
import React from 'react';
import './App.css';
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
import HomeFooterSection from './components/HomeFooterSection';
import Courses from './pages/Courses';
import CourseLanding from './pages/CourseLanding';
import CourseLesson from './pages/CourseLesson';
import { useUser } from './context/UserContext';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { darkMode } = useUser();

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          localStorage.getItem('user') ? (
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
              <HomeFooterSection />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

            {/* Dynamic routing for DB-pulled courses */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseLanding />} />
            <Route path="/courses/:courseId/start" element={<CourseLesson />} />

        <Route path="/tools" element={<Tools />} />
        <Route path="/resources" element={<ExternalResourcesPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;