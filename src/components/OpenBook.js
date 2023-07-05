import React, { useState } from "react";
import styles from "./OpenBook.module.css";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

const OpenBook = ({
  recipe,
  isLoggedIn,
  handleEdit,
  handleDelete,
  handleLike,
  handleDislike,
}) => {
  const { t } = useTranslation();
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [checkedInstructions, setCheckedInstructions] = useState([]);
  const [tooltipLikeVisible, setTooltipLikeVisible] = useState(false);
  const [tooltipDislikeVisible, setTooltipDislikeVisible] = useState(false);

  const handleIngredientCheckboxChange = (index) => {
    if (checkedIngredients.includes(index)) {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== index));
    } else {
      setCheckedIngredients([...checkedIngredients, index]);
    }
  };

  const handleInstructionCheckboxChange = (index) => {
    if (checkedInstructions.includes(index)) {
      setCheckedInstructions(checkedInstructions.filter((i) => i !== index));
    } else {
      setCheckedInstructions([...checkedInstructions, index]);
    }
  };
  console.log("isLoggedIn value:", isLoggedIn);
  console.log("userId from local storage:", localStorage.getItem("userId"));
  console.log("recipe.user_id:", recipe.user_id);

  const isOwner =
    isLoggedIn &&
    recipe.user_id &&
    recipe.user_id._id &&
    (localStorage.getItem("userId") === recipe.user_id._id ||
      localStorage.getItem("isAdmin") === "true");
  const username =
    recipe.user_id && recipe.user_id.username
      ? recipe.user_id.username
      : "Unknown";
  console.log(isOwner);
  console.log("Food Type:", recipe.foodType);
  console.log("Type of Food Type:", typeof recipe.foodType);

  console.log("Dietary Preference:", recipe.dietaryPreference);
  console.log("Type of Dietary Preference:", typeof recipe.dietaryPreference);
  console.log("Ingredients:", recipe.ingredients);
  const getFoodTypeString = (foodTypeArray) => {
    if (!foodTypeArray || !Array.isArray(foodTypeArray)) return ""; // If foodTypeArray is null or undefined or not an array
    return foodTypeArray
      .map((foodType) => {
        let result = foodType.mainType || "";
        if (foodType.contains) {
          result += `: ${foodType.contains.join(", ")}`;
        }
        return result;
      })
      .join(", ");
  };

  return (
    <div className={styles.bookContainer}>
      <div className={styles.openBook}>
        <div className={styles.leftPage}>
          <h2>{recipe.name}</h2>
          <p className={styles.recipeDescription}>
            {recipe.description || t("openBook.no_description")}
          </p>
          <p>
            <strong>{t("openBook.foodType")}:</strong>{" "}
            {getFoodTypeString(recipe.foodType)}
          </p>
          <p>
            <strong>{t("openBook.category")}:</strong>{" "}
            {recipe.category || t("openBook.no_category")}
          </p>
          <p>
            <strong>{t("openBook.dietaryPreference")}:</strong>{" "}
            {recipe.dietaryPreference}
          </p>
          <p>
            <strong>{t("openBook.prepTime")}:</strong>{" "}
            {recipe.prepTime || t("openBook.no_prepTime")}
          </p>

          <p>
            <strong>{t("openBook.cookTime")}:</strong>{" "}
            {recipe.cookTime || t("openBook.no_cookTime")}
          </p>

          <p>
            <strong>{t("openBook.servingSize")}:</strong>{" "}
            {recipe.servingSize || t("openBook.no_servingSize")}
          </p>
          <h3>{t("openBook.ingredients")}:</h3>
          <ul className={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className={styles.ingredient}>
                <input
                  type="checkbox"
                  id={`ingredient-${index}`}
                  onChange={() => handleIngredientCheckboxChange(index)}
                />
                <label
                  htmlFor={`ingredient-${index}`}
                  className={
                    checkedIngredients.includes(index)
                      ? styles.checkedIngredient
                      : ""
                  }
                >
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.rightPage}>
          <h3>{t("openBook.instructions")}:</h3>
          <ul className={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className={styles.instruction}>
                <input
                  type="checkbox"
                  id={`instruction-${index}`}
                  onChange={() => handleInstructionCheckboxChange(index)}
                />
                <label
                  htmlFor={`instruction-${index}`}
                  className={`${
                    checkedInstructions.includes(index)
                      ? styles.checkedInstruction
                      : ""
                  }`}
                >
                  {index + 1}. {instruction}
                </label>
              </li>
            ))}
            <p className={styles.creator}>
              {t("openBook.createdBy")} {username}
            </p>
          </ul>
          <div className={styles.reactionButtons}>
            <button
              className={`${styles.likeButton}`}
              onClick={() => {
                if (!isLoggedIn) {
                  return;
                }
                handleLike();
              }}
              onMouseEnter={() => {
                if (!isLoggedIn) {
                  setTooltipLikeVisible(true);
                }
              }}
              onMouseLeave={() => setTooltipLikeVisible(false)}
            >
              👍 {recipe.thumbsUp.length || 0}
              {tooltipLikeVisible && (
                <span className={styles.tooltip}>
                  {t("openBook.tooltipLike")}
                </span>
              )}
            </button>

            <button
              className={`${styles.dislikeButton}`}
              onClick={() => {
                if (!isLoggedIn) {
                  return;
                }
                handleDislike();
              }}
              onMouseEnter={() => {
                if (!isLoggedIn) {
                  setTooltipDislikeVisible(true);
                }
              }}
              onMouseLeave={() => setTooltipDislikeVisible(false)}
            >
              👎 {recipe.thumbsDown.length || 0}
              {tooltipDislikeVisible && (
                <span className={styles.tooltip}>
                  {t("openBook.tooltipDislike")}
                </span>
              )}
            </button>
          </div>

          {isOwner && (
            <div>
              <button className={`${styles.editButton}`} onClick={handleEdit}>
                {t("openBook.Edit")}
              </button>
              <button
                className={`${styles.deleteButton}`}
                onClick={handleDelete}
              >
                {t("openBook.Delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OpenBook;
