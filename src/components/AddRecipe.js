import React, { useState, useEffect } from "react";
import { createRecipe, getRecipeByName } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./AddRecipe.module.css";
import { useNavigate } from "react-router-dom";

const foodSubTypes = {
  "Red Meat & Ground Meat": ["Red Meat", "Ground Meat"],
  "Fish & Seafood": ["Fish", "Seafood"],
  "Dairy & Eggs": ["Dairy", "Eggs"],
  "Chicken & Poultry": ["Chicken", "Poultry"],
  "Fruits & Berries": ["Fruit", "Berries"],
  "Marinades & Sauces": ["Marinade", "Sauce"],
  "Grains & Rice": ["Grain", "Rice"],
  Vegetables: [],
  Sausage: [],
};

const AddRecipe = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [foodCategory, setFoodCategory] = useState({
    mealType: "",
    type: "",
  });
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [instructions, setInstructions] = useState([]);

  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [foodType, setFoodType] = useState([{ mainType: "", contains: [] }]);
  const [dietaryPreference, setDietaryPreference] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [amountErrors, setAmountErrors] = useState([]);
  const [displayUnits, setDisplayUnits] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    foodCategory: {
      mealType: "",
      type: "",
    },
    ingredients: "",
    foodType: "",
    prepTime: "",
    cookTime: "",
    dietaryPreference: "",
    instructions: "",
  });
  const [error, setError] = useState("");
  // Add a state variable to track if there are unsaved changes
  const [isBlocking, setIsBlocking] = useState(false);

  function validateNotEmpty(field) {
    if (typeof field === "string" && field.trim() === "") {
      return t("addRecipe.validation.fieldRequired");
    }
    return "";
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate fields
    let isValid = true;
    const newFieldErrors = {
      name: "",
      description: "",
      foodCategory: {
        mealType: "",
        type: "",
      },
      ingredients: "",
      instructions: "",
      prepTime: "",
      cookTime: "",
      servingSize: "",
      foodType: "",
      dietaryPreference: "",
    };

    if (servingSize) {
      // Only validate if servingSize is not empty
      if (!Number.isInteger(Number(servingSize)) || Number(servingSize) <= 0) {
        newFieldErrors.servingSize = t("addRecipe.errors.servingSizeInvalid");
        isValid = false;
      }
    }
    if (ingredients.length > 30) {
      newFieldErrors.ingredients = t("addRecipe.errors.maxIngredients");
      isValid = false;
    }
    if (instructions.length > 30) {
      newFieldErrors.instructions = t("addRecipe.errors.maxInstructions");
      isValid = false;
    }
    // Validate name, description and category
    newFieldErrors.name = validateNotEmpty(name);
    newFieldErrors.description = validateNotEmpty(description);
    newFieldErrors.foodCategory.mealType = validateNotEmpty(
      foodCategory.mealType
    );
    ingredients.forEach((ingredient, index) => {
      const ingredientNameError = validateNotEmpty(ingredient.name);
      const ingredientQuantityError = validateNotEmpty(ingredient.quantity);

      if (ingredientNameError) {
        newFieldErrors.ingredients = ingredientNameError;
        isValid = false;
      }
      if (ingredientQuantityError) {
        newFieldErrors.ingredients = ingredientQuantityError;
        isValid = false;
      }
    });

    instructions.forEach((instruction, index) => {
      const instructionError = validateNotEmpty(instruction);

      if (instructionError) {
        newFieldErrors.instructions = instructionError;
        isValid = false;
      }
    });
    // Check if prepTime is a positive integer number
    if (!Number.isInteger(Number(prepTime)) || Number(prepTime) <= 0) {
      newFieldErrors.prepTime = t("addRecipe.errors.prepTimeInvalid");
      isValid = false;
    }

    // Check if cookTime is a positive integer number
    if (!Number.isInteger(Number(cookTime)) || Number(cookTime) <= 0) {
      newFieldErrors.cookTime = t("addRecipe.errors.cookTimeInvalid");
      isValid = false;
    }
    if (foodType.length === 0) {
      newFieldErrors.foodType = t("addRecipe.errors.foodTypeRequired");
      isValid = false;
    }

    // Check for unique ingredients
    let ingredientsSet = new Set(
      ingredients.map((ingredient) => ingredient.name.toLowerCase())
    );
    if (ingredientsSet.size !== ingredients.length) {
      newFieldErrors.ingredients = t("addRecipe.errors.duplicateIngredients");
      isValid = false;
    }
    // Check for unique instructions
    let instructionsSet = new Set(instructions);
    if (instructionsSet.size !== instructions.length) {
      newFieldErrors.instructions = t("addRecipe.errors.duplicateInstructions");
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(newFieldErrors);
      return;
    }
    // Check if recipe name already exists
    try {
      const { exists } = await getRecipeByName(name);
      if (exists) {
        setError(t("addRecipe.errors.recipeExists"));
        return;
      }
    } catch (error) {
      console.error(t("addRecipe.errors.userNotLoggedIn"));
      setError(t("addRecipe.errors.recipeExists"));
      return;
    }
    const userId = localStorage.getItem("userId") || null;
    console.log("userId from localStorage:", userId);

    if (!userId) {
      console.error("User is not logged in");
      setError(t("addRecipe.errors.mustBeLoggedIn"));
      return;
    }
    const recipe = {
      name,
      description,
      foodCategory: {
        mealType: foodCategory.mealType,
        type: foodCategory.type,
      },
      ingredients: ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })),
      instructions,
      prepTime,
      cookTime,
      servingSize,
      foodType,
      dietaryPreference,

      user_id: userId,
    };

    console.log("Submitting recipe:", recipe);

    try {
      const response = await createRecipe(recipe);
      if (typeof response === "string") {
        // Check if response is a string
        console.log("Recipe created successfully with ID: ", response);
        setIsBlocking(false);
        setError("");
        setSuccessMessage("Recipe created successfully!");
        console.log("New recipe created with ID:", response);
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("Error creating recipe. Please try again.");
    }
  };
  const validateAmount = (value) => {
    console.log("ValidateAmount called with value: ", value);

    // Check if value is a positive floating-point number or zero
    const regex = /^\d*\.?\d+$/;
    const isValid = regex.test(value);

    return isValid;
  };
  const handleMealTypeChange = (event) => {
    setFoodCategory({
      ...foodCategory, // Preserve the other properties of foodCategory
      mealType: event.target.value, // Update mealType with the new value
    });
  };
  const handleIngredientChange = (index, field, value) => {
    setError("");
    let updatedIngredients = [...ingredients]; // Create a copy of ingredients
    let ingredient = { ...updatedIngredients[index] }; // Create a copy of specific ingredient

    if (field === "quantity") {
      const numberPart = value.replace(/[^0-9.]/g, "");
      let quantityNumber = parseFloat(numberPart);
      ingredient.quantity = isNaN(quantityNumber) ? 0 : quantityNumber; // Parse to float and update quantity of ingredient

      const isValidAmount = validateAmount(ingredient.quantity);
      const newAmountErrors = [...amountErrors];
      newAmountErrors[index] = isValidAmount
        ? ""
        : "Invalid amount. Please use a valid number.";
      setAmountErrors(newAmountErrors);
    } else if (field === "name") {
      ingredient.name = value;
    } else if (field === "unit") {
      ingredient.unit = value;
    }

    console.log("Before update", updatedIngredients);
    updatedIngredients[index] = ingredient;
    console.log("After update", updatedIngredients);
    setIngredients(updatedIngredients);
  };

  let navigate = useNavigate();

  const handleClick = () => {
    navigate("/recipes");
  };

  const addIngredient = () => {
    if (ingredients.length >= 30) {
      setError(t("addRecipe.errors.maxIngredients"));
      return;
    }
    setError("");
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "g" }]);
  };
  useEffect(() => {
    console.log(ingredients);
  }, [ingredients]);

  const removeIngredient = (index) => {
    if (ingredients.length === 1) {
      setError(t("addRecipe.errors.atLeastOneIngredient"));
      return;
    }
    setIngredients(ingredients.filter((_, i) => i !== index));
    setAmountErrors(amountErrors.filter((_, i) => i !== index));
  };
  const handleInstructionChange = (event, index) => {
    const newInstructions = [...instructions];
    newInstructions[index] = event.target.value;
    setInstructions(newInstructions);
  };
  const handleBlur = (event, field) => {
    const value = event.target.value;
    let error = "";

    if (field === "ingredients" || field === "instructions") {
      // Check if it's an array and not empty
      if (!Array.isArray(value) || value.length === 0) {
        error = t("addRecipe.errors.fieldEmpty");
      }
    } else if (value.trim() === "") {
      if (field === "category" || field === "foodType") {
        error = "Please select a value.";
      } else if (
        field === "foodCategory.mealType" ||
        field === "foodCategory.type"
      ) {
        error = "Please select a food category.";
      } else {
        error = t("addRecipe.errors.fieldEmpty");
      }
    } else if (
      (field === "prepTime" || field === "cookTime") &&
      (!Number.isInteger(Number(value)) || Number(value) <= 0)
    ) {
      error = "This field requires a positive integer value.";
    }

    if (field.startsWith("foodCategory.")) {
      const subField = field.split(".")[1];
      setFieldErrors({
        ...fieldErrors,
        foodCategory: {
          ...fieldErrors.foodCategory,
          [subField]: error,
        },
      });
    } else {
      setFieldErrors({
        ...fieldErrors,
        [field]: error,
      });
    }
  };
  const handleAddInstruction = () => {
    if (instructions.length < 30) {
      setInstructions([...instructions, ""]);
    } else {
      setError(t("addRecipe.errors.maxIngredients"));
    }
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };
  const handleMainFoodTypeChange = (index, event) => {
    const newFoodType = [...foodType];
    newFoodType[index].mainType = event.target.value;
    // Check if there are subTypes for the selected mainType
    if (
      !foodSubTypes[event.target.value] ||
      foodSubTypes[event.target.value].length === 0
    ) {
      // If not, clear the subTypes
      newFoodType[index].contains = [];
    }
    setFoodType(newFoodType);
  };

  const handleSubTypeChange = (index, subType, isChecked) => {
    const newFoodType = [...foodType];
    if (isChecked) {
      newFoodType[index].contains.push(subType);
    } else {
      const subTypeIndex = newFoodType[index].contains.indexOf(subType);
      if (subTypeIndex > -1) {
        newFoodType[index].contains.splice(subTypeIndex, 1);
      }
    }
    setFoodType(newFoodType);
  };

  const handleDietaryPreferencesChange = (event) => {
    const value = event.target.value;

    const incompatibleFoodTypes = {
      Vegan: [
        { mainType: "Red Meat & Ground Meat", subType: [] },
        { mainType: "Fish & Seafood", subType: [] },
        { mainType: "Dairy & Eggs", subType: ["Dairy", "Eggs"] },
        { mainType: "Chicken & Poultry", subType: [] },
      ],
      Vegetarian: [
        { mainType: "Red Meat & Ground Meat", subType: [] },
        { mainType: "Chicken & Poultry", subType: [] },
      ],
      "Dairy-free": [{ mainType: "Dairy & Eggs", subType: ["Dairy"] }],
      "Egg-free": [{ mainType: "Dairy & Eggs", subType: ["Eggs"] }],
    };

    if (
      value in incompatibleFoodTypes &&
      foodType.some((type) =>
        incompatibleFoodTypes[value].some(
          (incompatibleType) =>
            incompatibleType.mainType === type.mainType &&
            (incompatibleType.subType.length === 0 ||
              (type.contains &&
                type.contains.some((subtype) =>
                  incompatibleType.subType.includes(subtype)
                )))
        )
      )
    ) {
      setError(t("addRecipe.errors.nonCompatibleFoodTypes"));
      return;
    }

    setError("");
    if (event.target.checked) {
      setDietaryPreference((prevPreferences) => [...prevPreferences, value]);
    } else {
      setDietaryPreference((prevPreferences) =>
        prevPreferences.filter((preference) => preference !== value)
      );
    }
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
            onBlur={(event) => handleBlur(event, "name")}
            maxLength="50"
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
            className={styles.formElement + " " + styles.textarea}
            placeholder="(Optional)"
            maxLength="400"
          />
          {fieldErrors.description && (
            <div className={styles.error}>{fieldErrors.description}</div>
          )}
        </label>
        <label className={styles.labelContainer}>
          {t("addRecipe.prepTime")}:
          <input
            type="number"
            value={prepTime}
            onChange={(event) => setPrepTime(event.target.value)}
            className={styles.formElement}
            onBlur={(event) => handleBlur(event, "prepTime")}
            min="0"
            max="1200"
          />
          {fieldErrors.prepTime && (
            <div className={styles.error}>{fieldErrors.prepTime}</div>
          )}
        </label>
        <label className={styles.labelContainer}>
          {t("addRecipe.cookingTime")}:
          <input
            type="number"
            value={cookTime}
            onChange={(event) => setCookTime(event.target.value)}
            className={styles.formElement}
            onBlur={(event) => handleBlur(event, "cookTime")}
            min="0"
            max="1200"
          />
          {fieldErrors.cookTime && (
            <div className={styles.error}>{fieldErrors.cookTime}</div>
          )}
        </label>
        <label className={styles.labelContainer}>
          {t("addRecipe.servingSize")}:
          <input
            type="number"
            value={servingSize}
            onChange={(event) => setServingSize(event.target.value)}
            className={styles.formElement}
            placeholder="(Optional)"
            max="100"
          />
          {fieldErrors.servingSize && (
            <div className={styles.error}>{fieldErrors.servingSize}</div>
          )}
        </label>
        {foodType.map((type, index) => (
          <div key={index}>
            <label className={styles.labelContainer}>
              {t("addRecipe.foodType")}:
              <select
                value={type.mainType}
                onChange={(event) => handleMainFoodTypeChange(index, event)}
                required
                className={styles.formElement}
                onBlur={(event) => handleBlur(event, "foodType")}
              >
                <option value="">{t("addRecipe.foodTypeTranslation")}</option>
                {[
                  "Red Meat & Ground Meat",
                  "Fish & Seafood",
                  "Dairy & Eggs",
                  "Marinades & Sauces",
                  "Grains & Rice",
                  "Fruits & Berries",
                  "Chicken & Poultry",
                  "Vegetable",
                  "Sausage",
                ].map((mainType) => (
                  <option value={mainType} key={mainType}>
                    {t(`addRecipe.selectionOptions.${mainType}`)}
                  </option>
                ))}
              </select>
            </label>

            {foodSubTypes[type.mainType] && (
              <div>
                {foodSubTypes[type.mainType].map((contains) => (
                  <div key={contains}>
                    <input
                      type="checkbox"
                      id={`foodSubType-${index}-${contains}`}
                      name={`foodSubType-${index}`}
                      value={contains}
                      checked={type.contains.includes(contains)}
                      onChange={(event) =>
                        handleSubTypeChange(
                          index,
                          contains,
                          event.target.checked
                        )
                      }
                    />
                    <label htmlFor={`foodSubType-${index}-${contains}`}>
                      {t(`addRecipe.selectionOptions.${contains}`)}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {fieldErrors.foodType && (
          <div className={styles.error}>{fieldErrors.foodType}</div>
        )}

        <label className={styles.labelContainer}>
          {t("addRecipe.dietaryPreferences")}:
          <div className={styles.formElement}>
            <input
              type="checkbox"
              id="vegan"
              name="dietaryPreference"
              value="Vegan"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="vegan">{t("addRecipe.dietaryOptions.vegan")}</label>

            <input
              type="checkbox"
              id="vegetarian"
              name="dietaryPreference"
              value="Vegetarian"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="vegetarian">
              {t("addRecipe.dietaryOptions.vegetarian")}
            </label>

            <input
              type="checkbox"
              id="glutenFree"
              name="dietaryPreference"
              value="Gluten-free"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="glutenFree">
              {t("addRecipe.dietaryOptions.glutenFree")}
            </label>

            <input
              type="checkbox"
              id="dairyFree"
              name="dietaryPreference"
              value="Dairy-free"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="dairyFree">
              {t("addRecipe.dietaryOptions.dairyFree")}
            </label>

            <input
              type="checkbox"
              id="paleo"
              name="dietaryPreference"
              value="Paleo"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="paleo">{t("addRecipe.dietaryOptions.paleo")}</label>

            <input
              type="checkbox"
              id="keto"
              name="dietaryPreference"
              value="Keto"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="keto">{t("addRecipe.dietaryOptions.keto")}</label>

            <input
              type="checkbox"
              id="lowCarb"
              name="dietaryPreference"
              value="Low-carb"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="lowCarb">
              {t("addRecipe.dietaryOptions.lowCarb")}
            </label>

            <input
              type="checkbox"
              id="lowFat"
              name="dietaryPreference"
              value="Low-fat"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="lowFat">
              {t("addRecipe.dietaryOptions.lowFat")}
            </label>

            <input
              type="checkbox"
              id="lowSodium"
              name="dietaryPreference"
              value="Low-sodium"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="lowSodium">
              {t("addRecipe.dietaryOptions.lowSodium")}
            </label>

            <input
              type="checkbox"
              id="sugarFree"
              name="dietaryPreference"
              value="Sugar-free"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="lowSugar">
              {t("addRecipe.dietaryOptions.lowSugar")}
            </label>

            <input
              type="checkbox"
              id="lactoseIntolerant"
              name="dietaryPreference"
              value="Lactose-intolerant"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="lactoseIntolerant">
              {t("addRecipe.dietaryOptions.lactoseIntolerant")}
            </label>

            <input
              type="checkbox"
              id="eggFree"
              name="dietaryPreference"
              value="Egg-free"
              onChange={handleDietaryPreferencesChange}
            />
            <label htmlFor="eggFree">
              {t("addRecipe.dietaryOptions.eggFree")}
            </label>
          </div>
          {fieldErrors.dietaryPreferences && (
            <div className={styles.error}>{fieldErrors.dietaryPreferences}</div>
          )}
        </label>

        <label className={styles.labelContainer}>
          {t("addRecipe.mealType")}:
          <select
            value={foodCategory.mealType}
            onChange={handleMealTypeChange}
            className={styles.categorySelect}
            onBlur={(event) => handleBlur(event, "foodCategory.mealType")}
          >
            {foodCategory.mealType === "" && (
              <option value="">{t("addRecipe.options.selectMealType")}</option>
            )}
            <option value="Dessert">{t("addRecipe.options.dessert")}</option>
            <option value="Main Course">
              {t("addRecipe.options.main-course")}
            </option>
            <option value="Appetizer">
              {t("addRecipe.options.appetizer")}
            </option>
            <option value="Breakfast">
              {t("addRecipe.options.breakfast")}
            </option>
            <option value="Side Dish">
              {t("addRecipe.options.side-dish")}
            </option>
          </select>
          {fieldErrors.foodCategory?.mealType && (
            <div className={styles.error}>
              {fieldErrors.foodCategory.mealType}
            </div>
          )}
        </label>
        <label className={styles.labelContainer}>
          {t("addRecipe.type")}:
          <select
            value={foodCategory.type}
            onChange={(event) =>
              setFoodCategory((prev) => ({
                ...prev,
                type: event.target.value,
              }))
            }
            className={styles.categorySelect}
            onBlur={(event) => handleBlur(event, "foodCategory.type")}
          >
            {foodCategory.type === "" && (
              <option value="">{t("addRecipe.options.selectType")}</option>
            )}
            <option value="Pizza">{t("addRecipe.options.pizza")}</option>
            <option value="Pasta">{t("addRecipe.options.pasta")}</option>
            <option value="Beverage">{t("addRecipe.options.beverage")}</option>
            <option value="Salad">{t("addRecipe.options.salad")}</option>
            <option value="Soup">{t("addRecipe.options.Soup")}</option>
            <option value="Snack">{t("addRecipe.options.snack")}</option>
            <option value="Bread">{t("addRecipe.options.bread")}</option>
          </select>
          {fieldErrors.foodCategory?.type && (
            <div className={styles.error}>{fieldErrors.foodCategory.type}</div>
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
                onBlur={(event) => handleBlur(event, "ingredient")}
                maxLength="50"
              />
              {fieldErrors.ingredient && (
                <div className={styles.error}>{fieldErrors.ingredient}</div>
              )}
            </label>

            <label className={styles.labelContainer}>
              {t("addRecipe.ingredients.amount")}:
              <input
                type="text"
                value={ingredient.quantity}
                onChange={(event) =>
                  handleIngredientChange(index, "quantity", event.target.value)
                }
                maxLength="50"
                onBlur={(event) => {
                  handleBlur(event, "ingredients[" + index + "]");
                  setDisplayUnits(false);
                }}
                onFocus={() => setDisplayUnits(true)}
              />
              {amountErrors[index] && (
                <div className={styles.error}>{amountErrors[index]}</div>
              )}
            </label>

            <label className={styles.labelContainer}>
              {t("addRecipe.ingredients.unitLabel")}:
              <select
                value={ingredient.unit}
                onChange={(event) =>
                  handleIngredientChange(index, "unit", event.target.value)
                }
                className={styles.unitSelect}
              >
                {ingredient.unit === "" && (
                  <option value="">
                    {t("addRecipe.ingredients.unit.unitSelection")}
                  </option>
                )}
                <option value="g">{t("addRecipe.ingredients.unit.g")}</option>
                <option value="kg">{t("addRecipe.ingredients.unit.kg")}</option>
                <option value="oz">{t("addRecipe.ingredients.unit.oz")}</option>
                <option value="lb">{t("addRecipe.ingredients.unit.lb")}</option>
                <option value="dl">{t("addRecipe.ingredients.unit.dl")}</option>
                <option value="ml">{t("addRecipe.ingredients.unit.ml")}</option>
                <option value="l">{t("addRecipe.ingredients.unit.l")}</option>
                <option value="tbsp">
                  {t("addRecipe.ingredients.unit.tbsp")}
                </option>
                <option value="tsp">
                  {t("addRecipe.ingredients.unit.tsp")}
                </option>
                <option value="cup">
                  {t("addRecipe.ingredients.unit.cup")}
                </option>
                <option value="piece">
                  {t("addRecipe.ingredients.unit.piece")}
                </option>
              </select>
              {fieldErrors.unit && (
                <div className={styles.error}>{fieldErrors.unit}</div>
              )}
            </label>

            {error && <div className={styles.error}>{error}</div>}
            <button
              type="button"
              className={styles.addButton}
              onClick={addIngredient}
            >
              {t("addRecipe.ingredients.add")}
            </button>

            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className={`${styles.button} ${styles.removeButton}`}
            >
              {t("addRecipe.ingredients.remove")}
            </button>
          </div>
        ))}

        <h2>{t("addRecipe.instructions.title")}</h2>
        {instructions.map((instruction, index) => (
          <div key={index}>
            <label className={styles.labelContainer}>
              {t("addRecipe.instructions.instruction")} {index + 1}:
              <input
                type="text"
                value={instruction}
                onChange={(event) => handleInstructionChange(event, index)}
                onBlur={(event) => handleBlur(event, "instruction")}
                maxLength="60"
              />
              {fieldErrors.instruction && (
                <div className={styles.error}>{fieldErrors.instruction}</div>
              )}
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
      <button
        type="button"
        onClick={handleClick}
        className={styles.returnButton}
      >
        {t("addRecipe.backtoRecipes")}
      </button>
    </div>
  );
};

export default AddRecipe;
