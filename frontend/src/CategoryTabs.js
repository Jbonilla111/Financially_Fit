function CategoryTabs() {
  const categories = [
    "Life Insurance",
    "Retirement Planning",
    "Debt Management",
    "Emergency Fund Building",
    "Investment Basics"
  ];

  return (
    <div className="tabs">
      {categories.map((cat, index) => (
        <button key={index} className="tab">
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;