import React, { useState } from "react";
import { getRandomRecipe } from "../services/api";
import RandomRecipeButton from "./RandomRecipeButton";
import { useTranslation } from "react-i18next";
import styles from "./RandomRecipe.module.css";
import OpenBook from "./OpenBook";
import { Link } from "react-router-dom";

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
      {randomRecipe && (
        <Link to={`/recipes/${randomRecipe._id}`}>
          {t("randomRecipe.ViewRecipe")}
        </Link>
      )}
    </div>
  );
};
export default RandomRecipe;
