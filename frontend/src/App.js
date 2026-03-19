import "./App.css";
import Navbar from "./components/Navbar";
import CourseCard from "./components/CourseCard";
import CategoryTabs from "./components/CategoryTabs";

function App() {
  const courses = [
    { title: "Foundations of Life Insurance", hours: "16 Hours" },
    { title: "Retirement Planning", hours: "16 Hours" },
    { title: "Debt Management", hours: "16 Hours" },
    { title: "Emergency Fund Building", hours: "23 Hours" }
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;