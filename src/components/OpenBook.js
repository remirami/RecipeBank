import React, { useState } from "react";
import styles from "./OpenBook.module.css";
import { useTranslation } from "react-i18next";

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

  const handleIngredientCheckboxChange = (groupIndex, ingredientIndex) => {
    const compoundKey = `${groupIndex}-${ingredientIndex}`;
    if (checkedIngredients.includes(compoundKey)) {
      setCheckedIngredients(
        checkedIngredients.filter((key) => key !== compoundKey)
      );
    } else {
      setCheckedIngredients([...checkedIngredients, compoundKey]);
    }
  };

  const handleInstructionCheckboxChange = (index) => {
    if (checkedInstructions.includes(index)) {
      setCheckedInstructions(checkedInstructions.filter((i) => i !== index));
    } else {
      setCheckedInstructions([...checkedInstructions, index]);
    }
  };

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

  const getFoodTypeString = (foodTypeArray) => {
    if (!foodTypeArray || !Array.isArray(foodTypeArray)) return ""; // If foodTypeArray is null or undefined or not an array
    return foodTypeArray
      .map((foodType) => {
        let mainType = foodType.mainType
          ? t(`addRecipe.selectionOptions.${foodType.mainType}`)
          : "";
        let contains = foodType.contains
          ? foodType.contains.map((type) =>
              t(`addRecipe.selectionOptions.${type}`)
            )
          : [];
        return `${mainType} ${contains.join(", ")}`;
      })
      .join(", ");
  };
  return (
    <div className={styles.bookContainer}>
      <div className={styles.openBook}>
        <div className={styles.leftPage}>
          <h2 className={styles.recipeTitle}>{recipe.name}</h2>{" "}
          <p className={styles.recipeDescription}>
            {recipe.description || t("openBook.no_description")}
          </p>
          <p>
            <strong>{t("openBook.foodType")}:</strong>{" "}
            {getFoodTypeString(recipe.foodType)}
          </p>
          <p>
            <strong>{t("openBook.mealType")}:</strong>{" "}
            {t(`openBook.selectionOptions.${recipe.foodCategory.mealType}`) ||
              t("openBook.no_mealType")}
          </p>
          <p>
            <strong>{t("openBook.type")}:</strong>{" "}
            {t(`openBook.selectionOptions.${recipe.foodCategory.type}`) ||
              t("openBook.no_type")}{" "}
          </p>
          <p>
            <strong>{t("openBook.dietaryPreference")}:</strong>{" "}
            {recipe.dietaryPreference && recipe.dietaryPreference.length > 0
              ? recipe.dietaryPreference
                  .map((pref) => t(`openBook.selectionOptions.${pref}`))
                  .join(", ")
              : t("openBook.no_dietaryPreference")}
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
            {recipe.ingredientGroups && recipe.ingredientGroups.length > 0 ? (
              recipe.ingredientGroups.map((group, groupIndex) => (
                <li key={`group-${groupIndex}`}>
                  {group.title && <h4>{group.title}</h4>}
                  {group.ingredients.map((ingredient, ingredientIndex) => {
                    const compoundKey = `${groupIndex}-${ingredientIndex}`;
                    return (
                      <div
                        key={`ingredient-${groupIndex}-${ingredientIndex}`}
                        className={styles.ingredient}
                      >
                        <label
                          htmlFor={`ingredient-${groupIndex}-${ingredientIndex}`}
                          className={
                            checkedIngredients.includes(compoundKey)
                              ? styles.checkedIngredient
                              : ""
                          }
                        >
                          {ingredient.name} - {ingredient.quantity}{" "}
                          <strong>
                            {t(`openBook.units.${ingredient.unit}`)}
                          </strong>
                        </label>
                        <input
                          type="checkbox"
                          id={`ingredient-${groupIndex}-${ingredientIndex}`}
                          onChange={() =>
                            handleIngredientCheckboxChange(
                              groupIndex,
                              ingredientIndex
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </li>
              ))
            ) : (
              <li>{t("openBook.no_ingredients")}</li>
            )}
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
