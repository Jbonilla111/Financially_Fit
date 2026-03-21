
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import CategoryTabs from './components/CategoryTabs';
import { FaBook, FaPiggyBank, FaCreditCard, FaUmbrella, FaChartLine } from "react-icons/fa";

function App() {
  const courses = [
  { title: "Foundations of Life Insurance", hours: "16 Hours", icon: FaUmbrella },
  { title: "Retirement Planning", hours: "16 Hours", icon: FaPiggyBank },
  { title: "Debt Management", hours: "16 Hours", icon: FaCreditCard },
  { title: "Emergency Fund Building", hours: "23 Hours", icon: FaBook },
  { title: "Investment Basics", hours: "20 Hours", icon: FaChartLine } // new course
];

  return (
    <div className="app">
      <Navbar />

      <div className="content">
        <h1 className="page-title">Courses</h1>

        <CategoryTabs />

        <div className="grid">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              hours={course.hours}
              icon={course.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;