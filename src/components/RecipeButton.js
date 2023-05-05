import React from "react";

const RecipeButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={styles.button}>
      IsClicked
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
  },
};

export default RecipeButton;
