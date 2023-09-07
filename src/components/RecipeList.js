import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRecipes } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./RecipeList.module.css";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const searchRecipes = (recipes, query) => {
    const lowerCaseQuery = query.toLowerCase();
    return recipes.filter((recipe) => {
      const nameMatch = recipe.name.toLowerCase().includes(lowerCaseQuery);
      const categoryMatch =
        typeof recipe.category === "string" &&
        recipe.category.toLowerCase().includes(lowerCaseQuery);
      const ingredientGroupMatch = recipe.ingredientGroups.some((group) =>
        group.ingredients.some((ingredient) =>
          ingredient.name.toLowerCase().includes(lowerCaseQuery)
        )
      );
      return nameMatch || categoryMatch || ingredientGroupMatch;
    });
  };

  const filteredRecipes = searchRecipes(recipes, searchQuery);

  return (
    <div>
      <div className={styles.headerWrapper}>
        <h2 className={styles.header}>{t("recipeList.title")}</h2>
      </div>
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={t("recipeList.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.recipeGrid}>
        {filteredRecipes.map((recipe) => (
          <div key={recipe._id} className={styles.recipeCard}>
            <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
