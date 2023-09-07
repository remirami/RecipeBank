import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./RandomRecipeButton.module.css";

const RandomRecipeButton = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <button onClick={onClick} className={styles.randomButton}>
        {t("randomRecipeButton.text")}
      </button>
      <br></br>
    </div>
  );
};

export default RandomRecipeButton;
