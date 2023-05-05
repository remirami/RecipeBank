import React from "react";
import { Route, Routes } from "react-router-dom";
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

const AppRoutes = ({ onLogin, isLoggedIn }) => {
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
    </Routes>
  );
};

export default AppRoutes;
