import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./Register.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const { t } = useTranslation();
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password !== value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match. Please try again.",
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please try again.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      const response = await registerUser(username, email, password);
      console.log(response);
      setSuccessMessage(
        "User created successfully. Please confirm your email."
      );
      setServerError(null);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response ? error.response.data : error
      );
      setServerError(
        error.response ? error.response.data.message : error.toString()
      );
    }
  };
  return (
    <div className={styles.container}>
      <h2>{t("register.title")}</h2>
      {successMessage && <p>{successMessage}</p>}
      {serverError && <p className={styles.error}>{serverError}</p>}
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <div className={styles.formGroup}>
          <label htmlFor="username">{t("register.username")}:</label>
          <input
            className={styles.inputGroup}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">{t("register.email")}:</label>
          <input
            className={styles.inputGroup}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">{t("register.password")}:</label>
          <input
            className={styles.inputGroup}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">
            {t("register.confirm_password")}:
          </label>
          <input
            className={styles.inputGroup}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className={styles.registerButton}>
          {t("register.register_button")}
        </button>
      </form>
    </div>
  );
};
export default Register;
