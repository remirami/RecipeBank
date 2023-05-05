import React from "react";

const CategoryList = () => {
  const categories = ["Kategoria 1", "Kategoria 2", "Kategoria 3"];

  return (
    <div>
      <h2>Kategoriat</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
