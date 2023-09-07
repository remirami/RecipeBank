import React, { useState } from "react";
import { searchRecipes } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
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
      selectedCategory,
      searchByLikes,
      foodType,
      subType,
      dietaryPreferences,
      cookTime
    );

    if (response && response.data && response.data.recipes) {
      setSearchResults(response.data.recipes);
    } else {
      console.error(
        "searchRecipes response does not contain data.recipes property",
        response
      );
      setSearchResults([]); // Use an empty array as a fallback
    }

    setSearchPerformed(true);
  };
  const handleCheckboxChange = (event) => {
    setSearchByLikes(event.target.checked);
  };
  const handleCookTimeInput = (event) => {
    // Allow only numbers
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    if (event.target.value === "" || re.test(event.target.value)) {
      setCookTime(event.target.value);
    }
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
    setSelectedCategory("");
    setSearchByLikes(false);
    setFoodType("");
    setSubType("");
    setDietaryPreferences([]);
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.searchHeading}>{t("search.search_recipes")}</h1>
      <div className={styles.searchContent}>
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
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">{t("search.options.selectCategory")}</option>
            <option value="Dessert">{t("search.options.Dessert")}</option>
            <option value="Main Course">
              {t("search.options.Main Course")}
            </option>
            <option value="Appetizer">{t("search.options.Appetizer")}</option>
            <option value="Breakfast">{t("search.options.Breakfast")}</option>
            <option value="Side Dish">{t("search.options.Side Dish")}</option>
            <option value="Salad">{t("search.options.Salad")}</option>
            <option value="Soup">{t("search.options.Soup")}</option>
            <option value="Snack">{t("search.options.Snack")}</option>
            <option value="Pizza">{t("search.options.Pizza")}</option>
            <option value="Bread">{t("search.options.Bread")}</option>
            <option value="Beverage">{t("search.options.Beverage")}</option>
            <option value="Pasta">{t("search.options.Pasta")}</option>
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
              ))}{" "}
          </select>
          <label className={styles.labelContainer}>
            {t("search.dietaryPreferences")}:
            <div className={styles.formElement}>
              <input
                type="checkbox"
                id="vegan"
                name="dietaryPreference"
                value="Vegan"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="vegan">{t("search.dietaryOptions.vegan")}</label>
              <input
                type="checkbox"
                id="vegetarian"
                name="dietaryPreference"
                value="Vegetarian"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="vegetarian">
                {t("search.dietaryOptions.vegetarian")}
              </label>
              <input
                type="checkbox"
                id="glutenFree"
                name="dietaryPreference"
                value="Gluten-free"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="glutenFree">
                {t("search.dietaryOptions.glutenFree")}
              </label>
              <input
                type="checkbox"
                id="dairyFree"
                name="dietaryPreference"
                value="Dairy-free"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="dairyFree">
                {t("search.dietaryOptions.dairyFree")}
              </label>
              <input
                type="checkbox"
                id="paleo"
                name="dietaryPreference"
                value="Paleo"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="paleo">{t("search.dietaryOptions.paleo")}</label>
              <input
                type="checkbox"
                id="keto"
                name="dietaryPreference"
                value="Keto"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="keto">{t("search.dietaryOptions.keto")}</label>
              <input
                type="checkbox"
                id="lowCarb"
                name="dietaryPreference"
                value="Low-carb"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="lowCarb">
                {t("search.dietaryOptions.lowCarb")}
              </label>
              <input
                type="checkbox"
                id="lowFat"
                name="dietaryPreference"
                value="Low-fat"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="lowFat">
                {t("search.dietaryOptions.lowFat")}
              </label>
              <input
                type="checkbox"
                id="lowSodium"
                name="dietaryPreference"
                value="Low-sodium"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="lowSodium">
                {t("search.dietaryOptions.lowSodium")}
              </label>
              <input
                type="checkbox"
                id="sugarFree"
                name="dietaryPreference"
                value="Sugar-free"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="sugarFree">
                {t("search.dietaryOptions.sugarFree")}
              </label>
              <input
                type="checkbox"
                id="lactoseIntolerant"
                name="dietaryPreference"
                value="Lactose-intolerant"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="lactoseIntolerant">
                {t("search.dietaryOptions.lactoseIntolerant")}
              </label>
              <input
                type="checkbox"
                id="eggFree"
                name="dietaryPreference"
                value="Egg-free"
                onChange={handleDietaryPreferencesChange}
              />
              <label htmlFor="eggFree">
                {t("search.dietaryOptions.eggFree")}
              </label>{" "}
            </div>
          </label>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={searchByLikes}
              onChange={handleCheckboxChange}
            />
            <label className={styles.checkboxLabel}>
              {t("search.search_by_likes")}
            </label>
            <input
              className={styles.searchInput}
              type="number"
              placeholder={t("search.cookTime_placeholder")}
              value={cookTime}
              onChange={handleCookTimeInput}
            />
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
    </div>
  );
};

export default Search;
