import React, { useState } from "react";
import { searchRecipes } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState("");
  const [includeLiked, setIncludeLiked] = useState(false);
  const [searchByUsername, setSearchByUsername] = useState(false);
  const [maxCookTime, setMaxCookTime] = useState(60);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [searchByLikes, setSearchByLikes] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [foodType, setFoodType] = useState("");
  const [subType, setSubType] = useState("");
  const foodSubTypes = {
    "Red Meat & Ground Meat": ["Red Meat", "Ground Meat"],
    "Fish & Seafood": ["Fish", "Seafood"],
    "Dairy & Eggs": ["Dairy", "Eggs"],
    "Chicken & Poultry": ["Chicken", "Poultry"],
    "Fruits & Berries": ["Fruit", "Berries"],
    "Marinades & Sauces": ["Marinade", "Sauce"],
    "Grains & Rice": ["Grain", "Rice"],
  };

  const { t } = useTranslation();

  const handleSearch = async () => {
    const response = await searchRecipes(
      searchTerm,
      selectedCategoryType,
      selectedMealType,
      searchByUsername,
      includeLiked,
      searchByLikes,
      foodType,
      subType,
      dietaryPreferences,
      maxCookTime
    );

    if (response && response.data && response.data.recipes) {
      setSearchResults(response.data.recipes);
    } else {
      console.error(
        "searchRecipes response does not contain data.recipes property",
        response
      );
      setSearchResults([]);
    }

    setSearchPerformed(true);
  };

  const handleMaxCookTimeChange = (e) => {
    const newMaxTime = Number(e.target.value);
    setMaxCookTime(newMaxTime);
  };
  const handleSearchInput = (event) => {
    let searchTerm = event.target.value;
    // Trim leading/trailing whitespace and convert to lowercase
    searchTerm = searchTerm.trim().toLowerCase();
    // Remove any special characters to prevent injection attacks
    searchTerm = searchTerm.replace(/[^a-z0-9 ]/gi, "");

    setSearchTerm(searchTerm);
  };
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleDietaryPreferencesChange = (event) => {
    const { value, checked } = event.target;

    setDietaryPreferences((prevPreferences) =>
      checked
        ? [...prevPreferences, value]
        : prevPreferences.filter((pref) => pref !== value)
    );
  };
  const resetSearch = () => {
    setSearchTerm("");
    setSelectedCategoryType("");
    setSearchByLikes(false);
    setFoodType("");
    setSubType("");
    setSelectedMealType("");
    setDietaryPreferences([]);
    setMaxCookTime(0);
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.searchHeading}>{t("search.search_recipes")}</h1>
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={t("search.search_placeholder")}
          value={searchTerm}
          onChange={handleSearchInput}
          onKeyDown={handleSearchKeyDown}
        />
        <select
          className={styles.searchSelect}
          value={selectedCategoryType}
          onChange={(event) => setSelectedCategoryType(event.target.value)}
        >
          <option value="">{t("search.options.selectCategory")}</option>
          <option value="Pizza">{t("search.options.Pizza")}</option>
          <option value="Pasta">{t("search.options.Pasta")}</option>
          <option value="Beverage">{t("search.options.Beverage")}</option>
          <option value="Salad">{t("search.options.Salad")}</option>
          <option value="Soup">{t("search.options.Soup")}</option>
          <option value="Snack">{t("search.options.Snack")}</option>
          <option value="Bread">{t("search.options.Bread")}</option>
          <option value="Cake">{t("search.options.Cake")}</option>
          <option value="Pie">{t("search.options.Pie")}</option>
          <option value="Pastry">{t("search.options.Pastry")}</option>
          <option value="Bake">{t("search.options.Bake")}</option>
          <option value="Other">{t("search.options.Other")}</option>
        </select>
        <select
          className={styles.searchSelect}
          value={selectedMealType}
          onChange={(event) => setSelectedMealType(event.target.value)}
        >
          <option value="">{t("search.options.selectMealType")}</option>
          <option value="Dessert">{t("search.options.Dessert")}</option>
          <option value="Main Course">{t("search.options.Main Course")}</option>
          <option value="Appetizer">{t("search.options.Appetizer")}</option>
          <option value="Breakfast">{t("search.options.Breakfast")}</option>
          <option value="Side Dish">{t("search.options.Side Dish")}</option>
        </select>
        <select
          className={styles.searchSelect}
          value={foodType}
          onChange={(event) => {
            setFoodType(event.target.value);
            setSubType(""); // Reset subType when foodType changes
          }}
        >
          <option value="">{t("search.options.selectFoodType")}</option>
          <option value="Vegetable">{t("search.options.Vegetable")}</option>
          <option value="Red Meat & Ground Meat">
            {t("search.options.Red Meat & Ground Meat")}
          </option>
          <option value="Marinades & Sauces">
            {t("search.options.Marinades & Sauces")}
          </option>
          <option value="Fish & Seafood">
            {t("search.options.Fish & Seafood")}
          </option>
          <option value="Dairy & Eggs">
            {t("search.options.Dairy & Eggs")}
          </option>
          <option value="Chicken & Poultry">
            {t("search.options.Chicken & Poultry")}
          </option>
          <option value="Grains & Rice">
            {t("search.options.Grains & Rice")}
          </option>
          <option value="Fruits & Berries">
            {t("search.options.Fruits & Berries")}
          </option>
          <option value="Sausage">{t("search.options.Sausage")}</option>
        </select>
        <select
          className={styles.searchSelect}
          value={subType}
          onChange={(event) => setSubType(event.target.value)}
        >
          <option value="">{t("search.options.selectSubType")}</option>
          {foodType &&
            foodSubTypes[foodType] &&
            foodSubTypes[foodType].map((subTypeOption) => (
              <option key={subTypeOption} value={subTypeOption}>
                {t(`search.options.${subTypeOption}`)}
              </option>
            ))}
        </select>
        <fieldset className={styles.dietaryPreferencesContainer}>
          <legend className={styles.dietaryPreferencesLegend}>
            {t("search.dietaryPreferences")}:
          </legend>
          {[
            "Vegan",
            "Vegetarian",
            "glutenFree",
            "dairyFree",
            "Paleo",
            "Keto",
            "lowCarb",
            "lowFat",
            "lowSodium",
            "sugarFree",
            "Lactose-intolerant",
            "Egg-free",
          ].map((preference) => (
            <div className={styles.preferenceItem} key={preference}>
              <input
                type="checkbox"
                id={preference.toLowerCase().replace("-", "")}
                name="dietaryPreference"
                value={preference}
                checked={dietaryPreferences.includes(preference)}
                onChange={handleDietaryPreferencesChange}
              />

              <label htmlFor={preference.toLowerCase().replace("-", "")}>
                {t(
                  `search.dietaryOptions.${preference
                    .toLowerCase()
                    .replace("-", "")}`
                )}
              </label>
            </div>
          ))}
        </fieldset>
        <div className={styles.searchOptionsContainer}>
          <div className={styles.optionContainer}>
            <input
              type="checkbox"
              checked={searchByUsername}
              onChange={(e) => setSearchByUsername(e.target.checked)}
            />
            <label className={styles.textOptions}>
              {t("search.searchByUsername")}
            </label>
          </div>

          <div className={styles.optionContainer}>
            <input
              type="checkbox"
              checked={searchByLikes}
              onChange={(e) => setSearchByLikes(e.target.checked)}
            />
            <label className={styles.textOptions}>
              {t("search.include_liked")}
            </label>
          </div>

          <div className={styles.optionContainer}>
            <label>
              Maximum Cook Time: {maxCookTime} minutes
              <input
                type="range"
                min="0"
                max="600"
                value={maxCookTime}
                onChange={handleMaxCookTimeChange}
              />
            </label>
          </div>
        </div>
        <button onClick={handleSearch} className={styles.searchButton}>
          {t("search.search_button")}
        </button>
        <button onClick={resetSearch} className={styles.resetButton}>
          {t("search.reset_button")}
        </button>
      </div>
      <div
        className={`${styles.resultsContainer} ${
          searchResults.length > 0 ? styles.hasResults : ""
        }`}
      >
        {searchResults.length > 0
          ? searchResults.map((recipe) => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
                {recipe.name}
              </Link>
            ))
          : searchTerm.length > 0 &&
            searchPerformed && <p>{t("search.no_results")}</p>}
      </div>
    </div>
  );
};

export default Search;
