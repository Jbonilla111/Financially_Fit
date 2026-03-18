import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import WelcomeBanner from './components/WelcomeBanner';
import GetStartedCard from './components/GetStartedCard';
import LearningPlan from './components/LearningPlan';

function App() {
  return (
    <div className="app">
      <Navbar />
      <WelcomeBanner />
      <div className="main-content">
        <GetStartedCard />
        <LearningPlan />
      </div>
    </div>
  );
}

export default App;