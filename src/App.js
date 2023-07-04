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

  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log("handleLogin called, isLoggedIn:", isLoggedIn);
  };

  useEffect(() => {
    console.log("isLoggedIn value:", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setLoggedOutMessage(t("logged_out"));
    setTimeout(() => {
      setLoggedOutMessage("");
    }, 3000);
  }, [t]);

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        {loggedOutMessage && <p>{loggedOutMessage}</p>}
        <AppRoutes
          onLogin={handleLogin}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
      </Layout>
    </Router>
  );
}

export default App;
