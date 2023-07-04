import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faDice,
  faSearch,
  faKey,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isLoggedIn, onLogout, sticky }) => {
  console.log("Navbar isLoggedIn:", isLoggedIn);
  const navigate = useNavigate();

  const { t } = useTranslation();
  const handleLogout = async () => {
    await logoutUser();
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
        <FontAwesomeIcon icon={faHome} /> {t("navbar.home")}
      </NavLink>
      <NavLink to="/recipes" activeClassName={styles.active}>
        <FontAwesomeIcon icon={faBookOpen} />
        Recipes {t("navbar.recipes")}
      </NavLink>
      <NavLink to="/random-recipe" activeClassName={styles.active}>
        <FontAwesomeIcon icon={faDice} /> {t("navbar.random_recipe")}
      </NavLink>
      <NavLink to="/search" activeClassName={styles.active}>
        <FontAwesomeIcon icon={faSearch} /> {t("navbar.search")}
      </NavLink>
      {isLoggedIn ? (
        <>
          <NavLink to="/recipes/add" activeClassName={styles.active}>
            <FontAwesomeIcon icon={faBookOpen} /> {t("navbar.add_recipe")}
          </NavLink>
          <NavLink to="/profile" activeClassName={styles.active}>
            <FontAwesomeIcon icon={faUser} /> {t("navbar.profile")}
          </NavLink>

          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faKey} /> {t("navbar.logout")}
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" activeClassName={styles.active}>
            <FontAwesomeIcon icon={faKey} /> {t("navbar.login")}
          </NavLink>
          <NavLink to="/register" activeClassName={styles.active}>
            <FontAwesomeIcon icon={faKey} /> {t("navbar.register")}
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;
