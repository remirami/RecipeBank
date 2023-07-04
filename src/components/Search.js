import React, { useState } from "react";
import { searchRecipes } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchByLikes, setSearchByLikes] = useState(false);
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
    const results = await searchRecipes(
      searchTerm,
      selectedCategory,
      searchByLikes,
      foodType,
      subType
    );
    setSearchResults(results);
    setSearchPerformed(true);
  };
  const handleCheckboxChange = (event) => {
    setSearchByLikes(event.target.checked);
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const resetSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSearchByLikes(false);
    setFoodType("");
    setSubType("");
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
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">{t("search.options.selectCategory")}</option>
          <option value="Dessert">{t("search.options.Dessert")}</option>
          <option value="Main Course">{t("search.options.Main Course")}</option>
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
        </select>

        <select
          className={styles.searchSelect}
          value={subType}
          onChange={(event) => setSubType(event.target.value)}
        >
          <option value="">{t("search.options.selectSubType")}</option>
          {foodType &&
            foodSubTypes[foodType].map((subTypeOption) => (
              <option key={subTypeOption} value={subTypeOption}>
                {t(`search.options.${subTypeOption}`)}
              </option>
            ))}
        </select>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={searchByLikes}
            onChange={handleCheckboxChange}
          />
          <label className={styles.checkboxLabel}>
            {t("search.search_by_likes")}
          </label>
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
