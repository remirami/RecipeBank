import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const StickyNavBar = ({ isLoggedIn, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    // Clear user data from local storage
    localStorage.removeItem("recipeAppToken");
    localStorage.removeItem("recipeAppUser");
    localStorage.removeItem("userId");

    // Navigate the user back to the homepage
    navigate("/");

    // Call onLogout prop function to update the parent component
    onLogout();
  };

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" activeClassName={styles.active}>
        {t("navbar.home")}
      </NavLink>
      <NavLink to="/recipes" activeClassName={styles.active}>
        {t("navbar.recipes")}
      </NavLink>
      <NavLink to="/random-recipe" activeClassName={styles.active}>
        {t("navbar.random_recipe")}
      </NavLink>
      <NavLink to="/search" activeClassName={styles.active}>
        {t("navbar.search")}
      </NavLink>
      {isLoggedIn ? (
        <>
          <NavLink to="/recipes/add" activeClassName={styles.active}>
            {t("navbar.add_recipe")}
          </NavLink>
          <NavLink to="/profile" activeClassName={styles.active}>
            {t("navbar.profile")}
          </NavLink>
          <button onClick={handleLogout}>{t("navbar.logout")}</button>
        </>
      ) : (
        <>
          <NavLink to="/login" activeClassName={styles.active}>
            {t("navbar.login")}
          </NavLink>
          <NavLink to="/register" activeClassName={styles.active}>
            {t("navbar.register")}
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default StickyNavBar;
