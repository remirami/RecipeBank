import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);

      if (response.data && response.data.token) {
        setSuccessMessage(t("logged_in_successfully"));
        onLogin();
      } else {
        setErrorMessage(t("login.errors.missingToken"));
      }
    } catch (error) {
      setErrorMessage(t("login.errors.invalidCredentials"));
    }
  };

  return (
    <div className={styles.container}>
      {successMessage ? (
        <p>{successMessage}</p>
      ) : (
        <>
          <h2>{t("login.title")}</h2>
          {errorMessage && <p>{errorMessage}</p>}
          <form onSubmit={handleSubmit} className={styles.formWrapper}>
            <div className={styles.formGroup}>
              <label htmlFor="username">{t("login.username")}:</label>
              <input
                className={styles.inputField}
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">{t("login.password")}:</label>
              <input
                className={styles.inputField}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.loginButton}>
                {t("login.login_button")}
              </button>
              <div className={styles.forgotButton}>
                <Link to="/forgot-password">{t("login.forgotpassword")}</Link>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default Login;
