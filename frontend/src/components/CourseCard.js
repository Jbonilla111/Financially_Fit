import React from "react";

function CourseCard({ title, hours, icon: Icon }) {
  return (
    <div className="card">
      {/* Top section now shows the icon */}
      <div className="card-top">
        {Icon && <Icon className="card-icon" size={40} />}
      </div>

      <div className="card-body">
        <h3>{title}</h3>
        <p>{hours}</p>
      </div>
    </div>
  );
}

export default CourseCard;