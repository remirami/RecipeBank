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
  const [ingredientGroups, setIngredientGroups] = useState([
    { title: "", ingredients: [{ name: "", quantity: "", unit: "" }] },
  ]);
  const [instructions, setInstructions] = useState([]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [foodType, setFoodType] = useState([{ mainType: "", contains: [] }]);
  const [dietaryPreference, setDietaryPreference] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [amountErrors, setAmountErrors] = useState([]);
  const [ingredientNameErrors, setIngredientNameErrors] = useState([]);
  const [ingredientQuantityErrors, setIngredientQuantityErrors] = useState([]);
  const [displayUnits, setDisplayUnits] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    foodCategory: {
      mealType: "",
      type: "",
    },
    ingredientGroups: [
      {
        title: "",
        ingredients: [
          {
            name: "",
            quantity: "",
            unit: "",
          },
        ],
      },
    ],
    foodType: "",
    prepTime: "",
    cookTime: "",
    dietaryPreference: [""],
    instructions: "",
  });
  const [error, setError] = useState("");
  // state variable to track if there are unsaved changes
  const [isBlocking, setIsBlocking] = useState(false);

  function validateNotEmpty(field) {
    if (
      field === undefined ||
      (typeof field === "string" && field.trim() === "")
    ) {
      return t("Field is required");
    }
    return "";
  }
  const validateServingSize = (value) => {
    if (!value) {
      return null; // Field is optional
    }
    if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
      return t("addRecipe.errors.servingSizeInvalid");
    }
    return null;
  };
  const validateName = (value) => {
    return validateNotEmpty(value);
  };

  const validateDescription = (value) => {
    return validateNotEmpty(value);
  };

  const validateMealType = (value) => {
    return validateNotEmpty(value);
  };

  const validateIngredientGroups = (groups) => {
    const errors = [];
    let totalIngredients = 0;
    groups.forEach((group, groupIndex) => {
      let groupErrors = {};
      if (group.title !== undefined && group.title.trim() !== "") {
        groupErrors.title = validateNotEmpty(group.title);
      }
      group.ingredients.forEach((ingredient, index) => {
        let ingredientErrors = {};
        ingredientErrors.name = validateNotEmpty(ingredient.name);
        ingredientErrors.quantity = validateNotEmpty(ingredient.quantity);
        if (ingredientErrors.name || ingredientErrors.quantity) {
          groupErrors.ingredients = groupErrors.ingredients || [];
          groupErrors.ingredients[index] = ingredientErrors;
        }
      });
      if (groupErrors.title || groupErrors.ingredients) {
        errors[groupIndex] = groupErrors;
      }
      totalIngredients += group.ingredients.length;
    });
    if (totalIngredients > 30) {
      errors.maxIngredients = t("addRecipe.errors.maxIngredients");
    }
    return errors.length ? errors : null;
  };

  const validateInstructions = (instructions) => {
    const errors = [];
    instructions.forEach((instruction, index) => {
      const error = validateNotEmpty(instruction);
      if (error) {
        errors[index] = error;
      }
    });
    if (instructions.length > 30) {
      errors.maxInstructions = t("addRecipe.errors.maxInstructions");
    }
    return errors.length ? errors : null;
  };

  const validatePrepTime = (value) => {
    if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
      return t("addRecipe.errors.prepTimeInvalid");
    }
    return null;
  };

  const validateCookTime = (value) => {
    if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
      return t("addRecipe.errors.cookTimeInvalid");
    }
    return null;
  };

  const validateFoodType = (value) => {
    if (!value.length) {
      return t("addRecipe.errors.foodTypeRequired");
    }
    return null;
  };

  const validateUniqueInstructions = (instructions) => {
    const set = new Set(instructions);
    if (set.size !== instructions.length) {
      return t("addRecipe.errors.duplicateInstructions");
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    const newFieldErrors = {
      name: validateName(name),
      description: validateDescription(description),
      foodCategory: {
        mealType: validateMealType(foodCategory.mealType),
        type: null,
      },
      ingredientGroups: validateIngredientGroups(ingredientGroups),
      instructions: validateInstructions(instructions),
      prepTime: validatePrepTime(prepTime),
      cookTime: validateCookTime(cookTime),
      servingSize: validateServingSize(servingSize),
      foodType: validateFoodType(foodType),
      dietaryPreference: null,
    };

    newFieldErrors.instructions = validateUniqueInstructions(instructions);

    if (
      newFieldErrors.servingSize ||
      newFieldErrors.ingredientGroups ||
      newFieldErrors.instructions ||
      newFieldErrors.prepTime ||
      newFieldErrors.cookTime ||
      newFieldErrors.foodType ||
      newFieldErrors.name ||
      newFieldErrors.description ||
      newFieldErrors.foodCategory.mealType
    ) {
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
      ingredientGroups: ingredientGroups.map((group) => ({
        title: group.title,
        ingredients: group.ingredients.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
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

  const handleMealTypeChange = (event) => {
    setFoodCategory({
      ...foodCategory, // Preserve the other properties of foodCategory
      mealType: event.target.value, // Update mealType with the new value
    });
  };
  const handleIngredientChange = (groupIndex, index, field, value) => {
    setError("");
    const newIngredientGroups = [...ingredientGroups]; // Create a copy of ingredientGroups
    let ingredient = { ...newIngredientGroups[groupIndex].ingredients[index] }; // Create a copy of specific ingredient

    // Update ingredient fields based on the field type
    if (field === "quantity") {
      // Quantity must be a positive number
      if (Number(value) >= 0) {
        ingredient.quantity = value;
      } else {
        // Set an error message if the quantity is not a positive number
        setError(t("addRecipe.errors.quanPositive"));
      }
    } else if (field === "name") {
      ingredient.name = value;
    } else if (field === "unit") {
      ingredient.unit = value;
    }

    newIngredientGroups[groupIndex].ingredients[index] = ingredient;
    setIngredientGroups(newIngredientGroups);
  };
  let navigate = useNavigate();

  const handleClick = () => {
    navigate("/recipes");
  };
  const handleGroupTitleChange = (groupIndex, value) => {
    const newIngredientGroups = [...ingredientGroups];
    newIngredientGroups[groupIndex].title = value;
    setIngredientGroups(newIngredientGroups);
  };
  const addIngredientGroup = () => {
    if (ingredientGroups.length >= 30) {
      setError(t("addRecipe.errors.maxIngredientGroups"));
      return;
    }
    setError("");
    setIngredientGroups([
      ...ingredientGroups,
      { title: "", ingredients: [{ name: "", quantity: "", unit: "" }] },
    ]);
  };

  const addIngredient = (groupIndex) => {
    const newIngredientGroups = [...ingredientGroups];
    newIngredientGroups[groupIndex].ingredients.push({
      name: "",
      quantity: "",
      unit: "g",
    });
    setIngredientGroups(newIngredientGroups);
  };

  // Function to remove an entire ingredient group
  const removeIngredientGroup = (groupIndex) => {
    if (ingredientGroups.length === 1) {
      setError(t("addRecipe.errors.atLeastOneIngredientGroup"));
      return;
    }
    setIngredientGroups(ingredientGroups.filter((_, i) => i !== groupIndex));
  };

  // Function to remove a specific ingredient from a specific group
  const removeIngredient = (groupIndex, index) => {
    if (ingredientGroups[groupIndex].ingredients.length === 1) {
      setError(t("addRecipe.errors.atLeastOneIngredient"));
      return;
    }
    const newIngredientGroups = [...ingredientGroups];
    newIngredientGroups[groupIndex].ingredients = newIngredientGroups[
      groupIndex
    ].ingredients.filter((_, i) => i !== index);
    setIngredientGroups(newIngredientGroups);
    setAmountErrors(amountErrors.filter((_, i) => i !== index));
  };
  const handleInstructionChange = (event, index) => {
    const newInstructions = [...instructions];
    newInstructions[index] = event.target.value;
    setInstructions(newInstructions);
  };
  const handleBlur = (
    event,
    field,
    groupIndex = null,
    ingredientIndex = null
  ) => {
    const value = event.target.value;
    let error = "";

    if (field.startsWith("ingredientGroups") && groupIndex !== null) {
      const subField = field.split(".")[1];

      if (subField === "ingredients" && ingredientIndex !== null) {
        const ingredientField = field.split(".")[2];

        if (
          (ingredientField === "name" || ingredientField === "quantity") &&
          value.trim() === ""
        ) {
          error = t("addRecipe.errors.fieldEmpty");
        }

        if (ingredientField === "name") {
          // update ingredient name errors
          setIngredientNameErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            if (!newErrors[groupIndex]) {
              newErrors[groupIndex] = [];
            }
            newErrors[groupIndex][ingredientIndex] = error;
            return newErrors;
          });
        } else if (ingredientField === "quantity") {
          // update ingredient quantity errors
          setIngredientQuantityErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            if (!newErrors[groupIndex]) {
              newErrors[groupIndex] = [];
            }
            newErrors[groupIndex][ingredientIndex] = error;
            return newErrors;
          });
        }
      }
    } else if (field === "instructions") {
      if (!Array.isArray(value) || value.length === 0) {
        error = t("addRecipe.errors.fieldEmpty");
      }

      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: error,
      }));
    } else if (value.trim() === "") {
      if (field === "category" || field === "foodType") {
        error = t("addRecipe.errors.selectValue");
      } else if (
        field === "foodCategory.mealType" ||
        field === "foodCategory.type"
      ) {
        error = t("addRecipe.errors.foodCategory");
      } else {
        error = t("addRecipe.errors.fieldEmpty");
      }

      if (field.startsWith("foodCategory.")) {
        const subField = field.split(".")[1];
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          foodCategory: {
            ...prevErrors.foodCategory,
            [subField]: error,
          },
        }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: error,
        }));
      }
    } else if (
      (field === "prepTime" || field === "cookTime") &&
      (!Number.isInteger(Number(value)) || Number(value) <= 0)
    ) {
      error = t("addRecipe.errors.positiveInteger");

      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: error,
      }));
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
                  <div className={styles.checkboxLabel} key={contains}>
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
          <div className={`${styles.formElement} ${styles.checkboxGroup}`}>
            <div className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="vegan"
                name="dietaryPreference"
                value="Vegan"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="vegan">
                {t("addRecipe.dietaryOptions.vegan")}
              </label>
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="paleo"
                name="dietaryPreference"
                value="Paleo"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="paleo">
                {t("addRecipe.dietaryOptions.paleo")}
              </label>
            </div>
            <div className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="keto"
                name="dietaryPreference"
                value="Keto"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="keto">{t("addRecipe.dietaryOptions.keto")}</label>
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="sugarFree"
                name="dietaryPreference"
                value="Sugar-free"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="sugarFree">
                {t("addRecipe.dietaryOptions.sugarFree")}
              </label>
            </div>
            <div className={styles.checkboxLabel}>
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
            </div>
            <div className={styles.checkboxLabel}>
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
          </div>
          {fieldErrors.dietaryPreference && (
            <div className={styles.error}>{fieldErrors.dietaryPreference}</div>
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
            <option value="Bread">{t("addRecipe.options.bake")}</option>
            <option value="Bread">{t("addRecipe.options.pie")}</option>
            <option value="Bread">{t("addRecipe.options.pastry")}</option>
            <option value="Bread">{t("addRecipe.options.cake")}</option>

            <option value="Other">{t("addRecipe.options.other")}</option>
          </select>
          {fieldErrors.foodCategory?.type && (
            <div className={styles.error}>{fieldErrors.foodCategory.type}</div>
          )}
        </label>
        <h2>{t("addRecipe.ingredients.title")}</h2>
        {ingredientGroups.map((ingredientGroup, groupIndex) => (
          <div key={groupIndex}>
            <label className={styles.labelContainer}>
              {t("addRecipe.groupTitle")}:
              <input
                type="text"
                placeholder="Optional"
                value={ingredientGroup.title}
                className={styles.ingredientStyle}
                onChange={(event) =>
                  handleGroupTitleChange(groupIndex, event.target.value)
                }
                maxLength="50"
              />
            </label>
            {ingredientGroup.ingredients.map((ingredient, index) => (
              <div key={index}>
                <label className={styles.labelContainer}>
                  {t("addRecipe.name")}:
                  <input
                    type="text"
                    value={ingredient.name}
                    className={styles.ingredientStyle}
                    onChange={(event) =>
                      handleIngredientChange(
                        groupIndex,
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    maxLength="50"
                    onBlur={(event) =>
                      handleBlur(
                        event,
                        "ingredientGroups.ingredients.name",
                        groupIndex,
                        index
                      )
                    }
                  />
                  {ingredientNameErrors[groupIndex] &&
                    ingredientNameErrors[groupIndex][index] && (
                      <div className={styles.error}>
                        {ingredientNameErrors[groupIndex][index]}
                      </div>
                    )}
                </label>

                <label className={styles.labelContainer}>
                  {t("addRecipe.ingredients.amount")}:
                  <input
                    type="text"
                    value={ingredient.quantity}
                    className={styles.ingredientStyle}
                    onChange={(event) =>
                      handleIngredientChange(
                        groupIndex,
                        index,
                        "quantity",
                        event.target.value
                      )
                    }
                    maxLength="50"
                    onBlur={(event) => {
                      handleBlur(
                        event,
                        "ingredientGroups.ingredients.quantity",
                        groupIndex,
                        index
                      );
                      setDisplayUnits(false);
                    }}
                    onFocus={() => setDisplayUnits(true)}
                  />
                  {ingredientQuantityErrors[groupIndex] &&
                    ingredientQuantityErrors[groupIndex][index] && (
                      <div className={styles.error}>
                        {ingredientQuantityErrors[groupIndex][index]}
                      </div>
                    )}
                </label>
                <select
                  id={`ingredient-unit-${index}`}
                  value={ingredient.unit}
                  className={styles.ingredientStyle}
                  onChange={(e) =>
                    handleIngredientChange(
                      groupIndex,
                      index,
                      "unit",
                      e.target.value
                    )
                  }
                >
                  {ingredient.unit === "" && (
                    <option value="">
                      {t("editRecipe.ingredients.unit.unitSelection")}
                    </option>
                  )}
                  <option value="g">
                    {t("editRecipe.ingredients.unit.g")}
                  </option>
                  <option value="kg">
                    {t("editRecipe.ingredients.unit.kg")}
                  </option>
                  <option value="oz">
                    {t("editRecipe.ingredients.unit.oz")}
                  </option>
                  <option value="lb">
                    {t("editRecipe.ingredients.unit.lb")}
                  </option>
                  <option value="dl">
                    {t("editRecipe.ingredients.unit.dl")}
                  </option>
                  <option value="ml">
                    {t("editRecipe.ingredients.unit.ml")}
                  </option>
                  <option value="l">
                    {t("editRecipe.ingredients.unit.l")}
                  </option>
                  <option value="tbsp">
                    {t("editRecipe.ingredients.unit.tbsp")}
                  </option>
                  <option value="tsp">
                    {t("editRecipe.ingredients.unit.tsp")}
                  </option>
                  <option value="cup">
                    {t("editRecipe.ingredients.unit.cup")}
                  </option>
                  <option value="piece">
                    {t("editRecipe.ingredients.unit.piece")}
                  </option>
                  <option value="clove">
                    {t("editRecipe.ingredients.unit.clove")}
                  </option>
                  <option value="gallon">
                    {t("editRecipe.ingredients.unit.gallon")}
                  </option>
                  <option value="fluidounce">
                    {t("editRecipe.ingredients.unit.fluidounce")}
                  </option>
                  <option value="bunch">
                    {t("editRecipe.ingredients.unit.bunch")}
                  </option>
                  <option value="can">
                    {t("editRecipe.ingredients.unit.can")}
                  </option>
                </select>
                {error && <div className={styles.error}>{error}</div>}
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => addIngredient(groupIndex)}
                >
                  {t("addRecipe.ingredients.add")}
                </button>

                <button
                  type="button"
                  onClick={() => removeIngredient(groupIndex, index)}
                  className={`${styles.button} ${styles.removeButton}`}
                >
                  {t("addRecipe.ingredients.remove")}
                </button>
              </div>
            ))}

            <button
              type="button"
              className={styles.addButton}
              onClick={addIngredientGroup}
            >
              {t("addRecipe.ingredients.addGroup")}
            </button>

            {ingredientGroups.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredientGroup(groupIndex)}
                className={`${styles.button} ${styles.removeButton}`}
              >
                {t("addRecipe.ingredients.removeGroup")}
              </button>
            )}
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
                maxLength="80"
              />
              {fieldErrors.instructions && (
                <div className={styles.error}>{fieldErrors.instructions}</div>
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
