import React from "react";

const RegisterButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={styles.button}>
      Register Here
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "8px 16px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "14px",
    margin: "4px 2px",
    cursor: "pointer",
  },
};

export default RegisterButton;
