import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import { useTranslation } from "react-i18next";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await resetPassword(token, password);
      setMessage("Password has been reset successfully.");
    } catch (error) {
      setMessage("Error: Could not reset password.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>{t("reset.ResetPassword")}</h2>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <label htmlFor="password">{t("reset.NewPassword")}</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordConfirm">{t("reset.ConfirmPassword")}</label>
        <input
          type="password"
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          {t("reset.Submit")}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
