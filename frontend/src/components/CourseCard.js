function CourseCard({ title, hours }) {
  return (
    <div className="card">
      <div className="card-top"></div>

      <div className="card-body">
        <h3>{title}</h3>
        <p>{hours}</p>
      </div>
    </div>
  );
}

export default CourseCard;