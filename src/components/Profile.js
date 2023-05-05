import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  getUserRecipes,
  changeUserPassword,
} from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./Profile.module.css";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const { t } = useTranslation();

  const fetchProfileData = async () => {
    try {
      const userProfileResponse = await getUserProfile();
      setUser(userProfileResponse);

      const userRecipesResponse = await getUserRecipes();
      setRecipes(userRecipesResponse);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const handleChangePassword = async (event) => {
    event.preventDefault();

    // Get form data
    const currentPassword = event.target.currentPassword.value;
    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      // Call the API to change the user's password
      await changeUserPassword(user._id, currentPassword, newPassword);

      // If successful, hide the form and show a success message
      setShowChangePasswordForm(false);
      alert("Password changed successfully!");
    } catch (error) {
      // Handle errors (e.g., incorrect current password or server error)
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };
  const toggleChangePasswordForm = () => {
    setShowChangePasswordForm(!showChangePasswordForm);
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("profile.title")}</h1>
      {user ? (
        <div className={styles.userDetails}>
          <h2>{user.name}</h2>
          <div className={styles.userinfo}>
            <p>
              {t("profile.username")}: {user.username}
            </p>
            <p>
              {t("profile.email")}: {user.email}
            </p>
          </div>
        </div>
      ) : (
        <p>{t("profile.loadingUserData")}</p>
      )}

      <h2>{t("profile.yourRecipes")}</h2>
      <button
        onClick={toggleChangePasswordForm}
        className={styles.changePasswordButton}
      >
        {t("profile.changePassword")}
      </button>
      {showChangePasswordForm && (
        <form onSubmit={handleChangePassword}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="password"
              name="currentPassword"
              placeholder={t("profile.currentPassword")}
              style={{ maxWidth: "150px" }}
            />
            <input
              type="password"
              name="newPassword"
              placeholder={t("profile.newPassword")}
              style={{ maxWidth: "150px" }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder={t("profile.confirmNewPassword")}
              style={{ maxWidth: "150px" }}
            />
          </div>
          <br />
          <button type="submit">{t("profile.changePassword")}</button>
        </form>
      )}

      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id}>{recipe.name}</li>
          ))}
        </ul>
      ) : (
        <p>{t("profile.noRecipes")}</p>
      )}
    </div>
  );
};
export default Profile;
