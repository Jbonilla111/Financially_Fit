import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import WelcomeBanner from './components/WelcomeBanner';
import GetStartedCard from './components/GetStartedCard';
import LearningPlan from './components/LearningPlan';
import ExternalResources from './components/ExternalResources';

function App() {
  return (
    <div className="app">
      <Navbar />
      <WelcomeBanner />
      <div className="main-content">
        <div className="left-column">
          <GetStartedCard />
          <ExternalResources />
        </div>
        <LearningPlan />
      </div>
    </div>
  );
}

export default App;