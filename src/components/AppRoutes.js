import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import RecipeList from "./RecipeList";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe";
import RandomRecipe from "./RandomRecipe";
import Login from "./Login";
import Recipe from "./Recipe";
import Register from "./Register";
import Home from "./Home";
import Search from "./Search";
import ForgotPassword from "./ForgotPassword";
import ConfirmEmail from "./ConfirmEmail";
import ResetPassword from "./ResetPassword";
import Profile from "./Profile";
import Contact from "./Contact";
const AppRoutes = ({ onLogin, isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

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
  }, [handleLogout, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<RecipeList />} />
      <Route path="/recipes/add" element={<AddRecipe />} />
      <Route path="/recipes/edit/:id" element={<EditRecipe />} />
      <Route path="/random-recipe" element={<RandomRecipe />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recipes/:id" element={<Recipe isLoggedIn={isLoggedIn} />} />
      <Route path="/search" element={<Search />} />
      <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes;
