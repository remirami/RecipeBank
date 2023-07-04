import React, { useState } from "react";
import { searchRecipes } from "../services/api";
import OpenBook from "./OpenBook";
import { useTranslation } from "react-i18next";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchByLikes, setSearchByLikes] = useState(false);

  const { t } = useTranslation();

  const handleSearch = async () => {
    const results = await searchRecipes(
      searchTerm,
      selectedCategory,
      searchByLikes
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
          <option value="">{t("addRecipe.options.selectCategory")}</option>
          <option value="Vegetable">{t("addRecipe.options.vegetable")}</option>
          <option value="Meat">{t("addRecipe.options.meat")}</option>
          <option value="Dessert">{t("addRecipe.options.dessert")}</option>
          <option value="Fish">{t("addRecipe.options.fish")}</option>
          <option value="Dairy">{t("addRecipe.options.dairy")}</option>
          <option value="Poultry">{t("addRecipe.options.poultry")}</option>
          <option value="Grains">{t("addRecipe.options.grains")}</option>
          <option value="Legumes">{t("addRecipe.options.legumes")}</option>
          <option value="Fruits">{t("addRecipe.options.fruits")}</option>
          <option value="Nuts">{t("addRecipe.options.nuts")}</option>
          <option value="Beverages">{t("addRecipe.options.beverages")}</option>
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
          <option value="Dairy-free">{t("addRecipe.options.dairyFree")}</option>
          <option value="Paleo">{t("addRecipe.options.paleo")}</option>
          <option value="Keto">{t("addRecipe.options.keto")}</option>
          <option value="Low-carb">{t("addRecipe.options.lowCarb")}</option>
          <option value="Low-fat">{t("addRecipe.options.lowFat")}</option>
          <option value="Low-sodium">{t("addRecipe.options.lowSodium")}</option>

          <option value="Sugar-free">{t("addRecipe.options.sugarFree")}</option>
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
