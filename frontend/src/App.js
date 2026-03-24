
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
import { useUser } from './context/UserContext';
import CourseLanding from './pages/CourseLanding';
import { Routes, Route } from 'react-router-dom';
import FoundationsLifeInsurance from './pages/FoundationsLifeInsurance';
import FoundationsLifeLessons from './pages/FoundationsLifeLessons';


function App() {
  const { darkMode } = useUser();

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
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
            <HomeFooterSection />
          </>
        } />
        <Route path="/tools" element={<Tools />} />
        <Route path="/resources" element={<ExternalResourcesPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/courses" element={<Courses />} />
  <Route path="/courses/:courseId" element={<CourseLanding />} />
  <Route path="/courses/foundations-life-insurance" element={<FoundationsLifeInsurance />} />
  <Route path="/courses/foundations-life-insurance/start" element={<FoundationsLifeLessons />} />
  

      </Routes>
    </div>
  );
}

export default App;