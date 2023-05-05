import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Welcome.module.css";
const Welcome = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>{t("welcome")}</h1>
        <div className={styles.languageButtons}>
          <button onClick={() => changeLanguage("en")}>English</button>
          <button onClick={() => changeLanguage("fi")}>Suomi</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
