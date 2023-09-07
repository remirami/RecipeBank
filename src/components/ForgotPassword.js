import React, { useState } from "react";
import { forgotPassword } from "../services/api";
import styles from "./ForgotPassword.module.css";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      setMessage("An email with password reset instructions has been sent.");
    } catch (error) {
      setMessage("Error: Could not send password reset email.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>{t("forgot.password")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email">{t("forgotPassword.Email")}</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div></div>
        <button className={styles.button} type="submit">
          {t("forgotPassword.Submit")}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
