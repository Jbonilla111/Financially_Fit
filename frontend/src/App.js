import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import WelcomeBanner from './components/WelcomeBanner';

function App() {
  return (
    <div className="app">
      <Navbar />
      <WelcomeBanner />
    </div>
  );
}

export default App;