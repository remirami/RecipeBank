import React, { useState } from "react";
import { createRecipe } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./AddRecipe.module.css";

const AddRecipe = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [instructions, setInstructions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    category: "",
    ingredients: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate fields
    let isValid = true;
    const newFieldErrors = {
      name: "",
      description: "",
      category: "",
      ingredients: "",
      instructions: "",
    };
    const hasEmptyIngredients = ingredients.some(
      (ingredient) => ingredient.name.trim() === ""
    );
    if (hasEmptyIngredients) {
      newFieldErrors.ingredients = t("addRecipe.errors.ingredientsRequired");
      isValid = false;
    }
    if (instructions.length === 0) {
      newFieldErrors.instructions = t("addRecipe.errors.instructionsRequired");
      isValid = false;
    }

    if (instructions.length === 0) {
      newFieldErrors.instructions = t("addRecipe.errors.instructionsRequired");
      isValid = false;
    }
    if (name.trim() === "") {
      newFieldErrors.name = t("addRecipe.errors.nameRequired");
      isValid = false;
    }
    if (description.trim() === "") {
      newFieldErrors.description = t("addRecipe.errors.descriptionRequired");
      isValid = false;
    }
    if (category.trim() === "") {
      newFieldErrors.category = t("addRecipe.errors.categoryRequired");
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(newFieldErrors);
      return;
    }

    const userId = localStorage.getItem("userId") || null;
    console.log("userId from localStorage:", userId);

    if (!userId) {
      console.error("User is not logged in");
      setError("You must be logged in to add a recipe.");
      return;
    }
    const recipe = {
      name,
      description,
      category,
      ingredients: ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
      })),
      instructions,

      user_id: userId,
    };

    console.log("Submitting recipe:", recipe);

    try {
      const newRecipeId = await createRecipe(recipe);
      console.log("New recipe created with ID:", newRecipeId);
      setError(""); // Clear the error message after successful submission
      setSuccessMessage("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("Error creating recipe. Please try again.");
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const handleInstructionChange = (event, index) => {
    const newInstructions = [...instructions];
    newInstructions[index] = event.target.value;
    setInstructions(newInstructions);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };
  return (
    <div className={styles.container}>
      <h1>{t("addRecipe.title")}</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <label className={styles.labelContainer}>
          {t("addRecipe.name")}:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={styles.formElement}
          />
          {fieldErrors.name && (
            <div className={styles.error}>{fieldErrors.name}</div>
          )}
        </label>
        <label className={styles.labelContainer}>
          {t("addRecipe.description")}:
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={styles.formElement}
          />
          {fieldErrors.description && (
            <div className={styles.error}>{fieldErrors.description}</div>
          )}
        </label>
        <label className={styles.labelContainer}>
          {t("addRecipe.category")}:
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={styles.categorySelect}
          >
            {category === "" && (
              <option value="">{t("addRecipe.options.selectCategory")}</option>
            )}
            <option value="Vegetable">
              {t("addRecipe.options.vegetable")}
            </option>
            <option value="Meat">{t("addRecipe.options.meat")}</option>
            <option value="Dessert">{t("addRecipe.options.dessert")}</option>
            <option value="Fish">{t("addRecipe.options.fish")}</option>
            <option value="Dairy">{t("addRecipe.options.dairy")}</option>
            <option value="Poultry">{t("addRecipe.options.poultry")}</option>
            <option value="Grains">{t("addRecipe.options.grains")}</option>
            <option value="Legumes">{t("addRecipe.options.legumes")}</option>
            <option value="Fruits">{t("addRecipe.options.fruits")}</option>
            <option value="Nuts">{t("addRecipe.options.nuts")}</option>
            <option value="Beverages">
              {t("addRecipe.options.beverages")}
            </option>
            <option value="Soups">{t("addRecipe.options.soups")}</option>
            <option value="Salads">{t("addRecipe.options.salads")}</option>
            <option value="Breads">{t("addRecipe.options.breads")}</option>
            <option value="Snacks">{t("addRecipe.options.snacks")}</option>
            <option value="Appetizers">
              {t("addRecipe.options.appetizers")}
            </option>
            <option value="Sauces">{t("addRecipe.options.sauces")}</option>
            <option value="Spices">{t("addRecipe.options.spices")}</option>
            <option value="Seafood">{t("addRecipe.options.seafood")}</option>
            <option value="Eggs">{t("addRecipe.options.eggs")}</option>
            <option value="Pasta">{t("addRecipe.options.pasta")}</option>
            <option value="Rice">{t("addRecipe.options.rice")}</option>
            <option value="Pizza">{t("addRecipe.options.pizza")}</option>
            <option value="Sandwiches">
              {t("addRecipe.options.sandwiches")}
            </option>
            <option value="Stews">{t("addRecipe.options.stews")}</option>
            <option value="Curries">{t("addRecipe.options.curries")}</option>
            <option value="Vegan">{t("addRecipe.options.vegan")}</option>
            <option value="Vegetarian">
              {t("addRecipe.options.vegetarian")}
            </option>
            <option value="Gluten-free">
              {t("addRecipe.options.glutenFree")}
            </option>
            <option value="Dairy-free">
              {t("addRecipe.options.dairyFree")}
            </option>
            <option value="Paleo">{t("addRecipe.options.paleo")}</option>
            <option value="Keto">{t("addRecipe.options.keto")}</option>
            <option value="Low-carb">{t("addRecipe.options.lowCarb")}</option>
            <option value="Low-fat">{t("addRecipe.options.lowFat")}</option>
            <option value="Low-sodium">
              {t("addRecipe.options.lowSodium")}
            </option>

            <option value="Sugar-free">
              {t("addRecipe.options.sugarFree")}
            </option>
          </select>
          {fieldErrors.category && (
            <div className={styles.error}>{fieldErrors.category}</div>
          )}
        </label>
        <h2>{t("addRecipe.ingredients.title")}</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <label className={styles.labelContainer}>
              {t("addRecipe.name")}:
              <input
                type="text"
                value={ingredient.name}
                onChange={(event) =>
                  handleIngredientChange(index, "name", event.target.value)
                }
              />
            </label>
            <label className={styles.labelContainer}>
              {t("addRecipe.ingredients.amount")}:
              <input
                type="text"
                value={ingredient.amount}
                onChange={(event) =>
                  handleIngredientChange(index, "amount", event.target.value)
                }
              />
            </label>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className={`${styles.button} ${styles.removeButton}`}
            >
              {t("addRecipe.ingredients.remove")}
            </button>
          </div>
        ))}
        {fieldErrors.ingredients && (
          <div className={styles.error}>{fieldErrors.ingredients}</div>
        )}
        <button
          type="button"
          onClick={addIngredient}
          className={`${styles.button} ${styles.addButton}`}
        >
          {t("addRecipe.ingredients.addIngredient")}
        </button>
        <h2>{t("addRecipe.instructions.title")}</h2>
        {instructions.map((instruction, index) => (
          <div key={index}>
            <label className={styles.labelContainer}>
              {t("addRecipe.instructions.instruction")} {index + 1}:
              <input
                type="text"
                value={instruction}
                onChange={(event) => handleInstructionChange(event, index)}
              />
            </label>
            <button
              type="button"
              onClick={() => handleRemoveInstruction(index)}
              className={`${styles.button} ${styles.removeButton}`}
            >
              {t("addRecipe.instructions.remove")}
            </button>
          </div>
        ))}
        {fieldErrors.instructions && (
          <div className={styles.error}>{fieldErrors.instructions}</div>
        )}
        <button
          type="button"
          onClick={handleAddInstruction}
          className={`${styles.button} ${styles.addButton}`}
        >
          {t("addRecipe.instructions.addInstruction")}
        </button>

        <br />
        <button type="submit" className={styles.submitButton}>
          {t("addRecipe.submit")}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default AddRecipe;
