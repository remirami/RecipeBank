import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateRecipe } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./EditRecipe.module.css";

const EditRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredientGroups, setIngredientGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [foodCategory, setFoodCategory] = useState({ mealType: "", type: "" });
  const [servingSize, setServingSize] = useState("");

  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "g" },
  ]);
  const [instructions, setInstructions] = useState([]);
  const [dietaryPreference, setDietaryPreference] = useState([]);
  const [foodType, setFoodType] = useState([{ mainType: "", subType: [] }]);
  const [cookTime, setCookTime] = useState("");
  const [prepTime, setPrepTime] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    foodCategory: {
      mealType: "",
      type: "",
    },
    ingredients: "",
    instructions: "",
    dietaryPreference: "",
    foodType: "",
    prepTime: "",
    cookTime: "",
  });
  const foodSubTypes = {
    "Red Meat & Ground Meat": ["Red Meat", "Ground Meat"],
    "Fish & Seafood": ["Fish", "Seafood"],
    "Dairy & Eggs": ["Dairy", "Eggs"],
    "Chicken & Poultry": ["Chicken", "Poultry"],
    "Fruits & Berries": ["Fruit", "Berries"],
    "Marinades & Sauces": ["Marinade", "Sauce"],
    "Grains & Rice": ["Grain", "Rice"],
    Sausage: ["Sausage"],
  };

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [amountErrors, setAmountErrors] = useState([]);
  const [displayUnits, setDisplayUnits] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);

        // Check if the user is the owner of the recipe
        if (
          localStorage.getItem("userId") !== data.user_id._id &&
          localStorage.getItem("isAdmin") !== "true"
        ) {
          setError("You do not have permission to edit this recipe.");
          return;
        }
        setDietaryPreference(data.dietaryPreference || "");
        setCookTime(data.cookTime || "");
        setPrepTime(data.prepTime || "");
        setFoodType(data.foodType || [{ mainType: "", subType: [] }]);
        setServingSize(data.servingSize || "");
        setRecipe(data);
        setName(data.name);
        setDescription(data.description);

        setInstructions(data.instructions || []);
        setFoodCategory({
          mealType: data.foodCategory.mealType || "",
          type: data.foodCategory.type || "",
        });
        if (data && data.ingredientGroups) {
          setIngredientGroups(data.ingredientGroups);
          setIngredients(data.ingredientGroups[0]?.ingredients || []);
        }
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  // Helper function to validate non-empty fields
  function validateNotEmpty(field) {
    if (typeof field === "string" && field.trim() === "") {
      return t("editRecipe.validation.fieldRequired");
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
      foodCategory: { mealType: "", type: "" },
      ingredientGroups: [{ title: "", ingredients: "" }],
      instructions: "",
      prepTime: "",
      cookTime: "",
      servingSize: "",
      foodType: "",
      dietaryPreference: "",
    };
    // Initialize error object for each ingredient group
    ingredientGroups.forEach((group, groupIndex) => {
      newFieldErrors.ingredientGroups[groupIndex] = {
        title: "",
        ingredients: [],
      };
      group.ingredients.forEach((ingredients, ingredientIndex) => {
        newFieldErrors.ingredientGroups[groupIndex].ingredients[
          ingredientIndex
        ] = {
          name: "",
          quantity: "",
        };
      });
    });
    // Initialize error object for each ingredient group
    ingredientGroups.forEach((_, groupIndex) => {
      newFieldErrors.ingredientGroups[groupIndex] = {
        title: "",
        ingredients: [],
      };
    });
    // Validate name, description and category
    newFieldErrors.name = validateNotEmpty(name);
    newFieldErrors.description = validateNotEmpty(description);
    newFieldErrors.foodCategory.mealType = validateNotEmpty(
      foodCategory.mealType
    );
    newFieldErrors.foodCategory.type = validateNotEmpty(foodCategory.type);
    if (ingredients.length > 30) {
      newFieldErrors.ingredients = "You can add up to 30 ingredients only.";
      isValid = false;
    }

    // Validate ingredient groups
    ingredientGroups.forEach((group, groupIndex) => {
      group.ingredients.forEach((ingredient, ingredientIndex) => {
        if (ingredient.name.trim() === "") {
          newFieldErrors.ingredientGroups[groupIndex].ingredients[
            ingredientIndex
          ] = "Ingredient name is required.";
          isValid = false;
        }
        if (ingredient.quantity.trim() === "") {
          newFieldErrors.ingredientGroups[groupIndex].ingredients[
            ingredientIndex
          ] = "Ingredient quantity is required.";
          isValid = false;
        }
      });
    });
    if (instructions.length > 30) {
      newFieldErrors.instructions = "You can add up to 30 instructions only.";
      isValid = false;
    }

    instructions.forEach((instruction, index) => {
      const instructionError = validateNotEmpty(
        instruction,
        `Instruction at index ${index}`
      );

      if (instructionError) {
        newFieldErrors.instructions = instructionError;
        isValid = false;
      }
    });

    if (servingSize) {
      // Only validate if servingSize is not empty
      if (Number(servingSize) <= 0) {
        newFieldErrors.servingSize = t("editRecipe.errors.servingSizeInvalid");
        isValid = false;
      }
    }

    if (!Array.isArray(foodType)) {
      newFieldErrors.foodType = "Food type must be an array";
      isValid = false;
    } else {
      for (let i = 0; i < foodType.length; i++) {
        if (
          typeof foodType[i].mainType !== "string" ||
          foodType[i].mainType.trim() === "" ||
          !Array.isArray(foodType[i].subType) ||
          foodType[i].subType.length === 0
        ) {
          newFieldErrors.foodType = t("editRecipe.errors.invalidFoodType");
          isValid = false;
          break;
        }
      }
    }
    // Validate prepTime
    if (!validateTime(prepTime) || Number(prepTime) <= 0) {
      newFieldErrors.prepTime = t("editRecipe.errors.prepTimeInvalid");
      isValid = false;
    }
    // Validate cookTime
    if (!validateTime(cookTime) || Number(cookTime) <= 0) {
      newFieldErrors.cookTime = t("editRecipe.errors.cookTimeInvalid");
      isValid = false;
    }

    setFieldErrors(newFieldErrors);

    if (!isValid) {
      // Show validation error messages and prevent the submission
      return;
    }

    const userId = localStorage.getItem("userId") || null;

    if (!userId) {
      console.error("User is not logged in");
      setError("You must be logged in to add a recipe.");
      return;
    }
    const recipe = {
      name,
      description,
      foodCategory,
      ingredientGroups,
      instructions,
      dietaryPreference,
      foodType,
      prepTime,
      cookTime,
      servingSize,
      user_id: localStorage.getItem("userId"),
    };

    console.log("Submitting updated recipe:", recipe);

    try {
      const response = await updateRecipe(id, recipe);
      setError(""); // Clear the error message after successful update
      setSuccessMessage("Recipe updated successfully!");
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError(error.message || "Error updating recipe. Please try again.");
    }
  };
  const validateAmount = (value) => {
    // Check if value is a positive floating-point number or zero
    const regex = /^\d*\.?\d+$/;
    const isValid = regex.test(value);
    return isValid;
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
  const removeIngredientGroup = (groupIndex) => {
    if (ingredientGroups.length === 1) {
      setError(t("addRecipe.errors.atLeastOneIngredientGroup"));
      return;
    }
    setIngredientGroups(ingredientGroups.filter((_, i) => i !== groupIndex));
  };
  const handleDietaryPreferencesChange = (event) => {
    const value = event.target.value;
    setDietaryPreference((prev) =>
      prev.includes(value)
        ? prev.filter((preference) => preference !== value)
        : [...prev, value]
    );
  };

  const validations = {
    ingredients: validateArrayField,
    instructions: validateArrayField,
    category: validateSelection,
    foodType: validateSelection,
    "foodCategory.mealType": validateFoodCategorySelection,
    "foodCategory.type": validateFoodCategorySelection,
    servingSize: validateServingSize,
  };

  function validateField(field, value) {
    if (validations[field]) {
      return validations[field](value);
    }
    if (value.trim() === "") {
      return "This field cannot be empty.";
    }
    return "";
  }

  function validateArrayField(value) {
    return !Array.isArray(value) || value.length === 0
      ? "This field cannot be empty."
      : "";
  }

  function validateSelection(value) {
    return value.trim() === "" ? "Please select a value." : "";
  }

  function validateFoodCategorySelection(value) {
    return value.trim() === "" ? "Please select a food category." : "";
  }

  function validateServingSize(value) {
    return Number(value) <= 0 || Number(value) > 100
      ? "Serving size must be a positive number and not exceed 100."
      : "";
  }

  const handleBlur = (event, field) => {
    const value = event.target.value;
    const error = validateField(field, value);

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

  const addIngredient = (groupIndex) => {
    const newIngredientGroups = [...ingredientGroups];
    newIngredientGroups[groupIndex].ingredients.push({
      name: "",
      quantity: "",
      unit: "g",
    });
    setIngredientGroups(newIngredientGroups);
  };
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

  const handleRemoveInstruction = (index) => {
    if (instructions.length === 1) {
      setError("You must have atleast one instruction.");
      return;
    }
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };
  const validateTime = (time) => {
    const re = /^[0-9]*$/;
    return re.test(String(time));
  };
  const handlePrepTimeChange = (e) => {
    const time = parseInt(e.target.value, 10);
    if (!isNaN(time) && /^[0-9]*$/.test(time)) {
      setPrepTime(time);
    }
  };

  const handleMainFoodTypeChange = (index, event) => {
    const newFoodTypes = [...foodType];
    newFoodTypes[index].mainType = event.target.value;
    setFoodType(newFoodTypes);
  };

  const handleSubTypeChange = (index, subType, isChecked) => {
    const newFoodType = [...foodType];
    if (!newFoodType[index].subType) {
      newFoodType[index].subType = [];
    }
    if (isChecked) {
      newFoodType[index].subType.push(subType);
    } else {
      const subTypeIndex = newFoodType[index].subType.indexOf(subType);
      if (subTypeIndex > -1) {
        newFoodType[index].subType.splice(subTypeIndex, 1);
      }
    }
    setFoodType(newFoodType);
  };
  const handleCookTimeChange = (e) => {
    const time = parseInt(e.target.value, 10);
    if (!isNaN(time) && /^[0-9]*$/.test(time)) {
      setCookTime(time);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>{t("editRecipe.title")}</h2>
        <form onSubmit={handleSubmit} className={styles.formElement}>
          <label htmlFor="name">{t("editRecipe.name")}</label>
          <input
            className={styles.inputField}
            type="text"
            value={name}
            onBlur={(event) => handleBlur(event, "name")}
            onChange={(e) => setName(e.target.value)}
            maxLength="50"
          />
          <div className={styles.error}>{fieldErrors.name}</div>
          <label htmlFor="description">{t("editRecipe.description")}</label>
          <input
            className={styles.inputField}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="400"
            placeholder="(Optional)"
          />
          <label htmlFor="prepTime">{t("editRecipe.prepTime")}</label>
          <input
            className={styles.inputField}
            type="number"
            id="prepTime"
            value={prepTime}
            onBlur={(event) => handleBlur(event, "prepTime")}
            onChange={handlePrepTimeChange}
          />
          {fieldErrors.prepTime && (
            <div className={styles.error}>{fieldErrors.prepTime}</div>
          )}
          <label htmlFor="cookTime">{t("editRecipe.cookTime")}</label>
          <input
            className={styles.inputField}
            type="number"
            id="cookTime"
            value={cookTime}
            onBlur={(event) => handleBlur(event, "cookTime")}
            onChange={handleCookTimeChange}
          />
          {fieldErrors.cookTime && (
            <div className={styles.error}>{fieldErrors.cookTime}</div>
          )}
          <label className={styles.labelContainer}>
            {t("addRecipe.servingSize")}:
            <input
              type="number"
              value={servingSize}
              onChange={(event) => setServingSize(event.target.value)}
              className={styles.inputField}
              placeholder="(Optional)"
              max="50"
            />
            {fieldErrors.servingSize && (
              <div className={styles.error}>{fieldErrors.servingSize}</div>
            )}
          </label>
          {foodType.map((type, index) => (
            <div key={index}>
              <label className={styles.labelContainer}>
                {t("editRecipe.foodType")}:
                <select
                  value={type.mainType}
                  onChange={(event) => handleMainFoodTypeChange(index, event)}
                  onBlur={(event) => handleBlur(event, "foodType")}
                  className={styles.foodTypeSelect}
                >
                  <option value="">
                    {t("editRecipe.options.selectFoodType")}
                  </option>
                  {Object.keys(foodSubTypes).map((type) => (
                    <option value={type} key={type}>
                      {t(`editRecipe.foodSubTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </label>
              {type.mainType && foodSubTypes[type.mainType] && (
                <label className={styles.labelContainer}>
                  {t("editRecipe.foodSubType")}:
                  <div className={styles.foodSubTypeSelect}>
                    {foodSubTypes[type.mainType].map((subType) => (
                      <label key={subType}>
                        <input
                          type="checkbox"
                          value={subType}
                          checked={
                            type.subType
                              ? type.subType.includes(subType)
                              : false
                          }
                          onChange={(event) =>
                            handleSubTypeChange(
                              index,
                              subType,
                              event.target.checked
                            )
                          }
                        />
                        {t(`editRecipe.foodSubTypeItems.${subType}`)}
                      </label>
                    ))}
                  </div>
                </label>
              )}
            </div>
          ))}
          {fieldErrors.foodType && (
            <div className={styles.error}>{fieldErrors.foodType}</div>
          )}
          <div className={styles.labelContainer}>
            <span>{t("editRecipe.dietaryPreferences")}:</span>
            <div className={styles.dietaryPreferencesSelect}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="vegan"
                  name="dietaryPreference"
                  value="Vegan"
                  checked={dietaryPreference.includes("Vegan")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="vegan">
                  {t("addRecipe.dietaryOptions.vegan")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="vegetarian"
                  name="dietaryPreference"
                  value="Vegetarian"
                  checked={dietaryPreference.includes("Vegetarian")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="vegetarian">
                  {t("addRecipe.dietaryOptions.vegetarian")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="glutenFree"
                  name="dietaryPreference"
                  value="Gluten-free"
                  checked={dietaryPreference.includes("Gluten-free")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="glutenFree">
                  {t("addRecipe.dietaryOptions.glutenFree")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="dairyFree"
                  name="dietaryPreference"
                  value="Dairy-free"
                  checked={dietaryPreference.includes("Dairy-free")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="dairyFree">
                  {t("addRecipe.dietaryOptions.dairyFree")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="paleo"
                  name="dietaryPreference"
                  value="Paleo"
                  checked={dietaryPreference.includes("Paleo")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="paleo">
                  {t("addRecipe.dietaryOptions.paleo")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="keto"
                  name="dietaryPreference"
                  value="Keto"
                  checked={dietaryPreference.includes("Keto")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="keto">
                  {t("addRecipe.dietaryOptions.keto")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="lowCarb"
                  name="dietaryPreference"
                  value="Low-carb"
                  checked={dietaryPreference.includes("Low-carb")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="lowCarb">
                  {t("addRecipe.dietaryOptions.lowCarb")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="lowFat"
                  name="dietaryPreference"
                  value="Low-fat"
                  checked={dietaryPreference.includes("Low-fat")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="lowFat">
                  {t("addRecipe.dietaryOptions.lowFat")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="lowSodium"
                  name="dietaryPreference"
                  value="Low-sodium"
                  checked={dietaryPreference.includes("Low-sodium")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="lowSodium">
                  {t("addRecipe.dietaryOptions.lowSodium")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="sugarFree"
                  name="dietaryPreference"
                  value="Sugar-free"
                  checked={dietaryPreference.includes("Sugar-free")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="sugarFree">
                  {t("addRecipe.dietaryOptions.sugarFree")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="lactoseIntolerant"
                  name="dietaryPreference"
                  value="Lactose-intolerant"
                  checked={dietaryPreference.includes("Lactose-intolerant")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="lactoseIntolerant">
                  {t("addRecipe.dietaryOptions.lactoseIntolerant")}
                </label>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="eggFree"
                  name="dietaryPreference"
                  value="Egg-free"
                  checked={dietaryPreference.includes("Egg-free")}
                  onChange={handleDietaryPreferencesChange}
                />
                <label htmlFor="eggFree">
                  {t("addRecipe.dietaryOptions.eggFree")}
                </label>
              </div>
            </div>
            {fieldErrors.dietaryPreference && (
              <div className={styles.error}>
                {fieldErrors.dietaryPreference}
              </div>
            )}
          </div>

          <label className={styles.labelContainer}>
            {t("editRecipe.mealType")}:
            <select
              value={foodCategory.mealType}
              onChange={(event) =>
                setFoodCategory((prev) => ({
                  ...prev,
                  mealType: event.target.value,
                }))
              }
              className={styles.categorySelect}
              onBlur={(event) => handleBlur(event, "foodCategory.mealType")}
            >
              {foodCategory.mealType === "" && (
                <option value="">
                  {t("editRecipe.options.selectMealType")}
                </option>
              )}
              <option value="Dessert">{t("editRecipe.options.dessert")}</option>
              <option value="Main Course">
                {t("editRecipe.options.main-course")}
              </option>
              <option value="Appetizer">
                {t("editRecipe.options.appetizer")}
              </option>
              <option value="Breakfast">
                {t("editRecipe.options.breakfast")}
              </option>
              <option value="Side Dish">
                {t("editRecipe.options.side-dish")}
              </option>
            </select>
            {fieldErrors.foodCategory?.mealType && (
              <div className={styles.error}>
                {fieldErrors.foodCategory.mealType}
              </div>
            )}
          </label>
          <label className={styles.labelContainer}>
            {t("editRecipe.type")}:
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
                <option value="">{t("editRecipe.options.selectType")}</option>
              )}
              <option value="Pizza">{t("editRecipe.options.pizza")}</option>
              <option value="Pasta">{t("editRecipe.options.pasta")}</option>
              <option value="Beverage">
                {t("editRecipe.options.beverage")}
              </option>
              <option value="Salad">{t("editRecipe.options.salad")}</option>
              <option value="Soup">{t("editRecipe.options.Soup")}</option>
              <option value="Snack">{t("editRecipe.options.snack")}</option>
              <option value="Bread">{t("editRecipe.options.bread")}</option>
              <option value="Bake">{t("editRecipe.options.bake")}</option>
              <option value="Pie">{t("editRecipe.options.pie")}</option>
              <option value="Pastry">{t("editRecipe.options.pastry")}</option>
              <option value="Cake">{t("editRecipe.options.cake")}</option>

              <option value="Other">{t("editRecipe.options.other")}</option>
            </select>
            {fieldErrors.foodCategory?.type && (
              <div className={styles.error}>
                {fieldErrors.foodCategory.type}
              </div>
            )}
          </label>
          <label htmlFor="ingredients">
            {t("editRecipe.ingredients.label")}
          </label>

          {ingredientGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.groupContainer}>
              <input
                type="text"
                value={group.title}
                onChange={(e) =>
                  handleGroupTitleChange(groupIndex, e.target.value)
                }
                placeholder={t("editRecipe.groupTitlePlaceholder")}
                className={styles.inputField}
              />
              {group.ingredients.map((ingredient, ingredientIndex) => (
                <div
                  key={ingredientIndex}
                  className={styles.ingredientContainer}
                >
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(
                        groupIndex,
                        ingredientIndex,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder={t("editRecipe.ingredientName")}
                    maxLength="50"
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(
                        groupIndex,
                        ingredientIndex,
                        "quantity",
                        e.target.value
                      )
                    }
                    placeholder={t("editRecipe.ingredientAmount")}
                    maxLength="30"
                    className={styles.inputField}
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(
                        groupIndex,
                        ingredientIndex,
                        "unit",
                        e.target.value
                      )
                    }
                    className={styles.selectField}
                  >
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
                  <button
                    type="button"
                    onClick={() =>
                      removeIngredient(groupIndex, ingredientIndex)
                    }
                    className={`${styles.button} ${styles.removeButton}`}
                  >
                    {t("editRecipe.removeIngredient")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addIngredient(groupIndex)}
                className={`${styles.button} ${styles.removeButton}`}
              >
                {t("editRecipe.addIngredient")}
              </button>
              {ingredientGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredientGroup(groupIndex)}
                  className={`${styles.button} ${styles.removeButton}`}
                >
                  {t("editRecipe.removeIngredientGroup")}
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredientGroup}
            className={`${styles.button} ${styles.removeButton}`}
          >
            {t("editRecipe.addIngredientGroup")}
          </button>
          <label htmlFor="instructions">{t("editRecipe.instructions")}</label>
          {instructions &&
            instructions.map((instruction, index) => (
              <div key={index}>
                <label htmlFor={`instruction-${index}`}>
                  {t("editRecipe.step", { number: index + 1 })}
                </label>
                <input
                  type="text"
                  id={`instruction-${index}`}
                  value={instruction}
                  maxLength="80"
                  onChange={(e) => {
                    const updatedInstructions = [...instructions];
                    updatedInstructions[index] = e.target.value;
                    setInstructions(updatedInstructions);
                  }}
                  className={`${styles.button}`}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveInstruction(index)}
                >
                  {t("editRecipe.removeInstruction")}
                </button>
              </div>
            ))}
          <div className={styles.error}>{fieldErrors.instructions}</div>
          <button
            className={styles.addButton}
            type="button"
            onClick={() => setInstructions([...instructions, ""])}
          >
            {t("editRecipe.addInstruction")}
          </button>
          <button type="submit" className={styles.submitButton}>
            {t("editRecipe.saveChanges")}
          </button>
          <button className={styles.cancelButton} onClick={() => navigate(-1)}>
            {t("editRecipe.cancel")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
