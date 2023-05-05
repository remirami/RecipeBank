import React, { useState } from "react";
import { getRandomRecipe } from "../services/api";
import RandomRecipeButton from "./RandomRecipeButton";
import { useTranslation } from "react-i18next";
import RecipeCard from "./RecipeCard";
import styles from "./RandomRecipe.module.css";

const RandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState(null);
  const { t } = useTranslation();

  const handleRandomRecipeClick = async () => {
    try {
      const recipe = await getRandomRecipe();
      setRandomRecipe(recipe);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.randomRecipeButtonWrapper}>
        <RandomRecipeButton onClick={handleRandomRecipeClick} />
      </div>
      {randomRecipe && <RecipeCard recipe={randomRecipe} />}
    </div>
  );
};
export default RandomRecipe;
