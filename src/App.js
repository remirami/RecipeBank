import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import AppRoutes from "./components/AppRoutes";
import Search from "./components/Search";
import AddRecipe from "./components/AddRecipe";
import { useTranslation } from "react-i18next";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedOutMessage, setLoggedOutMessage] = useState("");
  const { t } = useTranslation();

  const isTokenExpired = () => {
    const token = localStorage.getItem("recipeAppToken");

    if (!token) {
      return true;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));

    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return true;
    }

    return false;
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log("handleLogin called, isLoggedIn:", isLoggedIn);
  };

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setLoggedOutMessage(t("logged_out"));
    setTimeout(() => {
      setLoggedOutMessage("");
    }, 3000);
  }, [t]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        handleLogout();
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, [handleLogout]);

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        {loggedOutMessage && <p>{loggedOutMessage}</p>}
        <AppRoutes onLogin={handleLogin} isLoggedIn={isLoggedIn} />
      </Layout>
    </Router>
  );
}

export default App;
