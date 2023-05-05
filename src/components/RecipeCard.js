import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./RecipeCard.module.css";

const RecipeCard = ({ recipe }) => {
  const { t } = useTranslation();

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.recipeCard}>
      <h3>{recipe.name}</h3>
      <p>{t("recipeCard.ingredients")}:</p>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.name}</li>
        ))}
      </ul>
      <p>{t("recipeCard.instructions")}:</p>
      {recipe.instructions.map((instruction, index) => (
        <p key={index}>
          {index + 1}. {instruction}
        </p>
      ))}
      {t("recipeCard.made_by")} {recipe.user_id.username}
    </div>
  );
};

export default RecipeCard;
