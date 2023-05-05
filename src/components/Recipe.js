import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "../services/api";
import { useTranslation } from "react-i18next";
import RecipeCard from "./RecipeCard";
import styles from "./Recipe.module.css";

const Recipe = ({ isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log(id);
        const data = await getRecipeById(id);
        console.log("Received recipe data:", data);
        setRecipe(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEdit = () => {
    // Navigate to the edit page
    navigate(`/recipes/edit/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  const goBackToRecipes = () => {
    navigate("/recipes");
  };
  const handleDelete = async () => {
    try {
      const response = await deleteRecipe(id);
      if (response.status === 200) {
        console.log("Recipe deleted successfully");
        navigate("/");
      } else {
        console.error("Error deleting recipe:", response);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  return (
    <div className={styles.recipeContainer}>
      <div className={styles.recipeCardWrapper}>
        <RecipeCard
          recipe={recipe}
          isLoggedIn={isLoggedIn}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <button type="button" onClick={goBackToRecipes}>
          {t("back_to_recipes")}
        </button>
      </div>
    </div>
  );
};

export default Recipe;
